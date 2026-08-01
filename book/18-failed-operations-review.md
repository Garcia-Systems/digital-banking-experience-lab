# Chapter 18: Failed Operations Review

This chapter adds a deterministic, read-only investigation queue to Harbor Community Credit Union's fictional employee portal. It deliberately stops before corrective action: an operator can understand a failure and its history, but cannot retry or edit it.

## Banking Concept

Financial institutions separate member-facing errors from operator-facing diagnostics because the two audiences need different information. A member needs a safe, useful next step without vendor details, security-sensitive internals, or confusing technical terminology. An authorized operator needs consistent workflow context: which operation failed, who was affected, whether the condition may be transient, and what the audit history records.

Operational review turns that context into a decision. A temporary service outage, vendor timeout, invalid vendor response, or expired authentication may be **retryable**, although eligibility is not permission to retry immediately. A permanent validation failure will not improve by repeating the same request and therefore requires manual review. Operators use the audit history to understand what was requested and classified, without receiving stack traces or internal implementation details.

## React Concept

The failed-operations table and detail route form a **master-detail layout**. The master view makes records comparable; selecting an operation ID navigates to `/failures/:failureId`, where `useParams` identifies the record. Conditional rendering maps the deterministic `retryable` boolean to either **Retry Eligible** or **Manual Review Required**. This keeps the underlying data explicit while giving the decision state visual prominence.

## API Concept

Operational endpoints are role-specific investigation contracts. `GET /api/operations/failures` returns the queue and `GET /api/operations/failures/{failureId}` returns one record, including operator notes and audit events. Both are read-only. A missing identifier returns a deterministic not-found response, and repeated reads return the same fictional data.

Read-only investigation is a useful boundary: a query cannot accidentally become a corrective command. A later workflow can define retry authorization, idempotency, and new audit events independently.

## Relationship to the Digital Banking Systems Laboratory

The Digital Banking Systems Laboratory models backend isolation around retries, dead-letter queues, and permanent failures. A retryable operation might be isolated for controlled reprocessing; a permanently invalid operation must not cycle forever; a dead-letter queue preserves work that requires investigation. This chapter models the employee interface used to inspect the results of those backend decisions. It does not simulate a queue or execute a retry.

## Comparison with Traditional PHP

A traditional PHP administrative dashboard might render the list and detail pages entirely on the server, often combining routing, data lookup, and HTML templates. This laboratory retains PHP as a deterministic JSON boundary and lets the independent React application own navigation and presentation. Either architecture can be valid; the important properties are authorization, safe disclosure, stable read models, and auditable corrective actions.

## Comparison with AngularJS

AngularJS applications commonly used route configuration plus `$routeParams` to create list and detail screens. React Router provides the same route-based detail idea through nested routes, links, and `useParams`, while normal component rendering handles the conditional badge. The master and detail views remain separate components with a shared fixture contract.

## Engineering Tradeoffs

Operators need enough information to distinguish transient conditions from permanent ones, but excess detail can expose credentials, infrastructure names, stack traces, or member-sensitive data. The model therefore uses operator-oriented summaries, category explanations, notes, and audit events rather than implementation diagnostics.

Read-only review is intentionally less convenient than an inline retry button. Corrective workflows need stronger authorization, idempotency protection, concurrency rules, confirmation, and a new audit trail. Separating investigation from correction makes that risk visible instead of hiding it behind a convenient control.

## Exercise

Add a deterministic **Escalated** failure category to your own copy. Decide on its operator-facing explanation, add a fictional record, and update the list and detail tests. Do not add retry execution or editing.
