# 12: Authentication and session boundaries

## Learning objectives

- Establish and inspect a laboratory session.
- Protect member API routes.
- Handle expiration and logout.
- Explain why browser and mobile transports differ.

## Banking concept

**Authentication boundaries.** Harbor checks identity before returning dashboard, verification, or transfer data. The fixed credentials and token are teaching mechanisms, not production identity or secret storage.

## Frontend concept

**Session-aware clients.** Member Web checks `/api/session`, signs in at `/api/login`, relies on the same-origin Laravel session cookie, and posts `/api/logout`. A `401` clears protected UI and returns the member to sign-in.

## Implementation

`apps/member-web/src/App.jsx` and `Login.jsx`, plus `SessionController.php`, `RequireLaboratorySession.php`, and `routes/api.php`, implement the browser boundary.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run test:member -- --run src/App.test.jsx
```

## What to observe

Anonymous users see login, valid fictional credentials establish the session, protected data loads, expiration returns to login, and logout removes the protected experience.

## Engineering tradeoffs

Cookie sessions suit same-origin browser requests but require CSRF and secure-cookie controls in production. The laboratory demonstrates boundaries without claiming production authentication completeness.

## Automated tests

`App.test.jsx` validates browser session flow; `AuthenticationTest.php` validates login, session inspection, protection, expiration, bearer support, and logout.

## Exercise

Add a browser test proving protected dashboard content is removed after the existing logout action.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
