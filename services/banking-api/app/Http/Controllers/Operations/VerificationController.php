<?php

namespace App\Http\Controllers\Operations;

use Illuminate\Http\JsonResponse;

class VerificationController
{
    public function index(): JsonResponse
    {
        return new JsonResponse(['verifications' => $this->records()]);
    }

    public function show(string $verificationId): JsonResponse
    {
        foreach ($this->records() as $verification) {
            if ($verification['verificationId'] === $verificationId) return new JsonResponse(['verification' => $verification]);
        }
        return new JsonResponse(['error' => ['code' => 'verification_not_found', 'message' => 'Verification request not found.']], 404);
    }

    private function records(): array
    {
        return (require base_path('fixtures/operations.php'))['verifications'];
    }
}
