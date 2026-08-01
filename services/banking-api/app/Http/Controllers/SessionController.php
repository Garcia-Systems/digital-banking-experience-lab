<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SessionController
{
    public const MOBILE_TOKEN = 'lab-session-member-1001';

    public const MOBILE_REVOCATION_KEY = 'laboratory.mobile-session.member-1001.revoked';

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

        if ($request->header('X-Laboratory-Client') === 'mobile') {
            Cache::forget(self::MOBILE_REVOCATION_KEY);

            return response()->json(self::SESSION + [
                'laboratorySessionToken' => self::MOBILE_TOKEN,
            ]);
        }

        return response()->json(self::SESSION);
    }

    public function logout(Request $request): JsonResponse
    {
        if ($request->bearerToken() !== null) {
            if ($request->bearerToken() !== self::MOBILE_TOKEN || Cache::has(self::MOBILE_REVOCATION_KEY)) {
                return response()->json([
                    'error' => ['code' => 'unauthorized', 'message' => 'Authentication is required.'],
                ], 401);
            }

            Cache::put(self::MOBILE_REVOCATION_KEY, true);

            return response()->json(['authenticated' => false]);
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['authenticated' => false]);
    }

    public function show(Request $request): JsonResponse
    {
        if ($request->query('scenario') === 'expired') {
            if ($request->bearerToken() !== null) {
                Cache::put(self::MOBILE_REVOCATION_KEY, true);
            } else {
                $request->session()->forget('laboratory_session');
            }
        }

        if ($request->bearerToken() !== null) {
            if ($request->bearerToken() !== self::MOBILE_TOKEN || Cache::has(self::MOBILE_REVOCATION_KEY)) {
                return response()->json([
                    'authenticated' => false,
                    'error' => ['code' => 'unauthorized', 'message' => 'Authentication is required.'],
                ], 401);
            }

            return response()->json(self::SESSION);
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
