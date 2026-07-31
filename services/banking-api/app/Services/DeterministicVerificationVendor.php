<?php

namespace App\Services;

final class DeterministicVerificationVendor
{
    /** @return array<string, mixed> */
    public function verify(string $scenario): array
    {
        return match ($scenario) {
            'success' => ['decision' => 'approved'],
            'timeout' => ['error' => 'timeout', 'retryable' => true],
            'unavailable' => ['error' => 'service_unavailable', 'retryable' => true],
            'invalid-response' => ['unexpected' => ['vendor_payload' => true]],
            'permanent-failure' => ['decision' => 'declined'],
            default => ['error' => 'unsupported_scenario', 'retryable' => false],
        };
    }
}
