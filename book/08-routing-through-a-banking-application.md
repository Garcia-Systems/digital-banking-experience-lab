# Chapter 8: Routing Through a Banking Application

A banking experience is not one endlessly growing dashboard. Members move between an overview, one account's details, and preferences while retaining the context already loaded by the application. This chapter introduces **client-side routing** as the mechanism behind those screens.

## The routes are banking workflows

The member application now maps `/` to the dashboard, `/accounts/:accountId` to account details, and `/settings` to deterministic member preferences. A catch-all route provides a friendly missing-page experience. These are deliberately few routes: transfers, authentication, and transaction history are not part of this chapter.

The dashboard remains the overview projection. Each **View account** link moves to the corresponding account screen without asking the browser to load a new document. React Router changes the URL and selects another React element while the application stays mounted. Consequently, the dashboard response held in `App` state survives navigation instead of being fetched again.

## Route parameters select an account

The colon in `:accountId` declares a route parameter. `AccountDetails` reads that value with `useParams` and finds the matching account in the loaded projection. `/accounts/account-2001` therefore selects Everyday Checking, while `/accounts/account-2002` selects Member Savings.

URLs are untrusted input. When the identifier does not match a projected account, the screen says **Account not found.** It neither crashes nor reveals component names, data structures, or API details.

## A shared layout

`MemberLayout` is the stable frame around each route. It renders the fictional credit-union identity, a small navigation bar, the selected child route through `Outlet`, and the educational footer. Nested routes are useful here because the dashboard, account details, settings, and missing-page experience genuinely share that shell. Deeper nesting would add structure without a banking need, so this chapter avoids it.

`NavLink` gives Dashboard and Settings real client-side navigation links and exposes the current destination for styling. Account cards use `Link` for the same reason. These remain ordinary, accessible links: members can recognize destinations, use keyboard navigation, and retain meaningful URLs.

## Why banks separate screens

The dashboard answers, “What accounts do I have, and how fresh is this overview?” The account page answers, “What are the balances and status of this account?” Settings answers, “What preferences are associated with this fictional member?” Separating those questions keeps each screen focused and gives future transaction lessons a natural home on the account route. Chapter 8 intentionally shows only a recent-activity placeholder; it does not pretend transaction history exists yet.

Projection freshness appears on both the overview and a selected account. Moving it with the account context reinforces that a balance is a read-model projection with a timestamp, not automatically the authoritative ledger.

## Compared with traditional PHP navigation

In traditional server-rendered PHP navigation, selecting an account usually sends a request for a new HTML document. The server matches the URL, renders the whole page, and the browser replaces the current document. This laboratory still uses PHP for the JSON projection, but React Router handles screen selection after the initial application document loads. A navigation event changes the URL and rendered component without reloading that document or discarding React state.

This is not a claim that client routing replaces the server. The PHP endpoint continues to own its HTTP/JSON contract, and a production host must be configured to serve the React entry document for application URLs requested directly.

## Compared with AngularJS

AngularJS applications commonly configured routes with modules such as `ngRoute`, inserted templates through `ng-view`, and coordinated data through controllers and scopes. This implementation uses React components, `Routes`/`Route`, a layout `Outlet`, hooks such as `useParams`, and ordinary component state. Both approaches can provide client-side navigation, but no AngularJS scope or controller lifecycle exists here: the loaded banking projection flows as explicit React props into whichever route is active.

## What to observe

1. Open `/` and note both account summaries and projection freshness.
2. Select **View account** and watch the URL change without a full-page reload.
3. Confirm the account suffix and balances correspond to the route parameter.
4. Navigate to Settings and back; the loaded projection remains in application state.
5. Request an invalid account identifier and an unknown URL to see the two safe failure experiences.

Routing is valuable here because it expresses member tasks as focused, linkable screens—not because every component needs a URL.
