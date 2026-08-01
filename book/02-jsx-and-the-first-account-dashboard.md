# 02: JSX and the first account dashboard

## Learning objectives

- Read JSX as a description of Harbor's dashboard.
- Embed formatted banking values safely.
- Render account collections with stable keys.
- Compose a page from banking-specific components.

## Banking concept

**Dashboard comprehension.** A member needs balances, account identity, freshness, and recent activity together. The hierarchy helps them understand the projection before taking an action.

## Frontend concept

**JSX composition.** JSX keeps markup and the JavaScript decisions that select it together. Mapping accounts creates repeated `AccountCard` elements; component boundaries preserve banking meaning rather than making generic UI fragments.

## Implementation

`AccountDashboard.jsx`, `AccountList.jsx`, `AccountCard.jsx`, `AccountHeader.jsx`, and `RecentActivitySummary.jsx` form the first dashboard. `utils/formatters.ts` formats values.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:member -- --run src/components/AccountDashboard.test.jsx
```

## What to observe

The rendered heading identifies Harbor Community Credit Union, account cards use stable account IDs, formatted money is visible, and projection status remains part of the page.

## Engineering tradeoffs

JSX makes conditional experiences easy to inspect, but it does not validate API data or confer financial correctness. Those responsibilities stay in validation and the Banking API.

## Automated tests

`AccountDashboard.test.jsx` validates the composed dashboard; `formatters.test.js` validates displayed currency and dates.

## Exercise

Extend the dashboard test with one member-visible recent-activity assertion using an existing fixture.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
