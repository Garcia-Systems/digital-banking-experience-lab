<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController
{
    public function __invoke(Request $request): JsonResponse
    {
        $scenario = $request->query('scenario', 'success');
        $dashboard = require base_path('fixtures/dashboard.php');

        return match ($scenario) {
            'success' => response()->json($dashboard),
            'empty' => response()->json([...$dashboard, 'accounts' => []]),
            'stale' => response()->json([
                ...$dashboard,
                'projection' => [
                    'generatedAt' => '2026-07-31T10:15:00Z',
                    'isStale' => true,
                ],
            ]),
            'error' => response()->json([
                'error' => [
                    'code' => 'dashboard_unavailable',
                    'message' => 'Dashboard information is temporarily unavailable.',
                ],
            ], 503),
            'partial' => response()->json([
                'member' => $dashboard['member'],
                'projection' => $dashboard['projection'],
            ]),
            default => response()->json([
                'error' => [
                    'code' => 'unsupported_scenario',
                    'message' => 'The requested dashboard scenario is not supported.',
                ],
            ], 400),
        };
    }
}
