# 01: Interface as projection

## What the dashboard knows

The dashboard is a **projection**, not the authoritative ledger. A ledger records financial events under strict accounting rules. This lesson's interface receives a read-shaped snapshot: a member display name, two accounts, balances, and metadata describing when the snapshot was generated. It can present those values clearly, but it cannot prove that nothing changed after `generatedAt`.

That distinction is visible in `accountDashboardFixtures.js`. The fresh and stale scenarios share deterministic account values. Their projection metadata differs, allowing us to study trust and communication without a backend or a clock-dependent test.

## Current and available balance

The **current balance** is the amount represented in the account snapshot, including activity that may not yet be fully settled. The **available balance** is the amount the projection says is presently available for use and may account for holds or other pending activity. The checking fixture intentionally shows different values; the savings fixture shows equal values.

These labels are not interchangeable. The component displays both and gives available balance greater visual emphasis, while avoiding promises about actual funds. In a real system, the definitions and calculations would come from authoritative product and ledger rules—not from this React component.

## Staleness is user-facing information

A timestamp helps a member understand the snapshot's age. When `isStale` is true, `ProjectionStatus` also renders explicit text that balances may be out of date. A colored border supports the message but does not carry it alone. The warning uses a status role so assistive technology can identify it.

The application selects a fixture explicitly from the URL:

- `?scenario=fresh`, or no query string, renders the fresh projection;
- `?scenario=stale` renders the stale projection.

This is deliberately not an API simulation. Deterministic fixtures make the two experiments repeatable.

## React mechanics in this lesson

### JSX and JavaScript values

JSX lets components describe semantic HTML alongside the JavaScript values that populate it. Curly braces render values such as `dashboard.member.displayName`. They also pass objects as component properties, as in the `projection` supplied to `ProjectionStatus`. JSX resembles HTML, but it is JavaScript syntax transformed during the Vite build.

JavaScript does not provide compile-time checks for those component properties. The shared PropTypes in `src/propTypes/bankingPropTypes.js` document the account, projection, and dashboard inputs and validate them at runtime during development. TypeScript, introduced later, provides a different kind of protection through static checking before the application runs.

Balances remain integer cents in the fixture. `formatCents` divides by 100 only at the display boundary and uses `Intl.NumberFormat` for US currency. This avoids using binary decimal arithmetic as the stored money representation in the lesson.

### Mapping data into components

`AccountDashboard` maps the `accounts` array to one `AccountCard` per account. React uses each synthetic account `id` as a stable list key. The key supports rendering but is not written into visible markup; the member sees a masked suffix instead.

This small split has clear responsibilities:

- `App` selects the deterministic scenario;
- `AccountDashboard` establishes page structure and maps accounts;
- `AccountCard` renders one account and formats its balances;
- `ProjectionStatus` communicates timestamp and freshness.

### Conditional rendering

`ProjectionStatus` uses a JavaScript logical expression to render the warning only when `projection.isStale` is true. There is no empty warning container in the fresh state. This makes both the visual behavior and its accessibility semantics conditional on the same fact.

## Comparing familiar approaches

In traditional server-rendered PHP, a request often loads data, interpolates it into a template, and returns complete HTML. Changing the scenario usually means another request and another server render. Here, JavaScript data is passed through a tree of React components, and React produces the browser DOM. This lesson still begins with fixed input, so it does not require client-side fetching to teach component rendering.

AngularJS commonly exposed values on a scope, attached behavior through directives, and used two-way binding to synchronize models and views. This React example has no shared mutable scope and no two-way binding. Data flows down explicitly through component properties. The dashboard is a function of its fixture: choose an input projection, then render its user-visible state.

## Run the experiments

1. Run `npm run dev` and open the printed URL. Confirm both accounts, masked suffixes, balance labels, and the last-updated value.
2. Add `?scenario=stale`. Confirm the timestamp changes and a textual stale warning appears.
3. Return to `?scenario=fresh`. Confirm the warning is absent.
4. Run `npm run test` to reproduce these observations without manually inspecting the browser.

The tests in `apps/member-web/src/components/AccountDashboard.test.jsx` focus on visible behavior. They prove that the member and both account names render, suffixes are masked, internal identifiers are absent, integer cents become currency, freshness controls the warning, and a last-updated value appears.

## Engineering tradeoffs

- **Fixtures instead of an API:** fast, deterministic, and appropriate for this lesson, but not evidence of network, authentication, or error-handling design.
- **A query-string selector:** makes experiments linkable with almost no interface machinery, but it is not a production member control.
- **Formatting in the client:** keeps the example readable and locale-aware, but a larger system would define consistent locale and currency policies across surfaces.
- **Separate available and current values:** communicates an important distinction, but the fixture cannot model all holds, settlement rules, or product-specific definitions.
- **JavaScript first:** reduces setup for this opening lesson, while accepting that static type guarantees will arrive only in a later lesson.

## Exercise

Add a third deterministic fixture whose projection is stale but whose account values remain unchanged. Give it a different `generatedAt` value, add an explicit selection branch, and write a user-visible test for its formatted timestamp. Keep the internal account identifiers hidden and do not introduce a timer or backend.
