# Chapter 11: Transfer Status and Confirmation

Submitting a fictional Harbor Community Credit Union transfer now leads to `/transfers/:transferId`. That confirmation page fetches the transfer resource and presents its status without pretending that acceptance is completion.

## Banking concept

A transfer moves conceptually through **Draft → Submitted → Accepted → Completed**, with **Rejected** as an alternate outcome. Draft describes an instruction still being prepared. Submitted means the member sent it. Accepted means the institution recorded and initially validated the request—not that funds have reached their final destination.

After acceptance, authorization rules may still determine whether the requested movement is permitted. Downstream processing may coordinate internal systems, and settlement makes the financial result final between the relevant records or institutions. A later check can therefore complete or reject an accepted request. These are conceptual distinctions; this laboratory does not implement a ledger or external settlement.

The confirmation page communicates each fixture outcome explicitly:

- **Accepted:** the request awaits processing;
- **Completed:** the transfer completed successfully;
- **Rejected:** the transfer could not be completed.

The badge includes the status word, so meaning never depends on color alone.

## React concept

The route `/transfers/:transferId` contains a route parameter. `useParams` reads that identifier, and an effect fetches `/api/transfers/{transferId}`. The component conditionally renders loading, success, and friendly not-found states. Within success, a status-to-message mapping selects the educational explanation.

After POST succeeds, `useNavigate` moves to the resource route returned by the API. Refreshing asks for the current resource once again. Polling would ask repeatedly on a timer; this chapter discusses that distinction but intentionally implements neither automatic polling nor background processing.

## API concept

`POST /api/transfers` creates a transfer request and returns its identifier. `GET /api/transfers/{transferId}` subsequently fetches that individual resource, including its confirmation number, accounts, amount, memo, status, and submission time. Resource identifiers let a client navigate, bookmark, or refresh a specific result without repeating the creation request.

The teaching store assigns one of three deterministic states rather than processing asynchronously. Open `/transfers/new?transferScenario=accepted`, `completed`, or `rejected` to choose the frontend experiment. Direct API clients can POST to `/api/transfers?scenario=completed` (or another supported value). Omitting the scenario selects `accepted`. These switches simulate workflow transitions; they are not production controls.

## Relationship to the Digital Banking Systems Laboratory

Earlier projection lessons showed that an interface reads a view of backend facts. Workflow transitions change those facts: submitted becomes accepted, and accepted may become completed or rejected. The separate Digital Banking Systems Laboratory models backend state changes and transition rules. This project shows how those states appear to members as a projection, explanation, and next action. The laboratories share concepts, not code.

## Comparison with traditional PHP

A traditional PHP application commonly handles a POST and responds with a redirect to a server-rendered confirmation URL. Redirect-after-POST avoids resubmitting the form on refresh. This React application has the same resource-oriented shape, but client-side navigation changes routes without requesting a complete HTML document, and React fetches JSON for the new view.

## Comparison with AngularJS

AngularJS commonly declared a parameterized route, read an identifier through route services, and placed loading and status values on a controller scope. React Router supplies the parameter and navigation hooks here, while React state drives workflow presentation. Both approaches need explicit loading, missing-resource, and status branches.

## Engineering tradeoffs

- **Showing progress** builds confidence when labels clearly distinguish recorded work from finished work; vague success language can overpromise.
- **Deterministic simulations** make examples and tests repeatable, but cannot reproduce timing, races, or operational failure modes.
- **Eventual consistency** means a resource projection may lag a backend transition. A production experience might refresh or poll, but should disclose freshness and avoid inventing certainty.
- **User confidence** grows from a durable identifier, timestamp, plain-language status, and useful next actions—not from color or celebratory wording alone.
- **Refreshing versus polling:** member-initiated refresh makes a new request on demand; polling automatically makes repeated requests. Automatic polling is intentionally deferred.

## Exercise

Design a fictional **Scheduled** status. Decide where it belongs in the lifecycle, write its member-facing explanation, and add test cases you would expect. Do not implement it yet.
