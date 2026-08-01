<?php

namespace App\Http\Controllers\Operations;

use Illuminate\Http\JsonResponse;

class TransferController
{
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(['transfers' => (require base_path('fixtures/operations.php'))['transfers']]);
    }
}
