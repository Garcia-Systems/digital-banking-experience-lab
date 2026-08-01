import { Link, useParams } from "react-router-dom";
import { useOperationsResource } from "../api/operations.js";
import { failures } from "../data/operationsFixtures.js";

export default function FailureDetails() {
  const { failureId } = useParams();
  const fallback = failures.find((item) => item.operationId === failureId);
  const { data, error } = useOperationsResource(
    `failures/${failureId}`,
    fallback,
  );
  const failure = data?.failure ?? data;
  if (!failure || error)
    return (
      <>
        <h2>Failed operation not found</h2>
        <Link to="/operations/failures">Return to failed operations</Link>
      </>
    );
  return (
    <>
      <p className="eyebrow">Failure details</p>
      <h2>{failure.operationId}</h2>
      <p className={`decision ${failure.retryable ? "eligible" : "manual"}`}>
        {failure.retryable ? "Retry Eligible" : "Manual Review Required"}
      </p>
      <div className="panel">
        <dl>
          <dt>Member</dt>
          <dd>{failure.member}</dd>
          <dt>Request summary</dt>
          <dd>{failure.requestSummary}</dd>
          <dt>Failure category</dt>
          <dd>
            {failure.failureCategory} — {failure.categoryExplanation}
          </dd>
          <dt>Retryable</dt>
          <dd>{failure.retryable ? "Yes" : "No"}</dd>
          <dt>Operator notes</dt>
          <dd>{failure.operatorNotes}</dd>
        </dl>
      </div>
      <section className="panel">
        <h3>Audit timeline</h3>
        <ol className="timeline">
          {failure.auditTimeline.map((entry) => (
            <li key={`${entry.at}-${entry.event}`}>
              <time>{entry.at}</time>
              <span>{entry.event}</span>
            </li>
          ))}
        </ol>
      </section>
      <Link to="/operations/failures">Return to failed operations</Link>
    </>
  );
}
