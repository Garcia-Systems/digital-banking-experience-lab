# 19: Employee operations experience

## Learning objectives

- Connect member, transfer, verification, and failure views.
- Trace stable identifiers across operational pages.
- Interpret the portal as read-only review.
- Explain role-aware information design.

## Banking concept

**Operational context.** An employee often needs to move from a member to related transfer or verification status. Stable identifiers and timestamps let Harbor correlate deterministic records without implying ledger authority.

## Frontend concept

**Coherent routed experience.** The shared operations layout connects dashboard, member, transfer, verification, and failure list-detail screens. Each component requests through `api/operations.js` and renders fixture-backed contracts.

## Implementation

`apps/operations-web/src/components/Members.jsx`, `MemberDetails.jsx`, `Transfers.jsx`, `TransferDetails.jsx`, `Verifications.jsx`, and `VerificationDetails.jsx` complete the portal.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:operations && npm run build:operations
```

## What to observe

Operational routes render the corresponding collections and known details, role denial remains enforced, and Vite produces the independent portal bundle.

## Engineering tradeoffs

A unified portal reduces context switching, while broad data aggregation increases privacy and authorization risk. Volume I keeps it read-only and deterministic rather than simulating privileged repair actions.

## Automated tests

`apps/operations-web/src/App.test.jsx` covers the complete routed experience; `OperationsTest.php` validates all operations collections and detail endpoints.

## Exercise

Add a navigation test that moves from the Operations Portal dashboard to one existing collection without bypassing the shared layout.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
