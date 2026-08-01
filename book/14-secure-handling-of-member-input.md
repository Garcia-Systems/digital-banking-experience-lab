# Chapter 14: Secure Handling of Member Input

Member input crosses a trust boundary when it leaves the browser. This chapter expands the transfer workflow to show a simple rule: validate at every boundary, keep member-facing failures useful and safe, and render member text as text.

## Banking Concept

A transfer instruction affects financial state, so a financial application validates every request. Browser validation improves the member's experience, but it is not evidence that a request is trustworthy. A caller can disable JavaScript, modify a request, replay an old request, or call the API without the application. The PHP API therefore checks required accounts, distinct account selection, a positive amount within the fictional available balance, memo length, and request identity again.

This duplication is intentional. It prevents malformed instructions from reaching the transfer store and protects member information by returning only corrections the member can act on. Validation responses never need stack traces, exception names, source paths, or storage details.

## React Concept

The transfer form uses controlled components: React state is the current value of every select and input, and each change updates that state. This makes immediate validation feedback, a character count, and an explicit review step predictable. Client validation is a usability feature. It catches common mistakes without a network round trip, but it does not move the trust boundary out of the API.

React escapes string values during normal JSX rendering. A memo such as `<strong>Rent</strong>` is consequently displayed with its angle brackets; it does not create a `strong` element. The review uses `{review.memo}` for exactly this reason. Do not create a custom HTML sanitizer for ordinary member text.

React provides `dangerouslySetInnerHTML` for the uncommon case where an application deliberately inserts HTML into the DOM. Its deliberately alarming name signals that the caller, rather than React, becomes responsible for the safety of that markup. Avoid it unless HTML rendering is an absolute product requirement and a separately designed, carefully reviewed content pipeline exists. This laboratory never needs it for a transfer memo.

## API Concept

The API is authoritative. Laravel validates the JSON payload before calling the deterministic transfer store. Rules cover required values, known and different accounts, integer cents greater than zero, available balance, memo type and length, and the idempotency key. Sending a request directly to the API does not bypass these checks.

Invalid requests receive HTTP `422` and field-oriented arrays:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "amountCents": ["Transfer amount must be greater than zero."]
  }
}
```

The React application maps API field names to its form controls and shows the first safe message next to the corresponding input. This stable structure is more useful than parsing prose and supports more than one message per field. Unexpected failures use a generic retry message rather than exposing implementation details.

Validation is not sanitization. The API preserves a valid memo as ordinary text, and React performs output encoding when it renders that value. Altering or stripping harmless characters would change the member's instruction and conceal the important distinction between validating input and safely placing output into a particular context.

## Relationship to the Digital Banking Systems Laboratory

Trustworthy systems validate information at every layer, even when an earlier layer already performed checks. The experience layer can provide fast guidance; the service boundary independently enforces its contract; deeper banking systems would enforce their own invariants. No layer treats an upstream success as proof that its own assumptions hold.

This laboratory keeps the example deterministic and local, but the boundary lesson applies to larger systems. Each component accepts only the shape and meaning it understands, communicates failures through an explicit contract, and discloses no more than the caller needs to recover.

## Comparison with Traditional PHP

A traditional server-rendered PHP form commonly posts values to the same application, validates them, and then redisplays the page with the submitted values and inline errors. That can be secure and accessible: the server remains authoritative, output escaping is applied by the template, and the full page response carries the correction state.

The React version retains controlled values in the browser and consumes JSON errors without a full-page refresh. The transport differs, but the obligations do not. Both approaches must validate on the server, encode values for their output context, preserve safe values during correction, and avoid revealing internal diagnostics.

## Comparison with AngularJS

AngularJS forms also expose client-side validity state and normally interpolate text with escaping. Directives can show required, numeric, and length feedback much as controlled React state does here. AngularJS has escape hatches for trusted HTML, just as React has `dangerouslySetInnerHTML`; neither should be used for ordinary member input.

React makes this example's value and error flow explicit through state and JSX. AngularJS often derives it through controllers, model bindings, and form-controller properties. In either framework, client rules help the member but cannot authorize an API request, and normal text rendering is safer than an HTML-binding escape hatch.

## Engineering Tradeoffs

### Usability versus strict validation

Early, field-specific feedback helps a member correct an instruction. Strict server rules protect the contract. The two should use consistent language and meaning, but the server must reject invalid input even when that creates another correction round trip.

### Frontend convenience versus backend authority

Duplicating small rules costs maintenance, yet relying only on the browser leaves the API unprotected. Share the contract conceptually and test both implementations. Treat the browser's result as convenient guidance and the API's result as the decision.

### Detailed diagnostics versus safe member messaging

Developers need enough diagnostic detail in controlled operational tooling, while members need a clear next action. Those are different audiences. Public responses should identify correctable fields without stack traces, file paths, SQL, exception types, or other internals. Generic unexpected-error copy is less diagnostic in the interface but minimizes disclosure and remains actionable.

## Exercise

Add a deterministic **maximum daily transfer limit** validation rule. Define one fixed synthetic limit, enforce it in both the React review validation and the PHP API, return the same member-facing correction in the structured response, and add frontend and backend tests. Consider how the API stays authoritative if a caller bypasses the form. Do not connect to a ledger, database, or real limit service.
