# 22: Gradual TypeScript migration

## Learning objectives

- Explain why Volume I began in JavaScript.
- Inspect the selected migrated files.
- Run compile-time checking.
- Preserve runtime validation at network boundaries.

## Banking concept

**Reliable financial presentation.** Misspelled or nullable account fields can produce misleading output. Static types improve editor and build feedback for Harbor's core dashboard values, but cannot prove a balance is authoritative.

## Frontend concept

**Selected TypeScript adoption.** JavaScript came first so early chapters expose React mechanics without a second language layer. Migration targets `banking.ts`, dashboard fetching, formatters, `BalanceSummary.tsx`, and the mobile `AccountCard.tsx`, demonstrating incremental interoperation rather than a wholesale rewrite.

## Implementation

`apps/member-web/src/types/banking.ts`, `api/dashboard.ts`, `utils/formatters.ts`, `components/BalanceSummary.tsx`, both application `tsconfig.json` files, and `apps/mobile/src/components/AccountCard.tsx` form the selected slice.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run typecheck
```

## What to observe

TypeScript checks the selected Member Web and Mobile Laboratory files without emitting output. JavaScript components continue to build and test alongside them.

## Engineering tradeoffs

Gradual migration limits disruption and keeps the learning sequence clear, but leaves mixed enforcement and boundary seams. TypeScript checks compile-time assumptions only; `validateDashboard.js` and mobile `validateDashboard.js` remain necessary because API JSON is runtime data.

## Automated tests

`formatters.test.js`, `AccountDashboard.test.jsx`, and mobile dashboard tests exercise migrated code at runtime; `npm run typecheck` is the static check. No separate invented TypeScript test suite exists.

## Exercise

Add a harmless optional field to a local TypeScript example, then explain why accepting that field still requires runtime validation if it arrives from JSON.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
