<?php

namespace App\Support;

/**
 * Process-local teaching fixture. A production idempotency store must be durable
 * and shared by every API instance; this deliberately resets with the process.
 */
class TransferStore
{
    private static array $transfersByKey = [];
    private static array $transfersById = [];

    public static function submit(string $idempotencyKey, array $instruction, string $scenario = 'accepted'): array
    {
        if (isset(self::$transfersByKey[$idempotencyKey])) {
            return [...self::$transfersByKey[$idempotencyKey], 'duplicate' => true];
        }

        $sequence = count(self::$transfersByKey) + 1001;
        $transfer = [
            'transferId' => "TRN-{$sequence}",
            'status' => $scenario,
            'confirmationNumber' => 'HC-'.str_pad((string) $sequence, 7, '0', STR_PAD_LEFT),
            'submittedAt' => '2026-07-31T14:30:00Z',
            'idempotencyKey' => $idempotencyKey,
            'duplicate' => false,
            ...$instruction,
        ];

        self::$transfersByKey[$idempotencyKey] = $transfer;
        self::$transfersById[$transfer['transferId']] = $transfer;

        return $transfer;
    }

    public static function find(string $transferId): ?array
    {
        return self::$transfersById[$transferId] ?? null;
    }

    public static function reset(): void
    {
        self::$transfersByKey = [];
        self::$transfersById = [];
    }
}
