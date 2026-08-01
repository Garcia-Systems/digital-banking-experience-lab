import { Link, useParams } from "react-router-dom";
import { transfers } from "../data/operationsFixtures.js";
import { useOperationsResource } from "../api/operations.js";

const dollars = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );

export default function TransferDetails() {
  const { transferId } = useParams();
  const fallback = transfers.find((item) => item.transferId === transferId);
  const { data, error } = useOperationsResource(
    `transfers/${transferId}`,
    fallback,
  );
  const transfer = data?.transfer ?? data;
  if (!transfer || error)
    return (
      <>
        <h2>Transfer not found</h2>
        <Link to="/operations/transfers">Return to transfers</Link>
      </>
    );
  return (
    <>
      <p className="eyebrow">Transfer details</p>
      <h2>{transfer.transferId}</h2>
      <div className="panel">
        <dl>
          <dt>Member</dt>
          <dd>{transfer.member}</dd>
          <dt>Status</dt>
          <dd>{transfer.status}</dd>
          <dt>Amount</dt>
          <dd>{dollars(transfer.amountCents)}</dd>
          <dt>Submitted</dt>
          <dd>{transfer.submittedAt}</dd>
          <dt>Related verification</dt>
          <dd>{transfer.verificationStatus}</dd>
          <dt>Related failed operation</dt>
          <dd>
            {transfer.failureId ? (
              <Link to={`/operations/failures/${transfer.failureId}`}>
                {transfer.failureId}
              </Link>
            ) : (
              "None"
            )}
          </dd>
        </dl>
      </div>
      <Link to={`/operations/members/${transfer.memberId}`}>View member</Link>
      {" · "}
      <Link to="/operations/transfers">Return to transfers</Link>
    </>
  );
}
