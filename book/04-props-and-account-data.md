# Chapter 4: Props and account data

The Harbor dashboard is a deterministic view of fictional account data. This chapter makes the path from that data to the screen explicit: parents own values and pass focused, read-only inputs—**props**—to children.

## Banking concept: separate data from presentation

An account projection describes what the experience is allowed to show: product metadata, balances, status, ownership, and the time at which the projection was generated. It is not the ledger, and the React components do not change it. Keeping banking information separate from presentation lets the same account appear on the web, on mobile, or in an employee portal without changing the underlying account information. Each experience can choose an appropriate layout while consuming the same meaning.

The fixture remains fictional and deterministic. `availableBalanceCents` and `currentBalanceCents` distinguish two balance concepts; `generatedAt` and `isStale` explain projection freshness; and nickname, ownership, and dividend eligibility are product metadata. Components format and label those values but never invent them.

## React concept: props and one-way data flow

Props are values a parent supplies when it renders a child. They are read-only component inputs. A child may select a presentation or conditionally render text from a prop, but it must not assign to or otherwise modify that prop. The parent remains the owner of the data.

```text
Dashboard Fixture
        │ dashboard
        ▼
AccountDashboard
        │ accounts
        ▼
   AccountList
        │ account
        ▼
   AccountCard
      │       │
      ▼       ▼
AccountHeader BalanceSummary
 header values   balance values
```

`AccountDashboard` receives the complete dashboard because it coordinates the member, projection, and account list. `AccountList` receives only accounts. Each `AccountCard` receives one account, then gives `AccountHeader` only header values and `BalanceSummary` only the two balances it presents. `ProjectionStatus` receives a projection, not account information. This downward, explicit path is React's **one-way data flow**.

Read-only does not mean that JavaScript freezes every prop automatically. It describes the component contract: a child treats its inputs as facts owned elsewhere. If an input differs, the parent renders the child with a different value. This makes the screen easier to reason about because every visible difference can be traced upward to incoming data.

## Conditional presentation from props

The metadata component receives `interestBearing`. A true value produces “Earns dividends”; a false value produces “No dividends.” A restricted status can produce “Transfers unavailable.” The component decides how to communicate a fact, while the fixture supplies the fact. There is no state, handler, or mutation.

The runnable experiment provides two query-string scenarios:

- **Scenario A — individual checking:** `?scenario=individual-checking`
- **Scenario B — joint interest-bearing savings:** `?scenario=joint-savings`

Both scenarios travel through `App` → `AccountDashboard` → `AccountList` → `AccountCard`. No component implementation changes between them; only incoming fixture props change. The existing `?scenario=multiple-accounts` view shows both together.

## Comparison with PHP templates

A PHP controller often loads data and passes an associative array or object to a template. The template reads fields and emits HTML. React props are similar: a parent supplies a named object or individual values, and the component returns a description of the UI. In this laboratory, JavaScript fixtures play the data-supplying role and React components play the presentation role. No PHP is required or introduced.

React additionally makes composition visible at every component boundary. `<BalanceSummary availableBalanceCents={...} />` documents the child's input at the call site, and PropTypes validate that runtime contract during development.

## Comparison with AngularJS

AngularJS commonly made values available through controller scopes, inherited scopes, and two-way binding. That convenience could make it less obvious which layer owned a value or which direction a change traveled. React favors explicit props flowing from parent to child. Children do not write back through props, so ownership and the route data takes through the component tree remain visible.

This is a comparison of teaching models, not a claim that every AngularJS application used the same architecture. The useful distinction here is explicit, one-way component inputs versus values discovered through a scope hierarchy.

## Engineering tradeoffs

Passing an entire account to `AccountCard` is readable because the card coordinates several account-specific presentations. Passing that same account to `BalanceSummary` would be unnecessarily broad: the balance component needs only two numbers. Focused props make dependencies clear and allow that component to render without member, projection, transaction, or product data.

The opposite extreme—splitting every object into many props through every level—creates excessive prop drilling and noisy call sites. Prefer the smallest input that keeps ownership and intent obvious, not the smallest input mathematically possible. Keep components focused, allow coordinating components to receive coherent objects, and extract another boundary only when it improves the lesson or design.

Small shared formatters centralize deterministic currency, timestamp, masked-suffix, and ownership presentation. They prevent slightly different labels from spreading across cards without becoming a general utility framework.

## Exercise: add a Money Market account

Add a fictional Money Market account by changing fixture data only. Give it a unique synthetic ID and suffix, a display name and nickname, joint or individual ownership, `interestBearing: true`, balances in integer cents, a supported status, and an empty transaction list.

Do not modify a component. Run the application and verify that the existing hierarchy renders its heading, metadata, dividend text, masked suffix, and balances. Then run the tests. If component code is required merely to show this new account type, identify which component is making an assumption that belongs in the data.

## Chapter boundaries

This chapter deliberately contains no state, hooks, event or click handlers, forms, API requests, routing framework, React Native, TypeScript, PHP runtime code, backend, or database. The interface remains a pure, deterministic presentation of fictional fixture props.
