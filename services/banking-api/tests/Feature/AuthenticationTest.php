<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    public function test_login_success_and_session_endpoint(): void
    {
        $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'password'])
            ->assertOk()->assertExactJson([
                'authenticated' => true,
                'memberId' => 'member-1001',
                'displayName' => 'Alex Morgan',
                'expiresAt' => '2026-08-01T12:00:00Z',
            ]);

        $this->getJson('/api/session')->assertOk()->assertJsonPath('displayName', 'Alex Morgan');
    }

    public function test_login_failure_is_unauthorized(): void
    {
        $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'wrong'])
            ->assertUnauthorized()->assertJsonPath('error.code', 'invalid_credentials');
    }

    public function test_logout_clears_session(): void
    {
        $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'password']);
        $this->postJson('/api/logout')->assertOk()->assertExactJson(['authenticated' => false]);
        $this->getJson('/api/session')->assertUnauthorized();
    }

    public function test_expired_scenario_clears_session(): void
    {
        $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'password']);
        $this->getJson('/api/session?scenario=expired')->assertUnauthorized();
        $this->getJson('/api/dashboard')->assertUnauthorized();
    }

    public function test_protected_endpoint_is_unauthorized_without_session(): void
    {
        $this->getJson('/api/dashboard')->assertUnauthorized()->assertExactJson([
            'error' => ['code' => 'unauthorized', 'message' => 'Authentication is required.'],
        ]);
    }
}
