# Chapter 13: Member Verification and Vendor Integrations

This chapter adds a fictional identity-verification workflow without connecting to a real institution or provider. Choose a deterministic outcome with `/verification?verificationScenario=success`, `timeout`, `unavailable`, `invalid-response`, or `permanent-failure`.

## Banking Concept

Financial institutions rely on specialized external providers for capabilities such as identity verification, fraud signals, document review, and sanctions screening. Those services can concentrate expertise, but they remain outside the institution's application and operational control. A sound member experience therefore treats latency, malformed responses, outages, and negative decisions as normal states to design for—not surprising exceptions.

Verification status is a member-facing projection of that boundary. It says what the member can do next while withholding provider names, payloads, identifiers, and diagnostic details.

## React Concept

External work is asynchronous even when the simulator answers immediately. `MemberVerification` loads the current state, conditionally renders a start or retry action, and displays **Verification Pending** while a request is in flight. It never retries automatically. Local request state distinguishes loading and transport failure from the durable workflow states returned by the API.

Conditional rendering makes each transition explicit: **Not Started**, **Verification Pending**, **Verified**, **Retry Required**, and **Verification Failed**. The interface preserves a useful explanation and last-attempt timestamp without exposing technical errors.

## API Concept

The React client calls an **internal API**: the stable contract owned by the banking application. The PHP API alone calls the deterministic **external vendor API simulator**. In production those boundaries may have different credentials, availability, schemas, and release cycles. Keeping the vendor behind the internal API prevents vendor-specific response fields from leaking into the browser and gives the institution one place to validate responses.

The simulator deliberately produces success, timeout, unavailable, invalid-response, and permanent-failure results. The controller defensively translates every result into a small safe contract. A malformed response becomes retryable rather than being trusted or displayed.

## Relationship to the Digital Banking Systems Laboratory

Earlier systems concepts distinguish transient failures, permanent failures, retries, and dead-letter queues. This repository concentrates on how those distinctions appear to a member: whether to show **Try Again**, stop retrying, or direct the member to the credit union. The separate Digital Banking Systems Laboratory focuses on durable backend workflow, attempt scheduling, observability, and eventual dead-letter handling. No queue or worker is introduced here.

## Comparison with Traditional PHP

A traditional server-rendered PHP application often called a vendor while generating a page. The request could block page generation, and a retry commonly meant submitting or refreshing the whole page. React instead keeps the current screen mounted, calls the internal JSON API asynchronously, and changes only the workflow presentation. In both styles, PHP should own the external boundary and safe error translation.

## Comparison with AngularJS

AngularJS applications commonly placed asynchronous calls in a service using `$http`, exposed promise outcomes through controller or `$scope` state, and used directives such as `ng-if` for conditional UI. This React implementation uses `fetch`, component state, effects, and ordinary JavaScript conditions. The syntax differs; both approaches still require explicit state transitions and a deliberate service boundary.

## Engineering Tradeoffs

- **Retry versus immediate failure:** transient outages justify a member-initiated retry; a permanent decision should not invite repeated submissions.
- **Technical detail versus useful messaging:** diagnostics help operators, but provider details and exception text confuse members and can disclose sensitive internals.
- **Simulation versus live services:** fixed scenarios are fast, safe, and reproducible for teaching and tests. They cannot demonstrate every behavior of a real network dependency.
- **Frontend resilience:** loading, failure, and retry states prevent a slow dependency from producing a frozen or misleading interface. This adds state-management and testing work.
- **Operational visibility:** safe member messages do not replace internal telemetry. A production API would correlate sanitized member outcomes with protected operational diagnostics.

## Exercise

Add a deterministic `maintenance-window` scenario. Decide whether it is retryable, define its safe internal API contract, and add backend and frontend tests. Do not expose a provider name or automatically retry the request.
