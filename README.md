# Digital Banking Experience Laboratory

The **Digital Banking Experience Laboratory** is an executable textbook for learning how modern banking experiences are designed, built, tested, and explained. Each lesson pairs a small working application with the reasoning behind it.

This independent educational project complements the separate **Digital Banking Systems Laboratory**. That laboratory studies core system concepts; this repository focuses on the experience layer around member interfaces, employee interfaces, APIs, and vendor integrations. The only implemented experience today is the member account dashboard described below.

React begins here in JavaScript so the data flow remains visible to learners. TypeScript and React Native are not configured in the completed chapters.

## Safety and scope

Harbor Community Credit Union is fictional. Every member, account, balance, transaction, identifier, timestamp, and workflow in this repository is synthetic test data. Never add real member data or credentials.

This is not a production banking application, does not claim regulatory compliance, and does not recreate or represent Langley Federal Credit Union's actual or proprietary systems, vendors, architecture, data, or internal procedures. Read the [security boundaries](docs/security-boundaries.md) before contributing.

## Progress: Chapters 0–4 complete

Chapters 0 through 4 are implemented. The current React application composes the member dashboard from focused account components and renders deterministic multiple-account, empty-account, fresh, and stale projections. It demonstrates that a member interface is a read-oriented projection of banking information—not the authoritative ledger—and uses accessible account cards to distinguish balances, masked identifiers, account status, empty recent activity, and projection freshness. Chapter 4 adds explicit one-way prop flow, fictional ownership and nickname metadata, and conditional dividend presentation.

## Get started

Requirements: Node.js 20.19 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL. Use `?scenario=multiple-accounts` for checking and savings, `?scenario=empty-accounts` for a successful projection with no accounts, or `?scenario=stale` for stale data, `?scenario=individual-checking` for the Chapter 4 individual checking experiment, or `?scenario=joint-savings` for its joint interest-bearing savings counterpart. Omitting the query renders the fresh multiple-account projection.

Run the quality checks from the repository root:

```bash
npm run test
npm run lint
npm run format:check
npm run build
```

Use `npm run format` to format supported files. Follow the chapters in order: [Setting up the laboratory](book/00-setting-up-the-laboratory.md), [Interface as projection](book/01-interface-as-projection.md), [JSX and the first account dashboard](book/02-jsx-and-the-first-account-dashboard.md), and [Components and account cards](book/03-components-and-account-cards.md), followed by [Props and account data](book/04-props-and-account-data.md).

## Current repository map

- `apps/member-web`: the Vite-powered React member dashboard and its tests;
- `book`: the executable textbook chapters implemented so far;
- `docs/security-boundaries.md`: rules that keep the laboratory synthetic and educational;
- `.github/workflows/validate.yml`: automated lint, formatting, test, and build checks.
