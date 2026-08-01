# 17: Internal Operations Portal

## Learning objectives

- Run the independent employee client.
- Protect operations routes by role.
- Navigate operational summaries.
- Separate member and employee experiences.

## Banking concept

**Role-specific operations.** Employees need cross-member queues and status summaries that would be inappropriate in Member Web. Harbor models a distinct Operations Portal and API prefix.

## Frontend concept

**Independent React application.** A separate Vite workspace supplies its own router, layout, fixtures adapter, build, and tests. `OperationsRoutes` rejects a role other than `operations-user` before rendering operational pages.

## Implementation

`apps/operations-web/src/App.jsx`, `components/Layout.jsx`, and `components/Dashboard.jsx` implement the portal. `routes/api.php` and `RequireOperationsRole.php` protect `/api/operations/*`.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:operations
```

## What to observe

The authorized role sees summary navigation and the unauthorized role sees a denial. Member, transfer, failure, and verification routes render independently of Member Web.

## Engineering tradeoffs

A separate application strengthens role and deployment boundaries but duplicates some frontend infrastructure. Shared visual code is intentionally secondary to keeping authorization contexts obvious.

## Automated tests

`apps/operations-web/src/App.test.jsx` covers routing, role denial, lists, and details; `OperationsTest.php` covers operations authorization and resources.

## Exercise

Add an Operations Portal routing assertion for one existing verification detail record.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
