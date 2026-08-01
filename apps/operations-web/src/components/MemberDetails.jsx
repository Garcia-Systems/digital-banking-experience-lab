import { Link, useParams } from "react-router-dom";
import { members, transfers, failures } from "../data/operationsFixtures.js";
import { useOperationsResource } from "../api/operations.js";

const dollars = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );

export default function MemberDetails() {
  const { memberId } = useParams();
  const member = members.find((record) => record.memberId === memberId);
  const fallback = member && {
    member,
    transfers: transfers.filter((record) => record.memberId === memberId),
    failures: failures.filter((record) => record.member.includes(memberId)),
  };
  const { data, error } = useOperationsResource(
    `members/${memberId}`,
    fallback,
  );
  if (!data || error)
    return (
      <>
        <h2>Member not found</h2>
        <Link to="/operations/members">Return to members</Link>
      </>
    );
  return (
    <>
      <header>
        <p className="eyebrow">Member support context</p>
        <h2>{data.member.displayName}</h2>
        <p>
          {data.member.memberId} · {data.member.email} · {data.member.phone}
        </p>
      </header>
      <div className="split">
        <section className="panel">
          <h3>Verification status</h3>
          <span className="status">{data.member.verificationStatus}</span>
        </section>
        <section className="panel">
          <h3>Fictional accounts</h3>
          {data.member.accounts.map((account) => (
            <p key={account.maskedNumber}>
              <strong>{account.name}</strong>
              <br />
              {account.maskedNumber} · {dollars(account.balanceCents)}
            </p>
          ))}
        </section>
      </div>
      <section className="panel">
        <h3>Recent transfers</h3>
        {data.transfers.length ? (
          data.transfers.map((transfer) => (
            <p key={transfer.transferId}>
              <Link to={`/operations/transfers/${transfer.transferId}`}>
                {transfer.transferId}
              </Link>{" "}
              · {dollars(transfer.amountCents)} · {transfer.status}
            </p>
          ))
        ) : (
          <p>No recent transfers.</p>
        )}
      </section>
      <section className="panel">
        <h3>Recent failed operations</h3>
        {data.failures.length ? (
          data.failures.map((failure) => (
            <p key={failure.operationId}>
              <Link to={`/operations/failures/${failure.operationId}`}>
                {failure.operationId}
              </Link>{" "}
              · {failure.failureCategory}
            </p>
          ))
        ) : (
          <p>No recent failed operations.</p>
        )}
      </section>
      <Link to="/operations/members">Return to members</Link>
    </>
  );
}
