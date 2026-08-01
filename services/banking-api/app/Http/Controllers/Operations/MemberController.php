<?php

namespace App\Http\Controllers\Operations;

use Illuminate\Http\JsonResponse;

class MemberController
{
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(['members' => (require base_path('fixtures/operations.php'))['members']]);
    }
}
