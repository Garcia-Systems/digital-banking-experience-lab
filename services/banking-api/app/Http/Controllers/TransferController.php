<?php

namespace App\Http\Controllers;

use App\Support\TransferStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransferController
{
    public function store(Request $request): JsonResponse
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

        $scenario = $request->query('scenario', 'accepted');
        if (! in_array($scenario, ['accepted', 'completed', 'rejected'], true)) {
            return response()->json(['error' => [
                'code' => 'unsupported_transfer_scenario',
                'message' => 'The requested transfer scenario is not supported.',
            ]], 400);
        }

        return response()->json(TransferStore::submit($key, $validated, $scenario), 201);
    }

    public function show(string $transferId): JsonResponse
    {
        $transfer = TransferStore::find($transferId);

        if ($transfer === null) {
            return response()->json(['error' => [
                'code' => 'transfer_not_found',
                'message' => 'The requested transfer could not be found.',
            ]], 404);
        }

        return response()->json($transfer);
    }
}
