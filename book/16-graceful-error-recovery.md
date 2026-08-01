# Chapter 16: Graceful Error Recovery

An outage does not have to become a blank screen. In this chapter the laboratory treats the dashboard, transfer submission, and member verification as distinct capabilities. A deterministic failure in one capability leaves navigation and unrelated pages usable.

## Banking Concept

Financial institutions strive for graceful degradation because members may still need to review available information, change a preference, or understand what action is blocked during a partial outage. A complete application failure hides every capability and creates uncertainty. A feature-specific failure names the unavailable capability while preserving the rest. Degraded operation offers less functionality than normal, but remains useful and truthful.

The interface must not invent confidence. When the dashboard cannot provide its current projection, the application does not retain an unmarked balance. It withholds the account projection, explains why, and offers a retry. When transfer submission is unavailable, the reviewed instruction remains visible and retryable, but the application never claims that money moved.

## React Concept

Conditional rendering represents expected request states. A component can render loading, ready, and unavailable presentations from explicit state without throwing an exception. That is the correct tool for a failed HTTP request because a `503` is a normal, anticipated API result.

A React Error Boundary serves a different purpose. The class boundary in the member layout catches an unexpected error thrown while a descendant is rendering and substitutes a small fallback for that view. It does **not** catch failed HTTP requests, errors in event handlers, or every asynchronous error. Those outcomes remain the responsibility of request-state code. Keeping these mechanisms separate prevents routine service degradation from being misreported as a broken user interface.

Feature isolation also affects where state is loaded. The authenticated layout and routes render independently of the dashboard request. Settings and verification therefore do not wait for account information, while account-dependent pages display the dashboard's honest unavailable state when that projection cannot be loaded.

## API Concept

The PHP API exposes deterministic feature-specific failures through scenario query parameters:

| Experiment                       | Request                                             | Safe behavior                                                                         |
| -------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Dashboard unavailable            | `GET /api/dashboard?scenario=error`                 | `503` with `dashboard_unavailable`; no account projection                             |
| Transfer service unavailable     | `POST /api/transfers?scenario=unavailable`          | `503` with `transfers_unavailable` and `retryAvailable: true`; no transfer is created |
| Verification service unavailable | `GET /api/member-verification?scenario=unavailable` | `503` with `verification_unavailable` and `retryAvailable: true`                      |
| Unaffected settings              | open `/settings?scenario=error`                     | settings still render while the dashboard request fails                               |

These safe responses name the affected capability, avoid vendor or implementation details, and explicitly say whether retry is appropriate. Their fixed status, code, message, and retry metadata make the laboratory repeatable.

In the browser, select the scenarios with `?scenario=error`, `?transferScenario=unavailable`, or `?verificationScenario=unavailable`. These query parameters are laboratory-only selectors. Each feature reads only its own named parameter and validates it against a focused allowlist; arbitrary query parameters and unsupported values are not forwarded to the API. A normal transfer therefore posts to `/api/transfers`, while the explicit unavailable experiment posts to `/api/transfers?scenario=unavailable`. Retry is manual: there are no queues, background workers, circuit breakers, or timing-dependent recovery.

## Relationship to the Digital Banking Systems Laboratory

Backend resilience simulations explore strategies that reduce the frequency or duration of failures and define safe system responses. Experience-layer recovery determines what a member sees while such a failure still exists. Both matter: reliable backend behavior limits failure, while isolated frontend states prevent one remaining failure from becoming an application-wide outage.

This laboratory deliberately stays within one React application and one PHP API. The lesson is the contract and experience of resilience, not a microservice topology.

## Comparison with Traditional PHP

A traditional server-rendered PHP page may assemble all features before returning HTML. If dashboard retrieval fails during that request, an uncaught exception can replace the entire page with a generic error response. It can also degrade gracefully, but doing so requires the server template and controller to isolate each feature deliberately.

Here the persistent React layout keeps navigation available and each route owns its request state. The PHP API returns a narrow failure for one endpoint rather than attempting to render a full page. This makes the boundary between an unavailable capability and unaffected interface explicit.

## Comparison with AngularJS

AngularJS applications often isolated views with routes, directives, and controller-owned flags. A controller could preserve the shell while a view showed an error, but shared scopes and broad promise chains made accidental coupling easy. Component-based React encourages smaller ownership boundaries: request state lives near the affected feature, route elements are composed independently, and an Error Boundary can contain unexpected rendering failures below the shared layout.

Neither framework provides honest degradation automatically. The engineer must define which data is safe to show, which action is disabled, and which sibling features remain operational.

## Engineering Tradeoffs

### Honesty versus optimism

An optimistic interface can feel smoother, but an unmarked cached balance or a success message before transfer acceptance is misleading. Banking experiences should prefer a clear temporary-unavailable message to an unsupported claim.

### Degraded functionality

Preserving every control can be unsafe if its prerequisites are unavailable. This application preserves navigation and settings, but withholds account-dependent transfer preparation when account data is unavailable. When only submission fails, the already reviewed instruction remains available for a deliberate retry.

### Preserving trust

Specific language—“Transfers are temporarily unavailable”—helps a member understand the scope. A retry action provides agency where the API says retry is safe. The same idempotency key is retained so a retry represents the same transfer intention.

### Avoiding misleading interfaces

Never substitute zeros for unknown balances, label stale information as current, or imply that verification completed when the service did not respond. Removing information can be more trustworthy than presenting plausible but unsupported data.

## Exercise

Add a deterministic **scheduled maintenance** banner that affects only one feature. Let the reader select it with a scenario parameter, identify the affected capability and maintenance window, and demonstrate that unrelated routes continue to work. Decide whether retry should be offered during the fixed window. Do not turn the banner into a global application outage.
