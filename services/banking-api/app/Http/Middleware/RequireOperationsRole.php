<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireOperationsRole
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->header('X-Laboratory-Role') !== 'operations-user') {
            return new JsonResponse(['error' => ['code' => 'operations_unauthorized', 'message' => 'An operations session is required.']], 403);
        }

        return $next($request);
    }
}
