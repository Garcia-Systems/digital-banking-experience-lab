<?php

namespace App\Http\Controllers;

use App\Services\DeterministicVerificationVendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MemberVerificationController
{
    private const ATTEMPTED_AT = '2026-07-31T12:00:00Z';

    public function show(Request $request): JsonResponse
    {
        if ($request->query('scenario') === 'unavailable') {
            return response()->json(['error' => [
                'code' => 'verification_unavailable',
                'message' => 'Member verification is temporarily unavailable.',
                'retryAvailable' => true,
            ]], 503);
        }

        return response()->json($request->session()->get('member_verification', $this->notStarted()));
    }

    public function store(Request $request, DeterministicVerificationVendor $vendor): JsonResponse
    {
        $scenario = (string) $request->query('scenario', 'success');
        $attemptKey = "verification_attempts.{$scenario}";
        $attempt = (int) $request->session()->get($attemptKey, 0) + 1;
        $request->session()->put($attemptKey, $attempt);
        $result = $vendor->verify($scenario, $attempt);

        $verification = match (true) {
            ($result['decision'] ?? null) === 'approved' => $this->state(
                'verified',
                'Your identity has been verified. No further action is needed.',
                false,
            ),
            ($result['decision'] ?? null) === 'declined' => $this->state(
                'verification_failed',
                "Your verification was permanently rejected. Please contact Harbor Community Credit Union if you need assistance.",
                false,
            ),
            in_array(($result['decision'] ?? null), ['invalid_member', 'unsupported'], true) => $this->state(
                'verification_failed',
                "This request cannot succeed with the information provided. Please contact Harbor Community Credit Union if you need assistance.",
                false,
            ),
            ($result['retryable'] ?? false) === true => $this->state(
                'retry_required',
                "We couldn't complete your request right now.",
                true,
            ),
            default => $this->state(
                'verification_failed',
                'This request is not supported. Please contact Harbor Community Credit Union if you need assistance.',
                false,
            ),
        };

        $request->session()->put('member_verification', $verification);

        $httpStatus = match ($verification['status']) {
            'retry_required' => 503,
            'verification_failed' => 422,
            default => 200,
        };

        return response()->json($verification, $httpStatus);
    }

    /** @return array<string, mixed> */
    private function notStarted(): array
    {
        return [
            'status' => 'not_started',
            'lastAttemptAt' => null,
            'message' => 'Verify your identity to help us protect your membership.',
            'canRetry' => false,
        ];
    }

    /** @return array<string, mixed> */
    private function state(string $status, string $message, bool $canRetry): array
    {
        return compact('status', 'message', 'canRetry') + ['lastAttemptAt' => self::ATTEMPTED_AT];
    }
}
