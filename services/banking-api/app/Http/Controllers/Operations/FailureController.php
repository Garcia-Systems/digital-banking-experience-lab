<?php

namespace App\Http\Controllers\Operations;

use Illuminate\Http\JsonResponse;

class FailureController
{
    public function index(): JsonResponse
    {
        return new JsonResponse(['failures' => $this->failures()]);
    }

    public function show(string $failureId): JsonResponse
    {
        foreach ($this->failures() as $failure) {
            if ($failure['operationId'] === $failureId) {
                return new JsonResponse(['failure' => $failure]);
            }
        }

        return new JsonResponse(['error' => ['code' => 'failure_not_found', 'message' => 'Failed operation not found.']], 404);
    }

    private function failures(): array
    {
        return (require base_path('fixtures/operations.php'))['failures'];
    }
}
