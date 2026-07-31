# Chapter 6: From React Fixtures to a PHP Banking API

The dashboard looks unchanged in this chapter, but its data crosses a new and important boundary. React no longer selects an account fixture when the application starts. The browser asks a Laravel API for the dashboard projection.

## Why React should not own banking data

A fixture inside a component is useful while learning JSX and props, but it makes the presentation layer appear authoritative. A real member's accounts must come from services that apply the institution's rules and access controls. React's responsibility is to present the projection it receives and manage short-lived interface state; it is not a ledger and must not decide balances.

This API is still deliberately not a real banking service. It reads one fictional PHP fixture, has no database or authentication, and always returns the same result. Moving the fixture behind an HTTP boundary lets us study that boundary without pretending that the example is production-ready.

## Request, response, and JSON

HTTP is a request-response protocol. The browser sends `GET /api/dashboard`: `GET` says it is reading a resource, and the path identifies the dashboard resource. Laravel replies with an HTTP status (`200 OK` for success), headers describing the response, and a JSON body.

JSON is a text representation of objects, arrays, strings, numbers, booleans, and `null`. The response contains `member`, `projection`, and `accounts`, so it maps naturally to the JavaScript value that the existing components expect. JSON does not make data trustworthy by itself; in a real system, the service behind the endpoint would authorize the request and obtain authoritative data.

## The frontend lifecycle

`App` begins with no dashboard and renders **Loading dashboard...**. A `useEffect` runs after the first render and calls `fetch`. When the successful response is decoded with `response.json()`, `useState` stores the dashboard and React renders the existing component tree. A failed network request or non-success HTTP response instead renders **Unable to load dashboard.** The interface never displays backend exception details.

This small state machine has three outcomes:

1. pending: no response yet;
2. success: render the dashboard projection;
3. failure: render a safe, stable message.

The Vite development server proxies `/api` requests to Laravel at `127.0.0.1:8000`. The browser can therefore use the same relative URL in development that it would use when both applications sit behind one web origin.

## Responsibilities on each side

The Laravel side owns the response contract and the deterministic fictional fixture. It serializes the PHP array as JSON and supplies the HTTP status. Later services could change how that projection is assembled without requiring the account cards to know about a database or vendor.

The React side owns loading, error, and presentation behavior. It formats cents for people, composes account cards, and manages the temporary card-control demonstration. It does not calculate or mutate authoritative account balances.

Tests respect the same split. Backend feature tests make an HTTP request and verify the response shape and fixed data. Frontend tests mock `fetch`, which makes pending, successful, and failed requests fast and repeatable without starting PHP.

## Why deterministic APIs help education

Random balances and clock-based timestamps produce distracting, flaky examples. This endpoint always describes Alex Morgan, the same two accounts, and the fixed `2026-07-31T12:00:00Z` projection. A reader can compare browser output, test output, and JSON exactly. Determinism is a teaching choice here, not an assertion that a real banking API would never change.

## Traditional PHP and React

In traditional server-rendered PHP, the browser requests a page and PHP combines data with a template to return HTML. That approach remains excellent for content-first sites, progressive enhancement, straightforward forms, and applications that benefit from doing most rendering on the server.

In this React application, PHP returns JSON and browser-side JavaScript turns it into the interface. This approach is useful when an interface has rich local interactions or when multiple clients consume a shared API. It also introduces more states and moving parts: the page can load before its data, the API can fail independently, and both sides must agree on a contract.

Neither architecture is universally better. The useful question is which boundary and rendering model fits the product. This laboratory uses JSON now because seeing the request, response, and three frontend states is the lesson.

## Run the chapter

In one terminal, install and start the API:

```bash
cd services/banking-api
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

In another terminal, start React from the repository root:

```bash
npm install
npm run dev
```

Visit the URL printed by Vite. To exercise the endpoint directly, open `http://127.0.0.1:8000/api/dashboard`. Run `php artisan test` inside `services/banking-api` for the backend test and the root npm quality commands for the frontend.
