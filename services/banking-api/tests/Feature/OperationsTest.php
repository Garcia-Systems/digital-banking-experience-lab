<?php

namespace Tests\Feature;

use Tests\TestCase;

class OperationsTest extends TestCase
{
    private array $headers = ['X-Laboratory-Role' => 'operations-user'];

    public function test_dashboard_is_deterministic(): void
    {
        $first = $this->getJson('/api/operations/dashboard', $this->headers);
        $second = $this->getJson('/api/operations/dashboard', $this->headers);
        $first->assertOk()->assertJsonCount(4, 'metrics')->assertJsonPath('generatedAt', '2026-08-01T09:00:00Z');
        $this->assertSame($first->getContent(), $second->getContent());
    }

    public function test_members_are_listed(): void
    {
        $this->getJson('/api/operations/members', $this->headers)->assertOk()->assertJsonCount(3, 'members')->assertJsonPath('members.0.memberId', 'member-1001');
    }

    public function test_transfers_are_listed(): void
    {
        $this->getJson('/api/operations/transfers', $this->headers)->assertOk()->assertJsonCount(3, 'transfers')->assertJsonPath('transfers.0.transferId', 'transfer-7001');
    }

    public function test_operations_role_is_required(): void
    {
        $this->getJson('/api/operations/dashboard')->assertForbidden()->assertJsonPath('error.code', 'operations_unauthorized');
    }

    public function test_failed_operations_are_listed_deterministically(): void
    {
        $first = $this->getJson('/api/operations/failures', $this->headers);
        $second = $this->getJson('/api/operations/failures', $this->headers);
        $first->assertOk()->assertJsonCount(3, 'failures')->assertJsonPath('failures.0.operationId', 'failure-9001');
        $this->assertSame($first->getContent(), $second->getContent());
    }

    public function test_failed_operation_detail_is_returned(): void
    {
        $this->getJson('/api/operations/failures/failure-9002', $this->headers)
            ->assertOk()->assertJsonPath('failure.retryable', false)
            ->assertJsonPath('failure.failureCategory', 'Permanent Validation Failure')
            ->assertJsonCount(2, 'failure.auditTimeline');
    }

    public function test_unknown_failed_operation_returns_not_found(): void
    {
        $this->getJson('/api/operations/failures/failure-unknown', $this->headers)
            ->assertNotFound()->assertJsonPath('error.code', 'failure_not_found');
    }
}
