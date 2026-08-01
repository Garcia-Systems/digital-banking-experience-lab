import { Link, useParams } from "react-router-dom";
import { verifications } from "../data/operationsFixtures.js";
import { useOperationsResource } from "../api/operations.js";

export default function VerificationDetails() {
  const { verificationId } = useParams();
  const fallback = verifications.find(
    (record) => record.verificationId === verificationId,
  );
  const { data, error } = useOperationsResource(
    `verifications/${verificationId}`,
    fallback,
  );
  const verification = data?.verification ?? data;
  if (!verification || error)
    return (
      <>
        <h2>Verification request not found</h2>
        <Link to="/operations/verifications">
          Return to verification requests
        </Link>
      </>
    );
  return (
    <>
      <p className="eyebrow">Verification request</p>
      <h2>{verification.verificationId}</h2>
      <div className="panel">
        <dl>
          <dt>Member</dt>
          <dd>
            <Link to={`/operations/members/${verification.memberId}`}>
              {verification.member}
            </Link>
          </dd>
          <dt>Current status</dt>
          <dd>{verification.status}</dd>
          <dt>Last attempt</dt>
          <dd>{verification.lastAttemptAt}</dd>
          <dt>Retry eligibility</dt>
          <dd>{verification.retryEligible ? "Eligible" : "Not eligible"}</dd>
          <dt>Operational context</dt>
          <dd>{verification.summary}</dd>
          <dt>Related failed operation</dt>
          <dd>
            {verification.failureId ? (
              <Link to={`/operations/failures/${verification.failureId}`}>
                {verification.failureId}
              </Link>
            ) : (
              "None"
            )}
          </dd>
        </dl>
      </div>
      <Link to="/operations/verifications">
        Return to verification requests
      </Link>
    </>
  );
}
