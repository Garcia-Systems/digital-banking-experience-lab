import { Link } from "react-router-dom";
import { transfers } from "../data/operationsFixtures.js";
import { useOperationsResource } from "../api/operations.js";

const dollars = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
export default function Transfers() {
  const { data } = useOperationsResource("transfers", { transfers });
  return (
    <>
      <header>
        <p className="eyebrow">Review queue</p>
        <h2>Transfers</h2>
        <p>Read-only visibility into deterministic transfer activity.</p>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Transfer ID</th>
              <th>Member</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {data.transfers.map((transfer) => (
              <tr key={transfer.transferId}>
                <td>
                  <Link to={`/transfers/${transfer.transferId}`}>
                    {transfer.transferId}
                  </Link>
                </td>
                <td>{transfer.member}</td>
                <td>{dollars(transfer.amountCents)}</td>
                <td>
                  <span className="status">{transfer.status}</span>
                </td>
                <td>{transfer.submittedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
