<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionController
{
    private const SESSION = [
        'authenticated' => true,
        'memberId' => 'member-1001',
        'displayName' => 'Alex Morgan',
        'expiresAt' => '2026-08-01T12:00:00Z',
    ];

    public function login(Request $request): JsonResponse
    {
        if ($request->input('memberId') !== 'member-1001' || $request->input('password') !== 'password') {
            return response()->json([
                'error' => ['code' => 'invalid_credentials', 'message' => 'The laboratory credentials were not recognized.'],
            ], 401);
        }

        $request->session()->regenerate();
        $request->session()->put('laboratory_session', self::SESSION);

        return response()->json(self::SESSION);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['authenticated' => false]);
    }

    public function show(Request $request): JsonResponse
    {
        if ($request->query('scenario') === 'expired') {
            $request->session()->forget('laboratory_session');
        }

        $session = $request->session()->get('laboratory_session');
        if (! $session) {
            return response()->json([
                'authenticated' => false,
                'error' => ['code' => 'unauthorized', 'message' => 'Authentication is required.'],
            ], 401);
        }

        return response()->json($session);
    }
}
