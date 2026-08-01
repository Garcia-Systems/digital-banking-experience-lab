# 11: Transfer status and confirmation

## Learning objectives

- Treat acceptance and completion as different states.
- Load transfer status by identifier.
- Render completed, accepted, and rejected outcomes.
- Avoid optimistic claims about settlement.

## Banking concept

**Transfer lifecycle.** A submitted transfer can be accepted, completed, rejected, or unavailable. Harbor's confirmation screen reports the returned state rather than equating an HTTP success with completed movement.

## Frontend concept

**Status-driven rendering.** After submission Member Web navigates to `/transfers/:transferId`. `TransferDetails` fetches the status resource and conditionally renders the deterministic outcome.

## Implementation

`TransferForm.jsx`, `TransferDetails.jsx`, `api/transfers.js`, and Banking API `TransferController.php` implement submission-to-status navigation.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:member -- --run src/components/TransferDetails.test.jsx
```

## What to observe

Completed, accepted, rejected, and unavailable scenarios have distinct messages. The component does not label an accepted transfer completed.

## Engineering tradeoffs

Polling or live updates could improve freshness but add coordination complexity. An explicit status fetch is deterministic and honest for this volume, while making the learner request current state deliberately.

## Automated tests

`TransferDetails.test.jsx` validates status presentation; `TransferTest.php` validates create and lookup scenarios.

## Exercise

Add an assertion that a rejected transfer never displays the completed confirmation language.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
