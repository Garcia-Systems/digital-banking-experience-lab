<?php

namespace App\Services;

final class DeterministicVerificationVendor
{
    /** @return array<string, mixed> */
    public function verify(string $scenario, int $attempt): array
    {
        return match ($scenario) {
            'success' => ['decision' => 'approved'],
            'timeout' => ['error' => 'timeout', 'retryable' => true],
            'unavailable' => ['error' => 'service_unavailable', 'retryable' => true],
            'temporary-upstream-failure' => ['error' => 'upstream_failure', 'retryable' => true],
            'timeout-then-success' => $attempt === 1
                ? ['error' => 'timeout', 'retryable' => true]
                : ['decision' => 'approved'],
            'invalid-member-information' => ['decision' => 'invalid_member'],
            'unsupported-request' => ['decision' => 'unsupported'],
            'permanent-failure' => ['decision' => 'declined'],
            default => ['error' => 'unsupported_scenario', 'retryable' => false],
        };
    }
}
