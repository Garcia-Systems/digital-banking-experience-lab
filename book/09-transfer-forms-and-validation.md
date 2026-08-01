# 09: Transfer forms and validation

## Learning objectives

- Control transfer form inputs with React state.
- Validate accounts, amount, and memo before submission.
- Keep the Banking API authoritative.
- Present actionable validation feedback.

## Banking concept

**Transfer intent.** A transfer form records a member's intent; it does not prove money moved. Harbor prevents same-account transfers and invalid amounts before submission while the server repeats authoritative checks.

## Frontend concept

**Controlled forms.** `TransferForm` stores field values and errors in state. Shared format and selection rules produce immediate member feedback, then the API adapter serializes a valid intent.

## Implementation

`apps/member-web/src/components/TransferForm.jsx`, `api/transfers.js`, and Banking API `TransferController.php` implement the browser and server boundaries.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:member -- --run src/components/TransferForm.test.jsx
```

## What to observe

Invalid or identical accounts and invalid amounts prevent submission and expose messages. A valid form reaches the deterministic transfer endpoint.

## Engineering tradeoffs

Client validation improves speed and accessibility but can be bypassed. Duplicating essential rules at the server costs maintenance and is necessary because the client is untrusted.

## Automated tests

`TransferForm.test.jsx` covers member validation and submission; `services/banking-api/tests/Feature/TransferTest.php` covers server validation.

## Exercise

Add a boundary-value test for an amount rule already enforced by `TransferForm`, without changing the transfer contract.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
