import { Link } from "react-router-dom";
import { verifications } from "../data/operationsFixtures.js";
import { useOperationsResource } from "../api/operations.js";

export default function Verifications() {
  const { data } = useOperationsResource("verifications", { verifications });
  return (
    <>
      <header>
        <p className="eyebrow">Identity workflow</p>
        <h2>Verification Requests</h2>
        <p>
          Deterministic, read-only requests shared across the employee workflow.
        </p>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Member</th>
              <th>Current status</th>
              <th>Last attempt</th>
              <th>Retry eligibility</th>
            </tr>
          </thead>
          <tbody>
            {data.verifications.map((record) => (
              <tr key={record.verificationId}>
                <td>
                  <Link
                    to={`/operations/verifications/${record.verificationId}`}
                  >
                    {record.verificationId}
                  </Link>
                </td>
                <td>{record.member}</td>
                <td>
                  <span className="status">{record.status}</span>
                </td>
                <td>{record.lastAttemptAt}</td>
                <td>{record.retryEligible ? "Eligible" : "Not eligible"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
