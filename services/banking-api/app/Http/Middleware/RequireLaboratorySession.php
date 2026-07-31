<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireLaboratorySession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->has('laboratory_session')) {
            return response()->json([
                'error' => ['code' => 'unauthorized', 'message' => 'Authentication is required.'],
            ], 401);
        }

        return $next($request);
    }
}
