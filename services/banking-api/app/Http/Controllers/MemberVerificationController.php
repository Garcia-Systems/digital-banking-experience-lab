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
        return response()->json($request->session()->get('member_verification', $this->notStarted()));
    }

    public function store(Request $request, DeterministicVerificationVendor $vendor): JsonResponse
    {
        $result = $vendor->verify((string) $request->query('scenario', 'success'));

        $verification = match (true) {
            ($result['decision'] ?? null) === 'approved' => $this->state(
                'verified',
                'Your identity has been verified. No further action is needed.',
                false,
            ),
            ($result['decision'] ?? null) === 'declined' => $this->state(
                'verification_failed',
                "We couldn't verify your information. Please contact Harbor Community Credit Union.",
                false,
            ),
            ($result['retryable'] ?? false) === true => $this->state(
                'retry_required',
                'We could not complete verification right now. Please try again.',
                true,
            ),
            default => $this->state(
                'retry_required',
                'We could not complete verification right now. Please try again.',
                true,
            ),
        };

        $request->session()->put('member_verification', $verification);

        return response()->json($verification);
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
