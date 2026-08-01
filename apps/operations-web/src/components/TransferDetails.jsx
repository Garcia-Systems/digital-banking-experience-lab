import { Link, useParams } from "react-router-dom";
import { transfers } from "../data/operationsFixtures.js";

export default function TransferDetails() {
  const { transferId } = useParams();
  const transfer = transfers.find((item) => item.transferId === transferId);
  if (!transfer)
    return (
      <>
        <h2>Transfer not found</h2>
        <Link to="/transfers">Return to transfers</Link>
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
          <dt>Submitted</dt>
          <dd>{transfer.submittedAt}</dd>
        </dl>
      </div>
      <Link to="/transfers">Return to transfers</Link>
    </>
  );
}
