<?php

namespace Tests\Feature;

use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Cache::forget(SessionController::MOBILE_REVOCATION_KEY);
    }

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
        $this->assertArrayNotHasKey('accounts', $this->getJson('/api/dashboard')->json());
    }

    public function test_browser_session_still_accesses_dashboard(): void
    {
        $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'password'])->assertOk();
        $this->getJson('/api/dashboard')->assertOk()->assertJsonPath('member.id', 'member-1001');
    }

    public function test_mobile_login_returns_a_deterministic_laboratory_token(): void
    {
        $headers = ['X-Laboratory-Client' => 'mobile'];
        $first = $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'password'], $headers);
        $second = $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'password'], $headers);

        $first->assertOk()->assertJsonPath('laboratorySessionToken', SessionController::MOBILE_TOKEN);
        $this->assertSame($first->getContent(), $second->getContent());
    }

    public function test_valid_mobile_session_accesses_session_and_dashboard(): void
    {
        $headers = ['Authorization' => 'Bearer '.SessionController::MOBILE_TOKEN];
        $this->getJson('/api/session', $headers)->assertOk()->assertJsonPath('displayName', 'Alex Morgan');
        $this->getJson('/api/dashboard', $headers)->assertOk()->assertJsonPath('member.id', 'member-1001');
    }

    public function test_invalid_mobile_session_is_unauthorized_without_dashboard_data(): void
    {
        $response = $this->getJson('/api/dashboard', ['Authorization' => 'Bearer invalid-laboratory-token']);
        $response->assertUnauthorized()->assertJsonPath('error.code', 'unauthorized')->assertJsonMissingPath('accounts');
    }

    public function test_expired_mobile_session_is_unauthorized(): void
    {
        $headers = ['Authorization' => 'Bearer '.SessionController::MOBILE_TOKEN];
        $this->getJson('/api/session?scenario=expired', $headers)->assertUnauthorized();
        $this->getJson('/api/dashboard', $headers)->assertUnauthorized()->assertJsonMissingPath('accounts');
    }

    public function test_mobile_logout_revokes_dashboard_access_until_the_next_login(): void
    {
        $headers = ['Authorization' => 'Bearer '.SessionController::MOBILE_TOKEN];
        $this->postJson('/api/logout', [], $headers)->assertOk()->assertExactJson(['authenticated' => false]);
        $this->getJson('/api/dashboard', $headers)->assertUnauthorized();

        $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'password'], ['X-Laboratory-Client' => 'mobile'])->assertOk();
        $this->getJson('/api/dashboard', $headers)->assertOk();
    }
}
