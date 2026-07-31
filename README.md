# Digital Banking Experience Laboratory

The **Digital Banking Experience Laboratory** is an executable textbook for learning how modern banking experiences are designed, built, tested, and explained. Each lesson pairs a small working application with the reasoning behind it.

This independent educational project complements the separate **Digital Banking Systems Laboratory**. This repository focuses on the experience layer around member interfaces and APIs. React remains JavaScript so its data flow is visible; TypeScript and React Native are not configured.

## Safety and scope

Harbor Community Credit Union is fictional. Every member, account, balance, identifier, timestamp, and workflow is synthetic test data. Never add real member data or credentials.

This is not a production banking application, does not claim regulatory compliance, and does not represent any institution's actual systems. Read the [security boundaries](docs/security-boundaries.md) before contributing. The API has no database, authentication, or authoritative ledger.

## Progress: Chapters 0–6 complete

Chapter 6 introduces the laboratory's first application boundary. The React member dashboard requests a deterministic account projection from a minimal Laravel API, showing loading and safe error states while preserving the successful dashboard experience from earlier chapters.

## Architecture

```text
Browser
  React member dashboard (presentation and local UI state)
       |
       | GET /api/dashboard
       v
  Laravel banking API (HTTP/JSON contract)
       |
       v
  deterministic PHP fixture (fictional projection)
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

Follow the chapters in order in [`book`](book), ending with [From React fixtures to a PHP API](book/06-from-react-fixtures-to-a-php-api.md).

## Repository layout

- `apps/member-web`: Vite-powered React member dashboard and frontend tests;
- `services/banking-api`: Laravel JSON API, deterministic fixture, and feature test;
- `book`: executable textbook chapters;
- `docs/security-boundaries.md`: rules that keep the laboratory synthetic and educational;
- `.github/workflows/validate.yml`: automated frontend and backend validation.
