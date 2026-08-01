# Chapter 21: Mobile Banking Workflows

Chapter 20 established the native application boundary. This chapter turns that foundation into a small, complete read-only banking journey: a member moves from a dashboard to account details and transaction history, or prepares and reviews a transfer without submitting it.

## Banking Concept

Members expect balances, account names, and transaction facts to agree whether they use a browser, a phone, or speak with an employee. Financial institutions therefore strive for channel consistency while adapting each interaction to its setting. A mobile interface favors concise cards, large touch targets, and a linear task flow; an employee portal can favor dense operational context. Consistency means the same underlying banking facts and rules, not identical page layouts.

Accounts in this laboratory remain projections of deterministic banking services rather than an authoritative ledger. Transaction history is another read-only projection. A freshness message and last-updated timestamp make that boundary visible instead of implying that cached data is current.

## React Native Concept

A screen composes small platform-specific components: safe-area containers, scroll views, text, pressable controls, and native text inputs. `MobileApp` holds the current screen and selected account in local state. Dashboard account presses select an account; back and task buttons change the screen. This deliberately small state machine teaches navigation without introducing advanced React Navigation features.

Native controls provide mobile semantics such as radio state, decimal keyboards, loading indicators, and accessible press targets. React state keeps request status, form fields, validation errors, and the transfer review separate. The review is derived only after local validation succeeds, and editing a field clears it.

## API Concept

One backend can support multiple clients when it returns domain-shaped JSON rather than rendered interface markup. The existing PHP dashboard endpoint provides member, projection, account, balance, and deterministic transaction data. React web, React Native mobile, and the employee application interpret that contract for their own presentation targets; the server does not duplicate rules in a mobile-only endpoint.

The mobile client validates a successful response before rendering it. Shared, platform-independent JavaScript handles cents-to-currency formatting, timestamp formatting, response validation, freshness interpretation, and transfer input rules. React DOM components are not imported into React Native.

## Relationship to the Digital Banking Systems Laboratory

The companion systems laboratory explains how ledger activity becomes queryable projections. Here those same ideas appear at the experience boundary. Available and current balances, projection freshness, and posted transaction history retain the same meaning across the member website, mobile screens, and operations portal even though each interface composes them differently.

## Comparison with Traditional PHP

A traditional PHP application commonly renders an HTML page on the server after every request. A native application cannot display that HTML as native controls without becoming a web view. Instead, it requests JSON and renders platform-native views locally. PHP remains responsible for the shared banking contract and deterministic services; React Native owns touch interaction, screen composition, and transient presentation state.

## Comparison with AngularJS

Both AngularJS and React Native create data-driven interfaces: state changes cause visible output to update, repeated records become lists, and form values drive validation. Their rendering targets differ. AngularJS templates normally bind to browser DOM elements and browser routing, while React Native produces native views and controls. The API concepts can be reused, but DOM directives and components cannot.

## Engineering Tradeoffs

### Platform consistency versus native UX

Identical screens can look consistent but ignore platform conventions and constrained phone space. This chapter keeps terminology and data consistent while using large pressable account cards and linear mobile screens.

### Shared business logic versus platform-specific UI

Formatting and contract validation are inexpensive to share because they do not render anything. Sharing browser components would couple the mobile app to the DOM. The boundary is intentional: business utilities may be portable, while each client owns its components.

### Deterministic educational fixtures versus live banking systems

Fixed fictional transactions make loading, stale, empty, failure, and malformed-response tests repeatable without a network. Live systems require authentication, authorization, evolving data, observability, and stronger operational controls. Determinism is a teaching tool, not a production architecture.

## Exercise

Add a fictional **Certificate Account** to the dashboard fixture. Verify that it appears automatically in both the web and mobile applications without changing the PHP API. Do not create a client-specific endpoint.
