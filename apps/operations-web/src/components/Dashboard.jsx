import { dashboard } from "../data/operationsFixtures.js";
import { useOperationsResource } from "../api/operations.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data, error } = useOperationsResource("dashboard", dashboard);
  return (
    <>
      <header>
        <p className="eyebrow">Operational overview</p>
        <h2>Good morning, Operations</h2>
        <p>Deterministic activity across Harbor Community Credit Union.</p>
      </header>
      <section className="cards" aria-label="Operations metrics">
        {data.metrics.map((metric) => (
          <article className="card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>
      <section className="panel">
        <h3>Continue an employee workflow</h3>
        <div className="quick-links">
          <Link to="/operations/members">Members</Link>
          <Link to="/operations/transfers">Transfers</Link>
          <Link to="/operations/failures">Failed Operations</Link>
          <Link to="/operations/verifications">Verification Requests</Link>
        </div>
      </section>
      <section className="panel">
        <h3>Operational awareness</h3>
        <p>All educational services are responding normally.</p>
        <small>Snapshot: {data.generatedAt}</small>
        {error && (
          <p role="alert">
            Live API unavailable; showing the deterministic educational
            snapshot.
          </p>
        )}
      </section>
    </>
  );
}
