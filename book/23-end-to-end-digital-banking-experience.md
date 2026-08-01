# Chapter 23: End-to-End Digital Banking Experience

## Volume Review

Volume I began with one React account projection. Successive chapters separated reusable components, moved fictional data behind a PHP API, made loading and failure states explicit, added routing and safe transfer preparation, demonstrated idempotency and deterministic status, drew a session boundary, simulated a verification vendor, and explained retry and recovery experiences. The final chapters introduced an employee operations portal, failed-operation review, React Native workflows, and gradual TypeScript adoption.

The result is an executable textbook rather than a collection of disconnected samples. Member web, employee web, and mobile clients express different jobs while the PHP API supplies deterministic Harbor Community Credit Union contracts. Tests make those contracts repeatable and inspectable.

## Banking Concept

A member and an operations employee can look at the same account information for different reasons. Alex Morgan needs recognizable account names, masked suffixes, balances, recent activity, and a safe transfer flow. An employee needs identifiers, status, failure classification, and audit context to answer operational questions. Mobile prioritizes a compact review and preparation workflow. Different views should not create different banking facts: clients project the shared API according to a user's task and permissions.

This laboratory is an educational simulation, not a production banking platform. It has no authoritative ledger, real vendor, durable processing, payment rail, or production authentication. All people, money, identifiers, times, and outcomes are fictional fixtures.

## Software Architecture

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

- **Multiple frontend clients** translate a common banking contract into member, mobile, and employee experiences.
- **Shared backend APIs** keep response validation, scenario selection, session boundaries, and transfer rules outside presentation components.
- **Deterministic services** replace randomness, clocks, live vendors, and background jobs with named scenarios and fixed outcomes.
- **Reusable business logic** includes API validation, formatters, transfer validation, idempotent submission, and fixture-backed operations resources. Reuse happens at appropriate boundaries; web markup is not forced into React Native.

### Primary walkthrough

Use the `success` dashboard, `completed` transfer, and `success` verification scenarios for the happy path:

1. Sign in to member web as fictional member `member-1001` with password `password`; inspect Alex Morgan's dashboard and fixed projection timestamp.
2. Open `/transfers/new?transferScenario=completed`, prepare a $125.00 transfer from Everyday Checking to Member Savings, and submit it once. The API returns a fixed confirmation and status.
3. Start mobile with `EXPO_PUBLIC_DASHBOARD_SCENARIO=success`; inspect account `•••• 4821`. It comes from the same `/api/dashboard` contract as member web.
4. Open `/verification?verificationScenario=success` and start verification. The internal deterministic vendor approves it without a network call.
5. Open operations web and review members, transfers, and verifications. Member `member-1001` has the same name, account suffixes, and current balances as the member projection.
6. Open **Failed operations** to inspect the fixed rejected-transfer and verification examples. To compare a member-visible failure, repeat verification with `timeout` or a transfer with `rejected`; operations remains a deliberately fixed review dataset because this lab has no background processing.
7. Inspect browser network requests or the API routes to see all clients use the PHP service. Repeating a named scenario returns the same data.

The walkthrough connects deterministic examples; it does not pretend that one request mutates a durable operations system.

## Runnable Laboratory

### Requirements and environment

Install Node.js 20.19+, npm, PHP 8.3+, and Composer. Run the API before clients. Member web and operations web use Vite's `/api` proxy and need no frontend environment variable. Mobile must be told how its device can reach PHP:

| Variable                         | Required                 | Purpose                                                                          |
| -------------------------------- | ------------------------ | -------------------------------------------------------------------------------- |
| `APP_KEY`                        | Yes for Laravel sessions | Generated locally by `php artisan key:generate` after copying `.env.example`     |
| `EXPO_PUBLIC_API_BASE_URL`       | Recommended for mobile   | Network-reachable API origin; default is `http://127.0.0.1:8000`                 |
| `EXPO_PUBLIC_DASHBOARD_SCENARIO` | No                       | `success`, `empty`, `stale`, `error`, or `partial`; defaults safely to `success` |

These values contain no real credentials. Use your computer's LAN address instead of loopback for a physical device or an emulator whose `localhost` is the device itself.

### Startup order

**Terminal 1 — PHP API**

```bash
cd services/banking-api
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

**Terminal 2 — member web (`http://localhost:5173`)**

```bash
npm install
npm run dev
```

**Terminal 3 — operations portal (`http://localhost:5174`)**

```bash
npm run dev:operations
```

**Terminal 4 — React Native/Expo**

```bash
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000 \
EXPO_PUBLIC_DASHBOARD_SCENARIO=success npm run mobile:start
```

### Automated validation

From the repository root:

```bash
npm run lint
npm run format:check
npm run test
npm run build
npm run mobile:validate
```

Then run the API tests:

```bash
cd services/banking-api
composer test
```

The API's `EndToEndLaboratoryTest` walks through login, the dashboard contract consumed by web and mobile, transfer submission, vendor verification, consistent operations member data, and failure review. It is fast HTTP-level integration coverage, not brittle browser automation.

## Relationship to the Digital Banking Systems Laboratory

The repositories are independent educational projects that can be studied separately. Together they broaden the view from internal correctness mechanisms to the experiences built around them.

| Digital Banking Systems Laboratory | Digital Banking Experience Laboratory |
| ---------------------------------- | ------------------------------------- |
| Internal banking behavior          | Member and employee experiences       |
| Distributed systems                | Frontend applications                 |
| Ledger concepts                    | User interfaces                       |
| Retry mechanics                    | Retry user experience                 |
| Dead-letter queues                 | Failed operations review              |
| Event processing                   | Operational dashboards                |

A polished screen does not prove ledger correctness, and a reliable internal system does not automatically create a clear member experience. The two laboratories illuminate those complementary responsibilities without sharing runtime infrastructure or claiming production completeness.

## Engineering Tradeoffs

- **Multiple clients versus one:** three clients demonstrate role and platform differences, but multiply accessibility, testing, dependency, and contract-maintenance work.
- **Shared APIs:** one boundary reduces duplicated banking facts and supports consistent tests, while requiring careful versioning and client-safe contracts.
- **Deterministic simulations:** fixed timestamps and named outcomes make learning, screenshots, and tests repeatable. They intentionally omit the uncertainty and operational cost of live integrations.
- **Educational scope:** in-memory state and fixture-backed resources keep each concept visible. They are unsuitable substitutes for databases, ledgers, identity systems, or audited controls.
- **Avoiding unnecessary complexity:** there are no queues, deployment platform, cross-client component framework, or browser E2E suite. The chapter integrates existing concepts instead of hiding them behind new infrastructure.

## What's Next

A future volume could explore notifications, offline-aware mobile behavior, advanced accessibility audits, internationalization, richer mobile transfers, expanded employee tools, contract tests, visual regression checks, and carefully scoped browser tests. These are future directions—not unfinished requirements for Volume I. Volume I is complete as a deterministic, full-stack learning system.
