<?php

namespace Tests\Feature;

use Tests\TestCase;

class DashboardTest extends TestCase
{
    public function test_dashboard_returns_the_deterministic_fixture(): void
    {
        $response = $this->getJson('/api/dashboard');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'member' => ['id', 'displayName'],
                'projection' => ['generatedAt', 'isStale'],
                'accounts' => [['id', 'type', 'status', 'displayName', 'accountSuffix', 'availableBalanceCents', 'currentBalanceCents', 'transactions']],
            ])
            ->assertJsonPath('member.displayName', 'Alex Morgan')
            ->assertJsonCount(2, 'accounts')
            ->assertJsonPath('accounts.0.displayName', 'Everyday Checking')
            ->assertJsonPath('accounts.1.displayName', 'Member Savings')
            ->assertJsonPath('projection.generatedAt', '2026-07-31T12:00:00Z');
    }
}
