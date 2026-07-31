import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatCents } from "../utils/formatters";

const statusNotes = {
  accepted:
    "Your transfer request has been accepted and is awaiting processing.",
  completed: "Your transfer has completed successfully.",
  rejected: "This transfer could not be completed.",
};

export default function TransferDetails() {
  const { transferId } = useParams();
  const [request, setRequest] = useState({ status: "loading", transfer: null });

  useEffect(() => {
    let active = true;
    setRequest({ status: "loading", transfer: null });
    fetch(`/api/transfers/${encodeURIComponent(transferId)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Transfer not found");
        return response.json();
      })
      .then((transfer) => {
        if (active) setRequest({ status: "success", transfer });
      })
      .catch(() => {
        if (active) setRequest({ status: "error", transfer: null });
      });
    return () => {
      active = false;
    };
  }, [transferId]);

  if (request.status === "loading") {
    return <p role="status">Loading transfer details…</p>;
  }

  if (request.status === "error") {
    return (
      <main id="main-content" className="route-page transfer-page">
        <h1>Transfer not found.</h1>
        <p>We could not find that transfer. It may no longer be available.</p>
        <Link to="/">Return to dashboard</Link>
      </main>
    );
  }

  const transfer = request.transfer;
  return (
    <main id="main-content" className="route-page transfer-page">
      <p className="eyebrow">Transfer confirmation</p>
      <h1>Transfer details</h1>
      <section
        className="transfer-confirmation"
        aria-label="Transfer confirmation"
      >
        <div className={`status-badge status-${transfer.status}`}>
          Status: <strong>{transfer.status}</strong>
        </div>
        <p className="status-note">{statusNotes[transfer.status]}</p>
        <dl>
          <div>
            <dt>Confirmation number</dt>
            <dd>{transfer.confirmationNumber}</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>{formatCents(transfer.amountCents)}</dd>
          </div>
          <div>
            <dt>Source account</dt>
            <dd>{transfer.sourceAccount}</dd>
          </div>
          <div>
            <dt>Destination account</dt>
            <dd>{transfer.destinationAccount}</dd>
          </div>
          <div>
            <dt>Memo</dt>
            <dd>{transfer.memo || "No memo"}</dd>
          </div>
          <div>
            <dt>Submitted</dt>
            <dd>{transfer.submittedAt}</dd>
          </div>
        </dl>
      </section>
      <nav className="confirmation-actions" aria-label="Transfer actions">
        <Link to="/">Return to dashboard</Link>
        <Link to="/transfers/new">Make another transfer</Link>
      </nav>
    </main>
  );
}
