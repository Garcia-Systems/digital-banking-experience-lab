<?php

namespace App\Http\Controllers\Operations;

use Illuminate\Http\JsonResponse;

class DashboardController
{
    public function __invoke(): JsonResponse
    {
        return new JsonResponse((require base_path('fixtures/operations.php'))['dashboard']);
    }
}
