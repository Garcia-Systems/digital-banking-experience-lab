# 16: Graceful error recovery

## Learning objectives

- Recover from request and render failures.
- Preserve honest banking language.
- Clear protected data on authorization failure.
- Distinguish retryable degradation from invalid data.

## Banking concept

**Graceful degradation.** Harbor can offer a dashboard retry or stale projection without inventing balances. On malformed data or expired authorization, withholding account content is safer than optimistic display.

## Frontend concept

**Error boundaries and recovery UI.** Request failures are modeled in `App`; `ErrorBoundary` catches unexpected render errors. Retry reissues a safe read, while a `401` clears session-bound state.

## Implementation

`apps/member-web/src/App.jsx`, `components/ErrorBoundary.jsx`, `ProjectionStatus.jsx`, and `data/validateDashboard.js` provide recovery layers.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:member -- --run src/components/ErrorBoundary.test.jsx src/App.test.jsx
```

## What to observe

Unexpected render failures show fallback UI, dashboard failures offer retry, stale data stays labeled, and expired sessions remove account content.

## Engineering tradeoffs

Fallbacks keep navigation usable, but catching errors too broadly can hide defects. Financial values should only survive degradation when validated and accompanied by freshness information.

## Automated tests

`ErrorBoundary.test.jsx` checks render recovery; `App.test.jsx` checks request retry and expiration; `AccountDashboard.test.jsx` checks stale disclosure.

## Exercise

Add a recovery test that confirms malformed dashboard content never remains visible after validation fails.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
