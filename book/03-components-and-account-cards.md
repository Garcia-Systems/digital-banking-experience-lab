# 03: Components and account cards

## Learning objectives

- Model an account card as a banking concept.
- Separate collection and item responsibilities.
- Distinguish empty, loading, failure, and zero balance.
- Test behavior through accessible output.

## Banking concept

**Account identity.** Checking and savings accounts may share layout while retaining distinct names, masked identifiers, and balances. A zero balance is valid data; no accounts is a different state.

## Frontend concept

**Component boundaries.** `AccountList` owns collection behavior and `AccountCard` owns one account's presentation. Props keep the components deterministic and allow the same contract to be tested independently.

## Implementation

`apps/member-web/src/components/AccountList.jsx`, `AccountCard.jsx`, and `AccountMetadata.jsx` implement the cards; `AccountDashboard.jsx` supplies the collection.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:member -- --run src/components/AccountDashboard.test.jsx
```

## What to observe

A success projection renders each account once. An empty projection renders an explicit empty message rather than a fabricated card or loading indicator.

## Engineering tradeoffs

Small banking-specific components improve review and testing, although excessive fragmentation can obscure the member journey. Boundaries should follow concepts, not every HTML element.

## Automated tests

`AccountDashboard.test.jsx` checks populated and empty account presentation; `PropsFlow.test.jsx` checks data flow through the component tree.

## Exercise

Add a card-level assertion for the existing zero-balance fixture and confirm it is not described as an empty dashboard.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
