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
    public function test_vendor_scenarios_are_deterministic(string $scenario, string $status, bool $canRetry, int $httpStatus): void
    {
        $expected = $this->postJson("/api/member-verification?scenario={$scenario}")->assertStatus($httpStatus)
            ->assertJsonPath('status', $status)->assertJsonPath('canRetry', $canRetry)->json();

        $this->getJson('/api/member-verification')->assertExactJson($expected);
    }

    public static function scenarios(): array
    {
        return [
            'success' => ['success', 'verified', false, 200],
            'timeout' => ['timeout', 'retry_required', true, 503],
            'unavailable service' => ['unavailable', 'retry_required', true, 503],
            'temporary upstream failure' => ['temporary-upstream-failure', 'retry_required', true, 503],
            'invalid member information' => ['invalid-member-information', 'verification_failed', false, 422],
            'unsupported request' => ['unsupported-request', 'verification_failed', false, 422],
            'permanent failure' => ['permanent-failure', 'verification_failed', false, 422],
        ];
    }

    public function test_failure_message_does_not_expose_vendor_details(): void
    {
        $this->postJson('/api/member-verification?scenario=permanent-failure')->assertStatus(422)
            ->assertExactJson([
                'status' => 'verification_failed',
                'message' => 'Your verification was permanently rejected. Please contact Harbor Community Credit Union if you need assistance.',
                'canRetry' => false,
                'lastAttemptAt' => '2026-07-31T12:00:00Z',
            ]);
    }

    public function test_a_retry_repeats_the_operation_and_succeeds_deterministically(): void
    {
        $url = '/api/member-verification?scenario=timeout-then-success';

        $this->postJson($url)->assertStatus(503)->assertJsonPath('status', 'retry_required');
        $this->postJson($url)->assertOk()->assertJsonPath('status', 'verified');
        $this->postJson($url)->assertOk()->assertJsonPath('status', 'verified');
    }
}
