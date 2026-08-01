# Chapter 15: Retryable Operations

A trustworthy banking experience does not treat every unsuccessful request alike. This chapter adds a deterministic member-verification operation that can succeed, fail temporarily, or fail permanently. The examples teach decisions and interface behavior, not a production retry system.

## Banking Concept

A **transient failure** means the member's request may still be valid, but infrastructure could not complete it at that moment. A timeout, temporary service outage, or unavailable external dependency can all be transient. Retrying the same operation later may succeed.

A **permanent failure** means repeating the unchanged request cannot help. Invalid member information, an unsupported request, or a rejected verification needs corrected information, a different process, or help from the credit union. Offering an identical retry would create false hope and reduce member confidence.

Members usually cannot see the dependency boundary. They need a safe explanation, a clear next step, and confidence that clicking again will not repeat unrelated work or create duplicate financial actions.

## React Concept

`MemberVerification` keeps the response and request state separate. Conditional rendering turns `retry_required` into a **Try Again** control, while a permanent result provides guidance without a retry control. The retry calls only the member-verification endpoint; it does not reload the dashboard or repeat another request.

During a retry, the component changes state to `retrying`, announces progress with a status region, and disables the button. A synchronous ref guard also rejects a second click before React can render the disabled state. Together these behaviors preserve the member's original intent and prevent duplicate submissions.

This is manual retry only. There is no timer, automatic loop, retry library, queue, or background worker.

## API Concept

The deterministic PHP simulator accepts named scenarios:

- `success` returns an approved result;
- `timeout`, `unavailable`, and `temporary-upstream-failure` always return a temporary failure;
- `timeout-then-success` fails on the first attempt and succeeds on later attempts;
- `invalid-member-information`, `unsupported-request`, and `permanent-failure` return permanent failures.

The API uses a stable, member-safe JSON shape. `canRetry` is the application's explicit retry decision; the browser does not infer that decision from vendor details. The educational API returns HTTP `503 Service Unavailable` for transient outcomes, `422 Unprocessable Content` for permanent outcomes, and `200 OK` for success. Real systems must define status semantics carefully, but the important lesson is that HTTP failure responses can still contain a safe application outcome the interface should render.

Attempt counts live only in the laboratory session. This makes `timeout-then-success` deterministic: attempt one fails and every later attempt succeeds. It does not model durable storage or production coordination.

## Relationship to the Digital Banking Systems Laboratory

The separate **Digital Banking Systems Laboratory** models backend retry behavior and the system decisions behind retryable work. This repository models how a member experiences those decisions: understandable language, an intentional retry control, visible progress, and protection against repeated actions.

The two perspectives are complementary. A backend may classify an outcome as transient, but the experience layer must still preserve intent, expose no internal identifiers, and explain what the member can do next.

## Comparison with Traditional PHP

A traditional PHP application often retries after a full page refresh or another form submission. That round trip rebuilds the whole page and can accidentally repeat more work unless the server carefully identifies the operation.

A modern React client can retain the current page, repeat only the failed API call, disable its specific control, and update one result in place. Server-side correctness is still essential: client-side disabled buttons alone cannot guarantee idempotency for financial actions.

## Comparison with AngularJS

AngularJS applications commonly attached retry behavior to promise callbacks and exposed flags on a controller or `$scope`. React expresses the same asynchronous lifecycle through component state and conditional rendering. A ref provides an immediate duplicate-request guard while state drives the accessible interface.

Neither framework makes retries safe by itself. The operation boundary, retry classification, and duplicate protection remain engineering decisions shared with the API.

## Engineering Tradeoffs

### Automatic retry versus manual retry

Automatic retry can hide a brief outage, but it can also increase load, delay feedback, and repeat an unsafe action. Manual retry gives the member control and makes the new attempt visible. This chapter deliberately chooses one manual attempt per click.

### Member control

A clear **Try Again** action lets the member decide whether to wait or proceed. Permanent failures omit that action and direct the member to Harbor Community Credit Union instead of encouraging an operation that cannot succeed.

### Avoiding duplicate financial actions

Disabling a control and guarding the handler improve the experience, but production money movement also needs a server-enforced idempotency strategy. Chapter 10 demonstrates that boundary for transfers. This chapter does not create transfers during verification and never replays dashboard requests.

### Responsiveness versus correctness

Immediate feedback makes an interface feel responsive; preventing concurrent requests protects correctness. The progress announcement and disabled control provide both without pretending the result is known early. Safe copy avoids stack traces, exception names, vendor implementation details, and internal service identifiers.

## Exercise

Add a deterministic `maintenance-window` scenario. Decide which HTTP status, member-safe message, and `canRetry` value it should return, then add frontend and backend tests for its behavior. Keep it deterministic and manual: do not add an automatic retry loop, timer, queue, or background worker.

Do not implement the exercise as part of this chapter.
