# Chapter 7: Loading, Empty, Success, and Failure States

## Banking problem

An absent account card is ambiguous. The browser may have **no account data yet**, the member may have **no accounts**, or the service may be unavailable. A real account with a **zero balance** is different again: it is valid financial information and must not be invented as a placeholder. **Stale accounts** are usable historical projections with a freshness warning, while **structurally invalid data** is incomplete and unsafe to present. Conflating any of these cases can cause a member to believe money is missing, current, or zero when the application simply does not know.

Account screens are projections, not the ledger itself. This laboratory therefore communicates whether the projection is loading, fresh, empty, stale, or unavailable. Partial information is never silently promoted to a complete dashboard.

## React concept

An asynchronous request moves through states over time. `App` stores one object with `status`, `dashboard`, and `error`, rather than independent `isLoading` and `hasError` switches. A single status prevents impossible combinations such as loading, failed, and populated at once. The effect moves idle to loading, then to either success or error; conditional rendering selects a loading status, safe error, or `AccountDashboard`.

Before success, `validateDashboard` checks the minimum member, projection, accounts, and account-field types. It returns an explicit validation result, so malformed JSON cannot reach components and become misleading defaults or property-access crashes. The UI deliberately hides the internal reason. A real **Try again** button increments the attempt and repeats the same scenario request; there is no retry loop.

Component state also preserves the existing card-lock simulation during ordinary dashboard use. Replacing dashboard data remounts the successful view only when a new request succeeds; Chapter 7 does not create global state or a generalized request framework.

## API concept

HTTP status and application-data validity answer different questions. A `200` says the HTTP request succeeded, but an omitted `accounts` property still violates this dashboard contract. Conversely, the controlled `error` scenario returns `503` with a small, member-safe code and message—never a trace, file path, SQL detail, exception class, configuration value, or internal service name.

`DashboardController` accepts a documented `scenario` query value. `success`, `empty`, `stale`, `error`, and `partial` are deterministic. `partial` intentionally returns `200` without accounts to teach contract validation; the normal response remains complete. Unknown names receive a predictable `400` safe response.

## Comparison with traditional PHP

A server-rendered PHP application commonly resolves loading, empty, stale, and failure conditions before returning its HTML. React often must model them in the browser after requesting JSON, because the initial document arrives before that JSON. This is an architectural comparison, not a capability limit: traditional PHP can also support dynamic and asynchronous interactions.

## Comparison with AngularJS

An AngularJS dashboard might have represented this lifecycle with controller or `$scope` variables such as `loading`, `error`, and `dashboard`, then selected markup with directives. The same risk of contradictory booleans applies. Here React renders directly from the current request-state object, and the implemented `AccountDashboard` receives data only after validation succeeds.

## Implementation walkthrough

1. `DashboardController` selects deterministic fixture transformations and controlled status codes.
2. `dashboardScenario` reads the browser query string and allow-lists laboratory scenarios before constructing the API URL.
3. `App` owns request orchestration and an explicit lifecycle object.
4. `validateDashboard` rejects incomplete `200` payloads before presentation.
5. `DashboardLoading` uses a status region. `DashboardError` uses an alert and retry button.
6. `AccountDashboard` retains greeting, projection context, account cards, balances, metadata, masked suffixes, and local card controls. `AccountList` gives an empty successful projection specific wording.
7. Frontend tests control mocked promises and user interaction; PHP feature tests assert scenario contracts, safe failures, unsupported names, and repeatability.

## Engineering tradeoffs

- **One status versus booleans:** one discriminating status is smaller and makes invalid combinations harder to create.
- **Show stale data versus block:** useful accounts remain visible with their timestamp and warning. Whether financial actions remain available is a separate product and risk decision.
- **Strict validation versus tolerant rendering:** rejecting the whole projection avoids presenting partial financial information as complete, at the cost of hiding otherwise valid fragments.
- **Manual versus automatic retry:** manual retry is predictable and avoids loops or surprise traffic; backoff policy is outside this chapter.
- **Internal detail versus safe wording:** developers can distinguish transport and contract failures internally, while members receive one understandable message that leaks no diagnostics.

## Runnable experiments

Start both applications as described in the README. Before opening each URL, predict whether accounts remain visible, which status is announced, and whether retry can change a deterministic result:

- Predict fresh accounts, then open `http://localhost:5173/?scenario=success`.
- Predict a valid member snapshot without cards, then open `http://localhost:5173/?scenario=empty`.
- Predict visible accounts plus a last-updated warning, then open `http://localhost:5173/?scenario=stale`.
- Predict a safe error and retry button, then open `http://localhost:5173/?scenario=error`.
- Predict what the UI does with an incomplete HTTP-200 payload, then open `http://localhost:5173/?scenario=partial`.

The equivalent direct requests are:

```bash
curl -i "http://127.0.0.1:8000/api/dashboard?scenario=success"
curl -i "http://127.0.0.1:8000/api/dashboard?scenario=empty"
curl -i "http://127.0.0.1:8000/api/dashboard?scenario=stale"
curl -i "http://127.0.0.1:8000/api/dashboard?scenario=error"
curl -i "http://127.0.0.1:8000/api/dashboard?scenario=partial"
```

## Exercise

Add a deterministic `maintenance` scenario that returns HTTP 503 with a safe maintenance message. Decide whether it should reuse the standard error component or receive specialized member wording, and explain the member benefit of your choice. Do not add automatic retry.
