# 15: Retryable operations

## Learning objectives

- Classify transient and permanent outcomes.
- Retry verification without duplicating financial work.
- Show pending feedback during retry.
- Explain when manual retry is safer.

## Banking concept

**Retries.** A timeout does not reveal whether an external operation failed or merely lost its response. Harbor retries the deterministic verification workflow but does not blindly repeat a transfer command without idempotency.

## Frontend concept

**Retry state.** `MemberVerification` represents request progress, enables retry after a transient timeout, and updates the same workflow when `timeout-then-success` advances to success.

## Implementation

`MemberVerification.jsx` and `DeterministicVerificationVendor.php` implement retry. `api/transfers.js` demonstrates the separate idempotency requirement for financial commands.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:member -- --run src/components/MemberVerification.test.jsx
```

## What to observe

The timeout scenario offers retry; `timeout-then-success` first reports the transient problem and then succeeds; permanent failure does not promise a useful retry.

## Engineering tradeoffs

Automatic retry can improve resilience but can amplify load and duplicate side effects. Manual retry makes uncertainty visible; idempotency is still required wherever a repeated command can move money.

## Automated tests

`MemberVerification.test.jsx` validates retry UI; `MemberVerificationTest.php` validates deterministic attempt progression; `TransferTest.php` validates idempotent transfer replay.

## Exercise

Add an assertion that the retry control is unavailable while an existing retry request is pending.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
