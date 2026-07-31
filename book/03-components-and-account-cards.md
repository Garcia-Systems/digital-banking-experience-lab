# 03: Components and account cards

## Banking problem

One member can hold several products. Alex Morgan's checking and savings accounts share balance labels, masked identifiers, statuses, and recent-activity areas, but each must remain easy to distinguish. Copying card markup would invite subtle inconsistencies; collapsing everything into an undifferentiated total would hide important banking meaning. In particular, available balance and current balance are separate values, and a dormant savings account is not interchangeable with an open checking account.

## React concept: components describe concepts

A React component is a JavaScript function used as an element in the component tree: it receives inputs and returns an interface description. An ordinary helper function may calculate or format a value, but a component participates in composition and returns React elements. Capitalized names such as `AccountCard` tell JSX and readers that the function is a component.

`App` selects deterministic fixture data and renders `AccountDashboard`. The dashboard owns page-level composition: the member welcome, projection freshness, and deposit-account section. `AccountList` owns the collection rule and empty case. It maps each account to `AccountCard`, using the stable synthetic account ID as React's key. Each card presents exactly one projection through `AccountHeader`, `BalanceSummary`, and `RecentActivitySummary`.

These boundaries follow banking concepts, not arbitrary tags. A component that merely wrapped one `div` would add indirection without a new responsibility. Conversely, leaving identity, balances, activity, and list decisions in one large component would make each display rule harder to find. The extracted pieces are still local to this dashboard rather than pretending to be a complete design system.

Components receive the values they display through clearly named props. `AccountCard` does not import a fixture, choose an account, mutate balances, or know about the entire dashboard. That makes it readable in isolation and lets `AccountList` render any supplied collection. This chapter uses props as component inputs but leaves detailed data-contract design to a later chapter. Shared PropTypes provide lightweight runtime validation without TypeScript or a general schema layer.

## The implemented composition

The relevant component tree is:

```text
App
└── AccountDashboard
    ├── ProjectionStatus
    └── AccountList
        └── AccountCard
            ├── AccountHeader
            ├── BalanceSummary
            └── RecentActivitySummary
```

- `apps/member-web/src/components/AccountDashboard.jsx` establishes page sections and passes the account collection onward.
- `AccountList.jsx` renders a semantic list, supplies stable keys, and owns the explicit empty message.
- `AccountCard.jsx` composes one account projection and gives its `article` an accessible name that includes product identity and type.
- `AccountHeader.jsx` presents the product name, readable type badge, masked suffix, and textual status. The stable internal ID is never member-facing.
- `BalanceSummary.jsx` keeps integer cents in data and formats them only at the display boundary. Its definition list makes available and current balances separate label-value pairs.
- `RecentActivitySummary.jsx` owns the activity region. It currently renders **No recent transactions.** for the fixtures, while leaving a semantic list branch ready for later transaction work.
- `ProjectionStatus.jsx` remains a separate dashboard-level concept because freshness applies to the projection, not to an individual account.

## Empty is not zero, loading, failed, or stale

`emptyAccountDashboard` preserves the same fictional member and current projection metadata but supplies an empty `accounts` array. It represents a successful response with no visible accounts:

- **Empty** means the projection succeeded and contains no accounts to show, so the page says **No accounts are currently available.**
- **Loading** means the result is not known yet. This static chapter has no request or loading behavior.
- **Failed** means an attempted operation did not produce usable data. An empty successful collection is not an error.
- **Zero balance** describes a real account whose balance is zero. Inventing a `$0.00` card would falsely claim that an account exists.
- **Stale** means projection data exists but may be out of date. Freshness metadata and the visible status communicate this independently of collection size.

Missing markup would leave the member without an explanation. A loading screen or generic error would misstate a known successful result. The explicit message preserves the meaning of the fixture without fabricating an account.

## Runnable experiment

Start the application with `npm run dev`, then compare these deterministic URLs:

1. `?scenario=multiple-accounts` renders checking and savings cards. Compare their names, badges, statuses, masked suffixes, and individually scoped balances.
2. `?scenario=empty-accounts` retains Alex's welcome and the current projection timestamp, reports `0 accounts`, and renders the explicit empty message instead of cards.

The selector in `apps/member-web/src/data/selectDashboardFixture.js` uses the existing query-string scenario mechanism. There are no new controls, routes, requests, state, or random values. The existing `?scenario=stale` experiment remains available.

## Comparison with traditional PHP

Server-rendered PHP can absolutely be componentized with partials, templates, reusable view helpers, and explicit parameters. A PHP account-card partial could receive one account and emit similar semantic HTML. In this browser application, React components combine rendering decisions with explicit inputs inside a JavaScript component tree, and the parent composes child components as elements. The meaningful distinction is execution and composition model—not a claim that PHP cannot reuse views.

## Comparison with AngularJS

An AngularJS version might expose accounts through a controller and scope, repeat a template with `ng-repeat`, and package card behavior in a directive or component. React's dashboard instead passes values explicitly down the component tree; `AccountList` uses ordinary JavaScript `map`, and each function returns JSX. There is no controller-managed scope, directive-linking lifecycle, Angular template expression language, or two-way binding. Both approaches can create reusable UI, but this implementation keeps the account collection and card composition visible in JavaScript.

## Testing visible behavior

`AccountDashboard.test.jsx` renders the composed dashboard rather than asserting component names or CSS selectors. It queries the account `article` elements by accessible names so checking and savings remain distinguishable. Because labels such as **Available balance** and **No recent transactions.** repeat, `within` scopes each assertion to the relevant card. Tests also prove that the fixture produces one card per account, each card owns its balances and activity message, and internal IDs do not appear as member-facing text.

The empty fixture test verifies both sides of the contract: the explanatory message is present and account articles are absent. The fixture-selector test documents that `multiple-accounts` and `empty-accounts` are explicit and deterministic.

## Engineering tradeoffs

A single dashboard component would reduce file count, but mix page structure, collection behavior, account identity, balance semantics, and activity rendering. Too little abstraction makes those responsibilities hard to scan and reuse. Too much abstraction—components for badges, individual labels, or generic card shells—would fragment a small lesson and obscure how the banking concepts fit together.

The chosen components favor local clarity. `BalanceSummary` is meaningfully reusable across account products, while `AccountHeader` deliberately understands this fixture's banking fields. That specificity is useful: premature generalization into a shared design system would require contracts that the laboratory has not yet earned. Reuse is valuable when responsibilities genuinely repeat, not when it erases domain meaning.

## Exercise

Add a fictional certificate account to `accountDashboardFixture` using integer cents, a masked suffix, a supported status, and an empty transactions array. Render the multiple-account scenario and add a user-visible test for its accessible card name and balances. `AccountList` should require no modification: its existing collection composition should render the new account automatically. Do not add state, requests, controls, or concepts from later chapters.
