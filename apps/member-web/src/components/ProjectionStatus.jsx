import { formatTimestamp } from "../utils/formatters";
import { projectionPropType } from "../propTypes/bankingPropTypes";

export default function ProjectionStatus({ projection }) {
  return (
    <section
      className={`projection-status ${projection.isStale ? "is-stale" : ""}`}
      aria-labelledby="projection-title"
    >
      <div>
        <h2 id="projection-title">Account snapshot</h2>
        <p>
          Last updated{" "}
          <time dateTime={projection.generatedAt}>
            {formatTimestamp(projection.generatedAt)}
          </time>
        </p>
      </div>
      {projection.isStale && (
        <p className="stale-warning" role="status">
          <strong>Balances may be out of date.</strong> This account snapshot
          could not be refreshed.
        </p>
      )}
    </section>
  );
}

ProjectionStatus.propTypes = {
  projection: projectionPropType.isRequired,
};
