<?php

namespace Tests\Feature;

use App\Support\TransferStore;
use Tests\TestCase;

class TransferTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->withSession(['laboratory_session' => ['authenticated' => true]]);
        TransferStore::reset();
    }

    private function instruction(string $key = 'intent-1'): array
    {
        return ['sourceAccount' => 'account-2001', 'destinationAccount' => 'account-2002', 'amountCents' => 25000, 'memo' => 'Vacation fund', 'idempotencyKey' => $key];
    }

    public function test_successful_post_has_a_deterministic_confirmation(): void
    {
        $this->postJson('/api/transfers', $this->instruction())->assertCreated()
            ->assertJsonPath('transferId', 'TRN-1001')
            ->assertJsonPath('confirmationNumber', 'HC-0001001')
            ->assertJsonPath('submittedAt', '2026-07-31T14:30:00Z')
            ->assertJsonPath('status', 'accepted')->assertJsonPath('duplicate', false);
    }

    public function test_duplicate_key_returns_the_original_transfer(): void
    {
        $first = $this->postJson('/api/transfers', $this->instruction())->json();
        $duplicate = $this->postJson('/api/transfers', $this->instruction())->assertCreated()->json();
        $this->assertSame($first['transferId'], $duplicate['transferId']);
        $this->assertSame($first['confirmationNumber'], $duplicate['confirmationNumber']);
        $this->assertTrue($duplicate['duplicate']);
    }

    public function test_new_key_creates_a_new_transfer(): void
    {
        $this->postJson('/api/transfers', $this->instruction('intent-1'));
        $this->postJson('/api/transfers', $this->instruction('intent-2'))
            ->assertJsonPath('transferId', 'TRN-1002')->assertJsonPath('duplicate', false);
    }

    public function test_invalid_instruction_is_rejected(): void
    {
        $this->postJson('/api/transfers', ['sourceAccount' => 'CHK-4821', 'destinationAccount' => 'CHK-4821', 'amountCents' => 0])
            ->assertUnprocessable()->assertJsonValidationErrors(['sourceAccount', 'amountCents', 'memo', 'idempotencyKey']);
    }

    public function test_invalid_amount_returns_a_structured_member_safe_error(): void
    {
        $instruction = $this->instruction();
        $instruction['amountCents'] = 0;

        $this->postJson('/api/transfers', $instruction)->assertUnprocessable()
            ->assertJsonPath('errors.amountCents.0', 'Transfer amount must be greater than zero.');
    }

    public function test_missing_required_fields_return_structured_errors(): void
    {
        $this->postJson('/api/transfers', ['memo' => ''])->assertUnprocessable()
            ->assertJsonPath('errors.sourceAccount.0', 'Choose a source account.')
            ->assertJsonPath('errors.destinationAccount.0', 'Choose a destination account.')
            ->assertJsonPath('errors.amountCents.0', 'Transfer amount is required.')
            ->assertJsonStructure(['errors' => ['sourceAccount', 'destinationAccount', 'amountCents', 'idempotencyKey']]);
    }

    public function test_memo_length_validation_returns_a_structured_error(): void
    {
        $instruction = $this->instruction();
        $instruction['memo'] = str_repeat('x', 101);

        $this->postJson('/api/transfers', $instruction)->assertUnprocessable()
            ->assertJsonPath('errors.memo.0', 'Memo must be 100 characters or fewer.');
    }

    public function test_amount_cannot_exceed_the_source_account_balance(): void
    {
        $instruction = $this->instruction();
        $instruction['amountCents'] = 125001;

        $this->postJson('/api/transfers', $instruction)->assertUnprocessable()
            ->assertJsonPath('errors.amountCents.0', 'Amount cannot exceed the available balance of $1,250.00.');
    }

    public function test_get_returns_the_created_transfer_resource(): void
    {
        $this->postJson('/api/transfers', $this->instruction());
        $this->getJson('/api/transfers/TRN-1001')->assertOk()
            ->assertJsonPath('confirmationNumber', 'HC-0001001')
            ->assertJsonPath('sourceAccount.id', 'account-2001')
            ->assertJsonPath('sourceAccount.displayName', 'Everyday Checking')
            ->assertJsonPath('sourceAccount.accountSuffix', '4821')
            ->assertJsonPath('destinationAccount.id', 'account-2002')
            ->assertJsonPath('destinationAccount.displayName', 'Member Savings')
            ->assertJsonPath('destinationAccount.accountSuffix', '7314')
            ->assertJsonPath('amountCents', 25000)
            ->assertJsonPath('memo', 'Vacation fund')
            ->assertJsonPath('status', 'accepted');
    }

    public function test_deterministic_status_scenarios_are_supported(): void
    {
        foreach (['accepted', 'completed', 'rejected'] as $index => $scenario) {
            $response = $this->postJson("/api/transfers?scenario={$scenario}", $this->instruction("intent-{$index}"));
            $response->assertCreated()->assertJsonPath('status', $scenario);
            $this->getJson('/api/transfers/'.$response->json('transferId'))->assertJsonPath('status', $scenario);
        }
    }

    public function test_unknown_transfer_id_returns_a_safe_error(): void
    {
        $this->getJson('/api/transfers/unknown')->assertNotFound()->assertExactJson([
            'error' => ['code' => 'transfer_not_found', 'message' => 'The requested transfer could not be found.'],
        ]);
    }

    public function test_unknown_scenario_is_rejected_safely(): void
    {
        $this->postJson('/api/transfers?scenario=scheduled', $this->instruction())->assertBadRequest()
            ->assertJsonPath('error.code', 'unsupported_transfer_scenario');
    }

    public function test_unavailable_scenario_returns_a_safe_retryable_response(): void
    {
        $this->postJson('/api/transfers?scenario=unavailable', $this->instruction())->assertServiceUnavailable()
            ->assertExactJson(['error' => [
                'code' => 'transfers_unavailable',
                'message' => 'Transfers are temporarily unavailable.',
                'retryAvailable' => true,
            ]]);
        $this->assertNull(TransferStore::find('TRN-1001'));
    }
}
