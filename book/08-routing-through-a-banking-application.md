# 08: Routing through a banking application

## Learning objectives

- Map URLs to Harbor workflows.
- Use route parameters for account and transfer identity.
- Keep authentication outside protected routes.
- Provide a safe not-found experience.

## Banking concept

**Workflow navigation.** Dashboard, account detail, transfer preparation, transfer status, verification, and settings are distinct member tasks. Stable routes make those tasks bookmarkable without treating the URL as authorization.

## Frontend concept

**React Router layouts.** Nested routes share `MemberLayout`; parameters select account or transfer views. `App` redirects anonymous requests to `/login` and the wildcard route renders `NotFound`.

## Implementation

`apps/member-web/src/App.jsx` defines `/`, `/accounts/:accountId`, `/transfers/new`, `/transfers/:transferId`, `/verification`, and `/settings`. `MemberLayout.jsx` provides shared navigation.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:member -- --run src/Routing.test.jsx
```

## What to observe

Known routes render their workflow, unknown account IDs and paths show safe not-found output, and unauthenticated navigation reaches the login boundary.

## Engineering tradeoffs

Client routing improves continuity but never authorizes access; the Banking API independently enforces the session. Loading the dashboard once aids coherence but couples these routes to that projection.

## Automated tests

`Routing.test.jsx` validates member routes and parameter handling; `App.test.jsx` validates the authentication redirect.

## Exercise

Add a routing test for an unknown transfer identifier using the existing safe error behavior.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
