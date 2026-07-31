<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class DashboardController
{
    public function __invoke(): JsonResponse
    {
        return response()->json(require base_path('fixtures/dashboard.php'));
    }
}
