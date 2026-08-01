<?php

namespace App\Http\Controllers\Operations;

use Illuminate\Http\JsonResponse;

class TransferController
{
    public function index(): JsonResponse
    {
        return new JsonResponse(['transfers' => (require base_path('fixtures/operations.php'))['transfers']]);
    }

    public function show(string $transferId): JsonResponse
    {
        foreach ((require base_path('fixtures/operations.php'))['transfers'] as $transfer) {
            if ($transfer['transferId'] === $transferId) return new JsonResponse(['transfer' => $transfer]);
        }
        return new JsonResponse(['error' => ['code' => 'transfer_not_found', 'message' => 'Transfer not found.']], 404);
    }
}
