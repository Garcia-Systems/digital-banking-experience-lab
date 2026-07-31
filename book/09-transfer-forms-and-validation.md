# Chapter 9: Transfer Forms and Validation

The first workflow in the laboratory lets a member prepare a fictional transfer between two Harbor Community Credit Union accounts. It deliberately stops at review: no request is sent, no balance changes, and no transfer is stored. That boundary lets us concentrate on input, feedback, and banking rules before Chapter 10 introduces submission.

## Banking concept: validate before sending

A transfer instruction combines a **source account**, a **destination account**, an **amount**, and sometimes a **memo**. Catching an omitted account, a self-transfer, or an impossible amount before a network request gives the member fast and specific feedback. The available-balance warning also prevents an obviously unsuccessful fictional instruction from reaching review.

These browser checks are **convenience validation**, not authority. The account projection can become stale after it reaches the browser, browser code can be changed or bypassed, and another transaction can alter available funds. A real backend must independently validate identity, authorization, account eligibility, amount precision, available funds, limits, and every other business rule against authoritative data. Client validation improves the conversation; it never establishes that a transfer is valid or secure.

## React concept: controlled inputs and local state

Each form control is controlled by React: its `value` comes from component state, and its `onChange` handler writes the next value to that state. The selects and memo hold plain strings. The amount uses `null` for an empty field and a number for entered dollars. Currency formatting happens only when account balances and the review amount are presented; formatted strings are not business data.

Local state is appropriate because the unfinished instruction belongs only to this screen. No global store or form library is needed. One state object holds field values, another holds validation messages, and a successful snapshot supplies the review. Editing any value clears the old review so the summary cannot silently disagree with the form.

Submitting the form currently means “attempt review.” The submit handler prevents browser navigation, passes the values and fictional accounts to a validation function, and conditionally renders the review only when that function returns no errors. Keeping validation outside the markup separates banking rules from display and makes the boundary easier to reason about.

The checks cover:

- required source and destination accounts;
- different source and destination accounts;
- a required amount that is positive and greater than zero;
- an amount no larger than the selected source's fictional available balance; and
- a memo of at most 100 characters.

The form uses `noValidate` so the lesson's messages are consistent, but it still uses semantic labels, inputs, selects, and a submit button. Invalid controls expose `aria-invalid` and reference their message with `aria-describedby`. The alert summary announces an unsuccessful review attempt. Native controls and normal document order preserve keyboard operation.

## Comparison with PHP

A traditional server-rendered PHP form posts raw fields to a route. PHP validates them, stores errors and old input in a session or response model, and renders another HTML page. That is an excellent authoritative boundary and works without client JavaScript, but each correction commonly involves a request and a new response.

This React form continuously owns the displayed values and can respond immediately. Its review is a conditional subtree rather than a newly rendered document. That responsiveness does not replace PHP validation. When submission is added, React will remain responsible for convenient feedback while PHP repeats all relevant rules using current server-side information.

## Comparison with AngularJS

AngularJS commonly used `ng-model` for two-way binding: the framework updated a scope property from the control and updated the control from that property. Built-in form controllers also accumulated states such as `$dirty`, `$invalid`, and `$error`.

React makes both directions explicit. `value={values.memo}` renders state and `onChange` chooses how the event becomes new state. More code is visible, but transformation and ownership are unambiguous. The numeric amount conversion, review reset, and field-error reset happen at a deliberately named boundary rather than through implicit two-way synchronization.

## Engineering tradeoffs

**Client validation** reduces avoidable requests, provides immediate feedback, and can keep the member focused on one field. It can also drift from backend rules, operate on stale data, and be bypassed. Duplicated rules therefore need clear ownership and contract tests as a workflow grows.

**Server validation** is the security and integrity boundary. It uses authoritative records and must distrust every request. Network latency makes it less pleasant as the only source of feedback, and server failures must still be translated into useful accessible messages.

A good experience uses both: the browser explains predictable corrections early, then the server makes the actual decision. Security must never depend on disabled buttons, hidden controls, JavaScript state, or an available balance shown in the interface. Chapter 9 intentionally has no API `POST`; “Ready for submission” only describes the completeness of this fictional draft.

## Exercise: recurring transfer intent

Add a controlled checkbox labeled **Make this a recurring transfer**. Display a short educational note when it is selected and include “Recurring: Yes” or “Recurring: No” in the review summary.

Do not schedule, submit, or persist a recurring transfer. Do not add frequency or end-date behavior. The exercise is only about controlling a checkbox and conditionally presenting its fictional value.
