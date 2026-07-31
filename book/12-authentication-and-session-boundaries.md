# Chapter 12: Authentication and Session Boundaries

This chapter adds a deliberately small, deterministic authentication boundary. Sign in with member ID `member-1001` and password `password`. These fictional credentials exist only to make the laboratory repeatable. They are intentionally insecure, are not production guidance, and must never be reused.

## Banking concept

**Authentication** establishes which fictional member is present. **Authorization** decides what that identity may access or do. This chapter authenticates one member and uses a secure default—no session means no protected account information. A production bank would have much stronger identity proofing and fine-grained authorization, but those mechanisms are outside this laboratory.

A session boundary separates public login UI from protected account and transfer UI. Banks protect member information because balances, account identifiers, and activity are private even when no money-moving action occurs. Logout and timeout close that boundary and remove protected projections from client state.

## React concept

React owns explicit authentication states: checking, anonymous, and authenticated. On startup it asks `GET /api/session` rather than assuming that a browser cookie means the member is signed in. Protected routes—including dashboard, account details, new transfers, and transfer confirmation—render only after an authenticated response. Otherwise a catch-all route redirects to `/login`.

Navigation is conditional. Anonymous visitors see Login. Authenticated members see Dashboard, Transfers, Settings, Logout, and the fictional display name. Logout clears the session model and the dashboard projection before returning to login.

A protected request returning HTTP 401 follows the same safe path. React discards authenticated and dashboard state, redirects, and displays “Your session has expired. Please sign in again.” It performs no automatic refresh.

## API concept

`POST /api/login` compares input with the fixed laboratory credentials and creates this deterministic session:

```json
{
  "authenticated": true,
  "memberId": "member-1001",
  "displayName": "Alex Morgan",
  "expiresAt": "2026-08-01T12:00:00Z"
}
```

`GET /api/session` reports the current session and `POST /api/logout` invalidates it. The fixed expiration makes examples and assertions repeatable; it is not a real clock-based security control. Request `GET /api/session?scenario=expired` to deterministically remove the session. Protected API requests without a session receive HTTP 401 with a safe error contract.

The browser makes authenticated requests with the same-origin session cookie managed by PHP. It never reads or treats that cookie as banking data. No JWT, OAuth provider, database, or production identity mechanism is involved.

## Comparison with traditional PHP

A traditional PHP application commonly checks a server session before rendering each page, redirects anonymous requests, and sends fully rendered authenticated HTML. Here PHP still owns the session, but React asks for JSON and controls route rendering. Both designs must enforce the boundary on the server: hiding a React link alone is not authorization.

## Comparison with AngularJS

An AngularJS application often uses route resolve functions or transition hooks as route guards and stores authentication status in a shared service. React Router expresses the same idea through state plus conditional route trees. Neither client-side technique replaces an API-side authorization check.

## Engineering tradeoffs

Client state produces immediate conditional UI, while the server session remains the authority. Duplicating state means the client must respond when the server rejects a stale assumption. Short timeouts limit exposure but interrupt members; long timeouts reduce friction but keep access open longer. A friendly, detail-free timeout message balances recovery with avoiding internal disclosure.

This implementation chooses clarity and determinism over production security. Real systems require secure deployment, credential storage, CSRF defenses, rate limiting, identity assurance, careful cookie policy, authorization, monitoring, and many other controls that are intentionally absent here.

## Relationship to the Digital Banking Systems Laboratory

Authentication controls access to banking workflows; it does not change how the underlying ledger operates. The Digital Banking Systems Laboratory focuses on banking correctness and authoritative ledger behavior. This laboratory focuses on appropriately bounded access to banking functionality and safe projections. A login neither creates funds nor validates a transfer's accounting rules.

## Exercise

Design a deterministic “locked account” login scenario. Specify its safe HTTP response, login-page message, and tests. Explain how it differs from invalid credentials without leaking sensitive identity details. **Do not implement it yet.**
