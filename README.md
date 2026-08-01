# Digital Banking Experience Laboratory

The **Digital Banking Experience Laboratory** is an executable textbook for learning how modern banking experiences are designed, built, tested, and explained. Each lesson pairs a small working application with the reasoning behind it.

This independent educational project complements the separate **Digital Banking Systems Laboratory**. This repository focuses on the experience layer around member interfaces and APIs. React remains JavaScript so its data flow is visible. Chapter 21 expands the React Native application into everyday account, transaction-history, and transfer-preparation workflows without adding TypeScript or production-only mobile features.

## Safety and scope

Harbor Community Credit Union is fictional. Every member, account, balance, identifier, timestamp, and workflow is synthetic test data. Never add real member data or credentials.

This is not a production banking application, does not claim regulatory compliance, and does not represent any institution's actual systems. Read the [security boundaries](docs/security-boundaries.md) before contributing. The API has no database, production authentication, or authoritative ledger. Chapter 12's session is a deterministic teaching model only.

## Progress: Chapters 0–21 complete

Chapter 21 adds account navigation, deterministic transaction history, and a locally validated transfer review that intentionally stops before submission.

## Architecture

```text
React Member Web ────┐
React Native Mobile ─┼─┐
Operations Portal ───┘ │
                       ▼
                PHP Banking API
                       │
                       ▼
        Deterministic Banking Services
```

All three applications consume the same educational PHP API and use fictional data. The fixtures are not a database or core banking system: React and React Native present projections, while Laravel owns the shared response contract.

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

Start the member React application in a second terminal from the repository root:

```bash
npm install
npm run dev
```

Or run the independent operations application on port 5174:

```bash
npm run dev:operations
```

To run the mobile dashboard, configure the shared PHP API URL and start Expo:

```bash
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000 npm run mobile:start
```

The loopback default works when Expo can reach the API on the same development machine. Android emulators, Expo Go, and physical devices can interpret `localhost` as the device itself; use a network-accessible host address for your development computer in `EXPO_PUBLIC_API_BASE_URL`. This value is configuration, not a secret. Select a deterministic laboratory response with `EXPO_PUBLIC_DASHBOARD_SCENARIO=success`, `empty`, `stale`, `error`, or `partial` before starting Expo. Unsupported values safely become `success`.

Vite prints the member application URL and proxies `/api` to Laravel on `http://127.0.0.1:8000`.

Sign in using the fictional laboratory member ID `member-1001` and password `password`. These deterministic credentials are intentionally insecure and are never appropriate outside this educational application. After login, choose a dashboard experiment with `?scenario=success`, `empty`, `stale`, `error`, or `partial`. The session API also accepts `?scenario=expired` as a deterministic timeout demonstration.

Choose a transfer outcome by opening the form with `?transferScenario=accepted`, `completed`, or `rejected` (for example, `http://localhost:5173/transfers/new?transferScenario=completed`). The submitted resource retains that deterministic status. The API equivalent is `POST /api/transfers?scenario=completed`; omitting the parameter uses `accepted`.

Visit `/verification` to inspect or start member verification. Select a fixed simulator result with `?verificationScenario=success`, `timeout`, `unavailable`, `temporary-upstream-failure`, `timeout-then-success`, `invalid-member-information`, `unsupported-request`, or `permanent-failure`. The browser calls only the internal PHP API; the simulator makes no network requests.

Experiment with graceful degradation using `/?scenario=error` for an unavailable dashboard, `/transfers/new?transferScenario=unavailable` for unavailable transfer submission, and `/verification?verificationScenario=unavailable` for an unavailable verification status service. Visit `/settings?scenario=error` to confirm that an unrelated route remains available. Each response and retry is deterministic; the application never substitutes unmarked stale or invented banking information.

Run the frontend quality checks from the repository root:

```bash
npm run lint
npm run format:check
npm run test
npm run build
npm run mobile:validate
```

Run only the mobile component tests with `npm run test --workspace @dbel/mobile`. Expo configuration validation is non-interactive and requires no emulator or signing credentials.

Run the Laravel suite separately:

```bash
cd services/banking-api
composer test
```

Follow the chapters in order in [`book`](book), ending with [Mobile Banking Workflows](book/21-mobile-banking-workflows.md).

## Repository layout

- `apps/member-web`: Vite-powered React member dashboard and frontend tests;
- `apps/operations-web`: independently runnable React employee portal and frontend tests;
- `apps/mobile`: Expo React Native banking workflows and native component tests;
- `services/banking-api`: Laravel JSON API, deterministic fixture, and feature test;
- `book`: executable textbook chapters;
- `docs/security-boundaries.md`: rules that keep the laboratory synthetic and educational;
- `.github/workflows/validate.yml`: automated frontend and backend validation.
