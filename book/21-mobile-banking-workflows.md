# 21: Mobile banking workflows

## Learning objectives

- Load the authenticated mobile dashboard.
- Navigate account and transaction screens.
- Prepare a transfer without claiming submission.
- Handle dashboard scenarios and expiration.

## Banking concept

**Mobile workflow scope.** Harbor's Mobile Laboratory supports account review, history, and transfer preparation. Preparation validates an intent locally; it intentionally does not claim that a transfer was submitted.

## Frontend concept

**State-driven native navigation.** `MobileApp` uses explicit route state to move among dashboard, account detail, history, and transfer preparation. `AccountDashboardScreen` loads the protected projection and reports a `401` to the session owner.

## Implementation

`MobileApp.js`, `AccountDashboardScreen.js`, `AccountDetailScreen.js`, `TransactionHistoryScreen.js`, and `TransferPreparationScreen.js` implement the workflow. `api/dashboard.js` selects the configured scenario.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
EXPO_PUBLIC_DASHBOARD_SCENARIO=success npm run mobile:start
```

## What to observe

After fictional sign-in, the dashboard loads; selecting an account opens detail and activity; Prepare transfer validates fields and stops at preparation. `empty`, `stale`, `error`, and `partial` expose their defined states.

## Engineering tradeoffs

A small state navigator keeps the laboratory inspectable but lacks deep links and platform navigation history. Mobile reuses contracts and validation concepts while retaining native interaction and authentication differences.

## Automated tests

`MobileWorkflows.test.js` covers detail, history, and transfer preparation; `AccountDashboardScreen.test.js` covers projection states; `dashboardApi.test.js` covers API validation and authorization.

## Exercise

Extend the mobile workflow test with an existing transfer-validation boundary and assert no submission confirmation appears.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
