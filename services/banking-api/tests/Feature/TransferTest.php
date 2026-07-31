<?php

namespace Tests\Feature;

use App\Support\TransferStore;
use Tests\TestCase;

class TransferTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        TransferStore::reset();
    }

    private function instruction(string $key = 'intent-1'): array
    {
        return ['sourceAccount' => 'CHK-4821', 'destinationAccount' => 'SAV-7314', 'amountCents' => 2550, 'memo' => 'Vacation fund', 'idempotencyKey' => $key];
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
}
