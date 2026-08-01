<?php

namespace App\Http\Controllers;

use App\Support\TransferStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class TransferController
{
    public function store(Request $request): JsonResponse
    {
        $accounts = ['account-2001', 'account-2002'];
        $availableBalances = ['account-2001' => 125000, 'account-2002' => 420000];
        $validator = Validator::make($request->all(), [
            'sourceAccount' => ['required', 'string', Rule::in($accounts), 'different:destinationAccount'],
            'destinationAccount' => ['required', 'string', Rule::in($accounts)],
            'amountCents' => ['required', 'integer', 'min:1'],
            'memo' => ['present', 'string', 'max:100'],
            'idempotencyKey' => ['required', 'string', 'max:200'],
        ], [
            'sourceAccount.required' => 'Choose a source account.',
            'sourceAccount.in' => 'Choose a valid source account.',
            'sourceAccount.different' => 'Source and destination accounts must be different.',
            'destinationAccount.required' => 'Choose a destination account.',
            'destinationAccount.in' => 'Choose a valid destination account.',
            'amountCents.required' => 'Transfer amount is required.',
            'amountCents.integer' => 'Enter a valid transfer amount.',
            'amountCents.min' => 'Transfer amount must be greater than zero.',
            'memo.present' => 'Include a memo value, even when it is empty.',
            'memo.string' => 'Memo must be text.',
            'memo.max' => 'Memo must be 100 characters or fewer.',
            'idempotencyKey.required' => 'The transfer request is incomplete. Review and submit it again.',
            'idempotencyKey.max' => 'The transfer request is incomplete. Review and submit it again.',
        ]);

        $validator->after(function ($validator) use ($request, $availableBalances): void {
            $sourceAccount = $request->input('sourceAccount');
            $amountCents = $request->input('amountCents');

            if (isset($availableBalances[$sourceAccount])
                && is_int($amountCents)
                && $amountCents > $availableBalances[$sourceAccount]) {
                $balance = number_format($availableBalances[$sourceAccount] / 100, 2);
                $validator->errors()->add('amountCents', "Amount cannot exceed the available balance of \${$balance}.");
            }
        });

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $validated = $validator->validated();

        $key = $validated['idempotencyKey'];
        unset($validated['idempotencyKey']);

        $scenario = $request->query('scenario', 'accepted');
        if ($scenario === 'unavailable') {
            return response()->json(['error' => [
                'code' => 'transfers_unavailable',
                'message' => 'Transfers are temporarily unavailable.',
                'retryAvailable' => true,
            ]], 503);
        }
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
