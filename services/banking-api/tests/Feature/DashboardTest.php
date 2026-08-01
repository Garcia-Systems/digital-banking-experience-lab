<?php

namespace Tests\Feature;

use Tests\TestCase;

class DashboardTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->withSession(['laboratory_session' => ['authenticated' => true]]);
    }
    public function test_success_returns_the_deterministic_dashboard(): void
    {
        $response = $this->getJson('/api/dashboard?scenario=success');
        $response->assertOk()->assertJsonStructure([
            'member' => ['id', 'displayName'],
            'projection' => ['generatedAt', 'isStale'],
            'accounts' => [['id', 'type', 'status', 'displayName', 'accountSuffix', 'availableBalanceCents', 'currentBalanceCents', 'transactions']],
        ])->assertJsonCount(2, 'accounts')
            ->assertJsonPath('projection.generatedAt', '2026-07-31T12:00:00Z')
            ->assertJsonPath('accounts.0.transactions.0.description', 'Harbor Market')
            ->assertJsonPath('accounts.0.transactions.0.amountCents', -7452)
            ->assertJsonPath('accounts.0.transactions.0.type', 'card purchase')
            ->assertJsonPath('accounts.0.transactions.0.postedAt', '2026-07-30');
    }

    public function test_empty_is_a_successful_projection_without_accounts(): void
    {
        $this->getJson('/api/dashboard?scenario=empty')->assertOk()->assertJsonCount(0, 'accounts');
    }

    public function test_stale_returns_accounts_and_a_stale_projection(): void
    {
        $this->getJson('/api/dashboard?scenario=stale')->assertOk()
            ->assertJsonPath('projection.isStale', true)->assertJsonCount(2, 'accounts');
    }

    public function test_error_is_a_safe_controlled_failure(): void
    {
        $this->getJson('/api/dashboard?scenario=error')->assertStatus(503)->assertExactJson([
            'error' => [
                'code' => 'dashboard_unavailable',
                'message' => 'Dashboard information is temporarily unavailable.',
                'retryAvailable' => true,
            ],
        ]);
    }

    public function test_partial_intentionally_violates_the_contract(): void
    {
        $this->getJson('/api/dashboard?scenario=partial')->assertOk()->assertJsonMissingPath('accounts');
    }

    public function test_unknown_scenario_is_a_predictable_client_error(): void
    {
        $this->getJson('/api/dashboard?scenario=unknown')->assertStatus(400)->assertExactJson([
            'error' => ['code' => 'unsupported_scenario', 'message' => 'The requested dashboard scenario is not supported.'],
        ]);
    }

    public function test_repeated_requests_are_identical(): void
    {
        $first = $this->getJson('/api/dashboard?scenario=stale');
        $second = $this->getJson('/api/dashboard?scenario=stale');
        $this->assertSame($first->getContent(), $second->getContent());
    }
}
