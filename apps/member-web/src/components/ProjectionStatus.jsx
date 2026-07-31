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
      {projection.isStale ? (
        <p className="freshness-message stale-warning" role="status">
          <strong>Account information may be out of date.</strong> This account
          snapshot could not be refreshed and is based on stale projection data.
        </p>
      ) : (
        <p className="freshness-message" role="status">
          <strong>Projection is current.</strong> This dashboard is based on the
          latest available projection data.
        </p>
      )}
    </section>
  );
}

ProjectionStatus.propTypes = {
  projection: projectionPropType.isRequired,
};
