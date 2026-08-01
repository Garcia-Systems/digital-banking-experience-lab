import { Link } from "react-router-dom";
import { useOperationsResource } from "../api/operations.js";
import { failures } from "../data/operationsFixtures.js";

export default function Failures() {
  const { data } = useOperationsResource("failures", { failures });
  return (
    <>
      <header>
        <p className="eyebrow">Investigation queue</p>
        <h2>Failed Operations</h2>
        <p>
          Read-only operational context without member-facing or implementation
          details.
        </p>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Operation ID</th>
              <th>Type</th>
              <th>Member</th>
              <th>Status</th>
              <th>Retryable</th>
              <th>Failure category</th>
              <th>Last attempted</th>
            </tr>
          </thead>
          <tbody>
            {data.failures.map((failure) => (
              <tr key={failure.operationId}>
                <td>
                  <Link to={`/failures/${failure.operationId}`}>
                    {failure.operationId}
                  </Link>
                </td>
                <td>{failure.operationType}</td>
                <td>{failure.member}</td>
                <td>
                  <span className="status">{failure.status}</span>
                </td>
                <td>{failure.retryable ? "Yes" : "No"}</td>
                <td>
                  <strong>{failure.failureCategory}</strong>
                  <small className="explanation">
                    {failure.categoryExplanation}
                  </small>
                </td>
                <td>{failure.lastAttemptedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
