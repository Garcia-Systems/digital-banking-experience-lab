# Digital Banking Experience Laboratory

The **Digital Banking Experience Laboratory** is the completed Volume I executable textbook for building and reasoning about modern digital banking experiences. It connects a React member application, React employee portal, React Native mobile application, and PHP API through fast deterministic scenarios and automated tests.

Harbor Community Credit Union and every member, account, balance, identifier, timestamp, and outcome are fictional. This educational simulation is **not** a production banking platform, authoritative ledger, statement of regulatory compliance, or real institution. It has no live integrations, production authentication, or background processing. Read the [security boundaries](docs/security-boundaries.md) before contributing.

## Architecture

```text
                  React Member Web
                         │
                         │
 React Native Mobile ────┼────► PHP Banking API
                         │
 Operations Portal ──────┘
                              │
                              ▼
                Deterministic Banking Services
                              │
                              ▼
                 Fictional Harbor Community
                   Credit Union Data Model
```

The three clients present the same deterministic API for different roles and devices. React and React Native render projections; Laravel owns shared response contracts, validation, scenario selection, and fixture-backed services. The final [end-to-end chapter](book/23-end-to-end-digital-banking-experience.md) explains the complete walkthrough and its limits.

## Repository layout

- `apps/member-web` — Vite and React member dashboard, transfers, verification, settings, and tests;
- `apps/operations-web` — independently runnable Vite and React employee portal, including failure review;
- `apps/mobile` — Expo and React Native account, activity, and transfer-preparation workflows;
- `services/banking-api` — Laravel JSON API, deterministic fixtures, and feature tests;
- `book` — Chapters 0–23 of the executable textbook;
- `docs/security-boundaries.md` — synthetic-data and trust-boundary rules;
- `.github/workflows/validate.yml` — frontend, mobile, and PHP validation.

## Technology stack

- React 19, React Router, Vite, Vitest, and Testing Library;
- React Native 0.81 and Expo 54 with Jest and React Native Testing Library;
- JavaScript plus a deliberately gradual TypeScript slice;
- PHP 8.3, Laravel 12, Composer 2, and PHPUnit;
- npm workspaces, ESLint, Prettier, and GitHub Actions.

## Run the complete laboratory

Requirements: Node.js 20.19+, npm 10 or 11, PHP 8.3, Composer 2, and the PHP extensions required by the locked Composer packages. From a fresh clone, reproduce the committed dependency graphs before starting services:

```bash
npm ci
cd services/banking-api
composer install --prefer-dist --no-interaction --no-progress
cd ../..
```

Use `npm install` only when intentionally changing JavaScript dependencies and updating `package-lock.json`; validation uses `npm ci`. Start services in this order.

The committed `.npmrc` preserves the legacy peer-dependency resolution mode used by the current Expo-compatible lockfile. Keep that file in place for both `npm install` and `npm ci`; npm requires clean installs to use the same dependency-resolution settings that produced the lockfile.

### 1. PHP API

```bash
cd services/banking-api
cp .env.example .env
php artisan key:generate
php artisan serve
```

### 2. Member web

In a new terminal at the repository root:

```bash
npm run dev
```

Vite serves the member app (normally `http://localhost:5173`) and proxies `/api` to `http://127.0.0.1:8000`. Sign in with fictional credentials `member-1001` / `password`.

### 3. Operations portal

```bash
npm run dev:operations
```

The employee experience runs independently on `http://localhost:5174` and uses the same API proxy.

### 4. Mobile application

```bash
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000 \
EXPO_PUBLIC_DASHBOARD_SCENARIO=success npm run mobile:start
```

`EXPO_PUBLIC_API_BASE_URL` defaults to loopback, but a physical device or some emulators require your development computer's network-accessible address. It is configuration, not a secret. `EXPO_PUBLIC_DASHBOARD_SCENARIO` is optional and accepts `success`, `empty`, `stale`, `error`, or `partial`; unsupported values safely use `success`. Member and operations web require no environment variables. Laravel sessions require the local `APP_KEY` generated above.

On startup, mobile checks its in-memory laboratory session and otherwise displays a native sign-in screen. Use the explicitly fictional `member-1001` / `password` credentials; successful sign-in establishes the deterministic mobile laboratory session before any dashboard data is requested. A `401` clears account data and asks the learner to sign in again, while **Sign out** ends the session. The token is an intentionally fixed teaching transport held only in memory—not production authentication or credential storage.

