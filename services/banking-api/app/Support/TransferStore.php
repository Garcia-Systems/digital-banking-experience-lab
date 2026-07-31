<?php

namespace App\Support;

/**
 * Process-local teaching fixture. A production idempotency store must be durable
 * and shared by every API instance; this deliberately resets with the process.
 */
class TransferStore
{
    private static array $transfersByKey = [];

    public static function submit(string $idempotencyKey, array $instruction): array
    {
        if (isset(self::$transfersByKey[$idempotencyKey])) {
            return [...self::$transfersByKey[$idempotencyKey], 'duplicate' => true];
        }

        $sequence = count(self::$transfersByKey) + 1001;
        $transfer = [
            'transferId' => "TRN-{$sequence}",
            'status' => 'accepted',
            'confirmationNumber' => 'HC-'.str_pad((string) $sequence, 7, '0', STR_PAD_LEFT),
            'submittedAt' => '2026-07-31T14:30:00Z',
            'idempotencyKey' => $idempotencyKey,
            'duplicate' => false,
            ...$instruction,
        ];

        self::$transfersByKey[$idempotencyKey] = $transfer;

        return $transfer;
    }

    public static function reset(): void
    {
        self::$transfersByKey = [];
    }
}
