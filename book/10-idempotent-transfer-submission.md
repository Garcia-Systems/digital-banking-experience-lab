# 10: Idempotent transfer submission

## Learning objectives

- Define idempotency for transfer commands.
- Trace the idempotency key from client to API.
- Prevent duplicate submission in the UI.
- Distinguish replay from a second transfer intent.

## Banking concept

**Duplicate protection.** Networks and members retry. Harbor assigns an idempotency key to one transfer intent so replaying that command returns the same result instead of creating another transfer.

## Frontend concept

**Submission coordination.** `TransferForm` disables submission while a request is pending. `api/transfers.js` sends the idempotency value; `TransferStore` remembers deterministic outcomes for the process.

## Implementation

`apps/member-web/src/api/transfers.js`, `TransferForm.jsx`, `services/banking-api/app/Http/Controllers/TransferController.php`, and `app/Support/TransferStore.php` implement the flow.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:member -- --run src/api/transfers.test.js src/components/TransferForm.test.jsx
```

## What to observe

A duplicate member click is blocked while pending, and replay with the same key resolves to the same transfer identity in the tested API behavior.

## Engineering tradeoffs

UI disabling reduces accidental duplicates but cannot handle network replay alone. Server idempotency supplies the safety boundary; the in-memory teaching store is not durable production storage.

## Automated tests

`transfers.test.js` and `TransferForm.test.jsx` cover client behavior; `TransferTest.php` covers idempotency and transfer responses.

## Exercise

Extend the API feature test to compare all stable response fields from two requests with the same existing idempotency key.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