The browser and mobile clients share the same `/api/login`, `/api/session`, `/api/logout`, and protected `/api/dashboard` boundary. Member web uses Laravel's `harbor_laboratory_session` cookie through same-origin Vite proxy requests. React Native cannot be assumed to share browser cookie persistence, so mobile identifies its login explicitly and sends the returned laboratory-only bearer value on session, dashboard, and logout requests. Mobile therefore needs a network-reachable API base URL, but it does not use browser credential mode or depend on cross-origin cookies.

## Deterministic learning path

1. Review the `success` member dashboard and fixed projection.
2. Prepare a transfer at `/transfers/new?transferScenario=completed` (also try `accepted`, `rejected`, or `unavailable`).
3. View the same account contract on mobile with the `success` dashboard scenario.
4. Visit `/verification?verificationScenario=success`; then compare `timeout`, `timeout-then-success`, or `permanent-failure`.
5. Use the operations portal to inspect members, transfer and verification status, and fixed failed-operation examples.
6. Run the tests to see each named result reproduced without a live vendor or background worker.

Additional member dashboard scenarios are `empty`, `stale`, `error`, and intentionally malformed `partial`. The session endpoint accepts `expired`. See Chapter 23 for the exact walkthrough and an explanation of why operations data remains a fixed review dataset.

## Validation

Run the canonical frontend and mobile validation from the root:

```bash
npm run verify
```

`verify` runs lint for all three workspaces, repository formatting, the selected migrated TypeScript files, all three test suites, production builds for the member and operations web applications, and Expo configuration validation. It does not create a native mobile binary and does not run PHP tests. Each underlying command remains available independently: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run mobile:validate`.

Run Laravel separately:

```bash
cd services/banking-api
composer test
```

GitHub Actions runs the same checks for pushes and pull requests.

## Chapters

- [00 — Setting Up the Laboratory](book/00-setting-up-the-laboratory.md)
- [01 — Interface as Projection](book/01-interface-as-projection.md)
- [02 — JSX and the First Account Dashboard](book/02-jsx-and-the-first-account-dashboard.md)
- [03 — Components and Account Cards](book/03-components-and-account-cards.md)
- [04 — Props and Account Data](book/04-props-and-account-data.md)
- [05 — State and Member Actions](book/05-state-and-member-actions.md)
- [06 — From React Fixtures to a PHP API](book/06-from-react-fixtures-to-a-php-api.md)
- [07 — Loading, Empty, Success, and Failure States](book/07-loading-empty-success-and-failure-states.md)
- [08 — Routing Through a Banking Application](book/08-routing-through-a-banking-application.md)
- [09 — Transfer Forms and Validation](book/09-transfer-forms-and-validation.md)
- [10 — Idempotent Transfer Submission](book/10-idempotent-transfer-submission.md)
- [11 — Transfer Status and Confirmation](book/11-transfer-status-and-confirmation.md)
- [12 — Authentication and Session Boundaries](book/12-authentication-and-session-boundaries.md)
- [13 — Member Verification and Vendor Integrations](book/13-member-verification-and-vendor-integrations.md)
- [14 — Secure Handling of Member Input](book/14-secure-handling-of-member-input.md)
- [15 — Retryable Operations](book/15-retryable-operations.md)
- [16 — Graceful Error Recovery](book/16-graceful-error-recovery.md)
- [17 — Internal Operations Portal](book/17-internal-operations-portal.md)
- [18 — Failed Operations Review](book/18-failed-operations-review.md)
- [19 — Employee Operations Experience](book/19-employee-operations-experience.md)
- [20 — React Native Foundations](book/20-react-native-foundations.md)
- [21 — Mobile Banking Workflows](book/21-mobile-banking-workflows.md)
- [22 — Gradual TypeScript Migration](book/22-gradual-typescript-migration.md)
- [23 — End-to-End Digital Banking Experience](book/23-end-to-end-digital-banking-experience.md)

## Relationship to the Digital Banking Systems Laboratory

The separate **Digital Banking Systems Laboratory** teaches internal banking behavior, distributed systems, ledger concepts, retries, dead-letter queues, and event processing. This repository teaches the corresponding member and employee interfaces, retry experiences, failed-operation review, and operational dashboards. They remain independent educational projects: together they offer a broader view of banking software, but neither claims production completeness.
