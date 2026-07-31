<?php

namespace Tests\Feature;

use Tests\TestCase;

class MemberVerificationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'password']);
    }

    public function test_verification_is_initially_not_started(): void
    {
        $this->getJson('/api/member-verification')->assertOk()
            ->assertJsonPath('status', 'not_started')->assertJsonPath('lastAttemptAt', null);
    }

    /** @dataProvider scenarios */
    public function test_vendor_scenarios_are_deterministic(string $scenario, string $status, bool $canRetry): void
    {
        $expected = $this->postJson("/api/member-verification?scenario={$scenario}")->assertOk()
            ->assertJsonPath('status', $status)->assertJsonPath('canRetry', $canRetry)->json();

        $this->getJson('/api/member-verification')->assertExactJson($expected);
    }

    public static function scenarios(): array
    {
        return [
            'success' => ['success', 'verified', false],
            'timeout' => ['timeout', 'retry_required', true],
            'unavailable service' => ['unavailable', 'retry_required', true],
            'invalid response' => ['invalid-response', 'retry_required', true],
            'permanent failure' => ['permanent-failure', 'verification_failed', false],
        ];
    }

    public function test_failure_message_does_not_expose_vendor_details(): void
    {
        $this->postJson('/api/member-verification?scenario=permanent-failure')->assertOk()
            ->assertExactJson([
                'status' => 'verification_failed',
                'message' => "We couldn't verify your information. Please contact Harbor Community Credit Union.",
                'canRetry' => false,
                'lastAttemptAt' => '2026-07-31T12:00:00Z',
            ]);
    }
}
