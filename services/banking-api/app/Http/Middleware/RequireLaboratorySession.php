<?php

namespace App\Http\Middleware;

use App\Http\Controllers\SessionController;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class RequireLaboratorySession
{
    public function handle(Request $request, Closure $next): Response
    {
        $hasBrowserSession = $request->session()->has('laboratory_session');
        $hasMobileSession = $request->bearerToken() === SessionController::MOBILE_TOKEN
            && ! Cache::has(SessionController::MOBILE_REVOCATION_KEY);

        if (! $hasBrowserSession && ! $hasMobileSession) {
            return response()->json([
                'error' => ['code' => 'unauthorized', 'message' => 'Authentication is required.'],
            ], 401);
        }

        return $next($request);
    }
}
