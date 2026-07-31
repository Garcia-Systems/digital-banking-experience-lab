# Chapter 10: Idempotent Transfer Submission

The review screen now submits one fictional account-to-account transfer to the PHP API. This chapter is an educational model: its process-local fixture is intentionally not durable production storage.

## Banking concept

A transfer represents **one financial intention**, even when software sends more than one request. Duplicate transfers can arise from a double-click, a browser refresh that repeats a form POST, an automatic retry, or network uncertainty in which the member never sees the first response. Treating every request as a new instruction could move money twice.

An idempotency key names the intention. The first accepted request records a deterministic transfer and confirmation. A later request with exactly the same key receives that original result rather than creating another transfer. Acceptance means the API recorded the request; it does not mean settlement has occurred.

## React concept

React submits the reviewed form asynchronously with `fetch`. Request state moves from idle to submitting, success, or error. During the request, the disabled Submit control reads `Submitting transfer...`. This optimistic interface transition gives immediate feedback and prevents ordinary double-clicks.

The review owns a stable idempotency key. Repeated submission of that unchanged review reuses its key. Editing the amount, source, destination, or memo clears the review; the next valid review creates a new key for the new intention.

## API concept

`POST /api/transfers` accepts source and destination accounts, an amount in cents, a memo, and an idempotency key. POST expresses creation of a transfer request. The API validates the instruction, stores the first result in a process-local structure, and returns deterministic identifiers and a fixture timestamp. A repeat returns the same transfer and confirmation with `duplicate: true`.

The in-memory store only models idempotency. It resets when the PHP process restarts and is not shared across servers. A production implementation requires durable, atomic storage, but persistence is deliberately deferred in this laboratory.

## Duplicate-click experiment

1. Prepare and review one transfer.
2. Click **Submit transfer** once; observe the disabled submitting state.
3. Try clicking it repeatedly.
4. Observe one confirmation and the explanation that repeated requests reuse one intention key.

The browser safeguard normally sends one request. Even if a retry reaches the API, the backend returns the original confirmation, so only one logical transfer exists.

## Relationship to the Digital Banking Systems Laboratory

The separate Digital Banking Systems Laboratory modeled idempotency inside distributed workflows. This experience laboratory shows how member-facing software participates in the same reliability strategy: frontend and backend cooperate so one member intention becomes one logical transfer. The repositories share engineering concepts, not code.

## Comparison with traditional PHP

A traditional server-rendered PHP form may be posted again when a member refreshes a confirmation page. Redirect-after-POST improves the interaction, but it cannot resolve every retry or uncertain network outcome. A server-checked idempotency key protects the intention even when the POST is repeated.

## Comparison with AngularJS

AngularJS applications commonly attached asynchronous work to a controller and used scope flags to disable a button. React expresses the same concerns through component state and event handlers. In either framework, a disabled control improves the interface but the API must still enforce idempotency.

## Engineering tradeoffs

- **Disabling buttons** gives clear feedback and blocks routine double-clicks, but cannot stop refreshes, scripts, or network retries.
- **Optimistic interfaces** respond immediately, but must represent pending work honestly rather than claiming settlement.
- **Frontend safeguards** preserve and send the key for one reviewed intention.
- **Backend idempotency** is authoritative because only the API can decide whether a request already created a logical transfer.
- Frontend protection alone is insufficient: requests can be duplicated after leaving the browser.

## Exercise

Add a deterministic network timeout after the API accepts a request but before React receives its response. Retry with the same key and observe why idempotency still matters. Do not add settlement or persistence while completing the exercise.
