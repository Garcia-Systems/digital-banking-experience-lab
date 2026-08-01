<?php

namespace Tests\Feature;

use App\Support\TransferStore;
use Tests\TestCase;

class EndToEndLaboratoryTest extends TestCase
{
    public function test_member_and_operations_experiences_share_the_deterministic_api(): void
    {
        TransferStore::reset();

        $this->postJson('/api/login', ['memberId' => 'member-1001', 'password' => 'password'])
            ->assertOk()->assertJsonPath('displayName', 'Alex Morgan');

        $dashboard = $this->getJson('/api/dashboard?scenario=success')->assertOk()
            ->assertJsonPath('member.id', 'member-1001')
            ->assertJsonPath('accounts.0.id', 'account-2001')
            ->json();

        $this->postJson('/api/transfers?scenario=completed', [
            'sourceAccount' => 'account-2001',
            'destinationAccount' => 'account-2002',
            'amountCents' => 12500,
            'memo' => 'Volume I walkthrough',
            'idempotencyKey' => 'chapter-23-walkthrough',
        ])->assertCreated()->assertJsonPath('status', 'completed');

        $this->postJson('/api/member-verification?scenario=success')->assertOk()
            ->assertJsonPath('status', 'verified');

        $operationsHeaders = ['X-Laboratory-Role' => 'operations-user'];
        $this->getJson('/api/operations/members/member-1001', $operationsHeaders)->assertOk()
            ->assertJsonPath('member.displayName', $dashboard['member']['displayName'])
            ->assertJsonPath('member.accounts.0.maskedNumber', '•••• '.$dashboard['accounts'][0]['accountSuffix'])
            ->assertJsonPath('member.accounts.0.balanceCents', $dashboard['accounts'][0]['currentBalanceCents']);

        $this->getJson('/api/operations/failures', $operationsHeaders)->assertOk()
            ->assertJsonPath('failures.1.status', 'failed')
            ->assertJsonPath('failures.1.failureCategory', 'Permanent Validation Failure');
    }
}
