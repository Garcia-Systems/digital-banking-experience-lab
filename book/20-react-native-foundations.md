# Chapter 20: React Native Foundations

## Banking Problem

Members expect the same account story in a browser and on a phone. Both experiences receive a dashboard projection from the PHP Banking API; neither owns balances or becomes an authoritative financial system. A stale projection can remain useful when explicitly labeled, an empty account list is not a zero-dollar account, and unavailable data must never be invented. The mobile client displays only masked suffixes, never internal account IDs.

## React Concept

React's mental model transfers directly. `AccountDashboardScreen` is a component; its request function is a prop; request progress is state; an effect starts the request; conditional rendering selects loading, error, empty, or success content; and `map` performs list rendering. `AccountCard` receives each account through props. The change is the rendering target, not those data-flow ideas.

## Native Component Model

| Browser React | React Native  |
| ------------- | ------------- |
| `div`         | `View`        |
| `p` or `span` | `Text`        |
| `button`      | `Pressable`   |
| CSS           | `StyleSheet`  |
| browser page  | native screen |

These are not exact substitutions. Text must live in `Text`; layout defaults to Flexbox with a vertical direction; style properties are JavaScript values rather than a cascading stylesheet; and `Pressable` supplies interaction semantics that the application must label. A native screen participates in an iOS or Android view hierarchy rather than producing HTML or a DOM.

Native screens must also respect space reserved for notches, status bars, and home indicators. React Native's older built-in `SafeAreaView` is deprecated. The dashboard instead places one `SafeAreaProvider` from `react-native-safe-area-context` near the application root and uses that library's `SafeAreaView` for screen containers. The device supplies its insets, so production layout does not hardcode padding for a particular phone; tests provide fixed metrics for repeatability.

## API Configuration

The app reads `EXPO_PUBLIC_API_BASE_URL` and calls the existing `/api/dashboard` endpoint. A browser on the API computer can interpret `localhost` as that computer. An Android emulator usually treats it as the virtual device and may need the emulator host alias. An iOS simulator often shares the Mac network, though configuration matters. A physical phone treats `localhost` as the phone and normally needs the development computer's reachable LAN address. Firewalls and the server bind address must permit that connection.

Before requesting that protected dashboard, the app checks its in-memory laboratory session and presents a native sign-in screen when none exists. Use the displayed fictional `member-1001` / `password` credentials. This establishes a deterministic, mobile-only teaching token because React Native cookie persistence must not be assumed to behave like a browser. The token is not persisted and is not production authentication. A session-expiration `401` removes protected data and returns to sign-in; **Sign out** demonstrates the same boundary deliberately.

The committed `http://127.0.0.1:8000` fallback is convenient for same-host development, not a claim that loopback works from every device. Set the environment variable before Expo bundles the app; the URL is public configuration and must not contain secrets.

## Accessibility

Browser accessibility uses semantic HTML and DOM-oriented ARIA. React Native exposes native properties such as `accessibilityRole`, `accessibilityLabel`, and `accessibilityLiveRegion`. The dashboard supplies textual loading feedback alongside its spinner, describes cards with masked suffixes, expresses stale status in words, and gives the retry `Pressable` a button role and clear label. Copying arbitrary web ARIA attributes would not create native semantics.

## Shared Code

Currency and timestamp formatting, scenario allowlists, and response validation are ordinary JavaScript without DOM dependencies and are portable concepts. Visual components are intentionally separate: a web `AccountCard` renders HTML and CSS, while the mobile card renders native primitives and `StyleSheet` values. Sharing business rules does not require a broad cross-platform design system.

## Comparison with Traditional PHP

A traditional server-rendered PHP page creates HTML for a browser. Here PHP remains entirely suitable as the mobile backend: Laravel returns JSON, and React Native turns that contract into native UI. The division changes presentation responsibility, not the API's ability to supply banking projections.

## Comparison with AngularJS

AngularJS experience with components, data-driven screens, conditional views, repeated collections, and service calls remains useful. React Native does not use browser templates, DOM directives, or CSS selectors. State and props drive a native component tree instead.

## Testing

React Native Testing Library renders the component tree in Jest and queries member-visible text, accessibility labels, and roles. Mock requests prove loading, success, stale, empty, failure, retry, duplicate-retry prevention, and malformed-response safety without launching an emulator or contacting an API. Tests avoid internal state and style details.

## Engineering Tradeoffs

- **One shared API versus mobile-specific APIs:** one contract avoids duplicated financial meaning; a future experience-specific API needs demonstrated client requirements.
- **Shared utilities versus visual components:** portable rules reduce drift, while platform-native visual components preserve correct rendering and accessibility.
- **Expo versus custom native configuration:** Expo makes this foundation and CI check small; custom projects offer deeper native control at higher setup cost.
- **Mobile UX versus web parity:** consistent account meaning matters more than pixel imitation. Narrow screens and touch targets deserve native choices.
- **Deterministic scenarios versus live dependencies:** fixed outcomes make failure learning repeatable; they do not replace later deployed integration validation.

## Runnable Experiments

Before each run, predict whether accounts, a warning, or a safe failure should appear. Then start Expo with one allowlisted value:

```bash
EXPO_PUBLIC_DASHBOARD_SCENARIO=success npm run mobile:start
EXPO_PUBLIC_DASHBOARD_SCENARIO=empty npm run mobile:start
EXPO_PUBLIC_DASHBOARD_SCENARIO=stale npm run mobile:start
EXPO_PUBLIC_DASHBOARD_SCENARIO=error npm run mobile:start
EXPO_PUBLIC_DASHBOARD_SCENARIO=partial npm run mobile:start
```

`success` displays checking and savings; `empty` is a valid projection with no cards; `stale` keeps cards with a warning and last-updated value; `error` is an HTTP failure with retry; and `partial` is HTTP 200 but fails the minimum contract, producing the safe unavailable presentation. Also set `EXPO_PUBLIC_API_BASE_URL` when the runtime cannot reach loopback.

## Exercise

Add a fictional certificate account with integer-cent balances to the PHP dashboard fixture. Verify that it appears in the mobile list without changing the account-list rendering in `AccountDashboardScreen`. Add a behavioral test, keep its internal ID hidden, and do not implement certificate-specific interaction.
