<?php

namespace App\Http\Controllers\Operations;

use Illuminate\Http\JsonResponse;

class MemberController
{
    public function index(): JsonResponse
    {
        return new JsonResponse(['members' => (require base_path('fixtures/operations.php'))['members']]);
    }

    public function show(string $memberId): JsonResponse
    {
        $fixtures = require base_path('fixtures/operations.php');
        foreach ($fixtures['members'] as $member) {
            if ($member['memberId'] === $memberId) {
                return new JsonResponse(['member' => $member, 'transfers' => array_values(array_filter($fixtures['transfers'], fn (array $item): bool => $item['memberId'] === $memberId)), 'failures' => array_values(array_filter($fixtures['failures'], fn (array $item): bool => str_contains($item['member'], $memberId)))]);
            }
        }
        return new JsonResponse(['error' => ['code' => 'member_not_found', 'message' => 'Member not found.']], 404);
    }
}
