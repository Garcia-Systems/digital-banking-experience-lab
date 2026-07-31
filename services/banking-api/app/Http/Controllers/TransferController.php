<?php

namespace App\Http\Controllers;

use App\Support\TransferStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransferController
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sourceAccount' => ['required', 'string', 'different:destinationAccount'],
            'destinationAccount' => ['required', 'string'],
            'amountCents' => ['required', 'integer', 'min:1'],
            'memo' => ['present', 'string', 'max:100'],
            'idempotencyKey' => ['required', 'string', 'max:200'],
        ]);

        $key = $validated['idempotencyKey'];
        unset($validated['idempotencyKey']);

        return response()->json(TransferStore::submit($key, $validated), 201);
    }
}
