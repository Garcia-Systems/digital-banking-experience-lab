# Digital Banking Experience Laboratory

The **Digital Banking Experience Laboratory** is an executable textbook for learning how modern banking experiences are designed, built, tested, and explained. Each lesson pairs a small working application with the reasoning behind it.

This independent educational project complements the separate **Digital Banking Systems Laboratory**. This repository focuses on the experience layer around member interfaces and APIs. React remains JavaScript so its data flow is visible; TypeScript and React Native are not configured.

## Safety and scope

Harbor Community Credit Union is fictional. Every member, account, balance, identifier, timestamp, and workflow is synthetic test data. Never add real member data or credentials.

This is not a production banking application, does not claim regulatory compliance, and does not represent any institution's actual systems. Read the [security boundaries](docs/security-boundaries.md) before contributing. The API has no database, production authentication, or authoritative ledger. Chapter 12's session is a deterministic teaching model only.

## Progress: Chapters 0–15 complete

Chapter 15 distinguishes successful, retryable, and permanent verification outcomes. It demonstrates deterministic API failures, a manual retry that repeats only the failed operation, accessible progress, and duplicate-request prevention.

## Architecture

```text
Browser
  React Member Application
        │
  Authenticated Session
        │
  PHP Banking API
  │
  ├── Dashboard
  ├── Account Details
  ├── Transfer Submission and Status
  ├── Settings
  └── Member Verification
       │
       v
  Deterministic Vendor Simulator
       │
  React request state (idle / loading / success / error)
       |
       | POST /api/login, GET /api/session, and authenticated banking requests
       v
  PHP dashboard endpoint (HTTP/JSON contract)
       |
       v
  deterministic scenario fixture (fictional projection)
```

The fixture is educational data, not a database or core banking system. React presents the projection; Laravel owns the API response.

## Get started

Requirements: Node.js 20.19+, npm, PHP 8.3+, and Composer.

Start the Laravel API in the first terminal:

```bash
cd services/banking-api
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

Start React in a second terminal from the repository root:

```bash
npm install
npm run dev
```

Vite prints the member application URL and proxies `/api` to Laravel on `http://127.0.0.1:8000`.

Sign in using the fictional laboratory member ID `member-1001` and password `password`. These deterministic credentials are intentionally insecure and are never appropriate outside this educational application. After login, choose a dashboard experiment with `?scenario=success`, `empty`, `stale`, `error`, or `partial`. The session API also accepts `?scenario=expired` as a deterministic timeout demonstration.

Choose a transfer outcome by opening the form with `?transferScenario=accepted`, `completed`, or `rejected` (for example, `http://localhost:5173/transfers/new?transferScenario=completed`). The submitted resource retains that deterministic status. The API equivalent is `POST /api/transfers?scenario=completed`; omitting the parameter uses `accepted`.

Visit `/verification` to inspect or start member verification. Select a fixed simulator result with `?verificationScenario=success`, `timeout`, `unavailable`, `temporary-upstream-failure`, `timeout-then-success`, `invalid-member-information`, `unsupported-request`, or `permanent-failure`. The browser calls only the internal PHP API; the simulator makes no network requests.

Run the frontend quality checks from the repository root:

```bash
npm run lint
npm run format:check
npm run test
npm run build
```

Run the Laravel suite separately:

```bash
cd services/banking-api
composer test
```

Follow the chapters in order in [`book`](book), ending with [Retryable Operations](book/15-retryable-operations.md).

## Repository layout

- `apps/member-web`: Vite-powered React member dashboard and frontend tests;
- `services/banking-api`: Laravel JSON API, deterministic fixture, and feature test;
- `book`: executable textbook chapters;
- `docs/security-boundaries.md`: rules that keep the laboratory synthetic and educational;
- `.github/workflows/validate.yml`: automated frontend and backend validation.
