import PropTypes from "prop-types";
import { formatCents } from "../utils/formatters";

export default function BalanceSummary({
  availableBalanceCents,
  currentBalanceCents,
}) {
  return (
    <dl className="balances">
      <div className="primary-balance">
        <dt>Available balance</dt>
        <dd>{formatCents(availableBalanceCents)}</dd>
      </div>
      <div>
        <dt>Current balance</dt>
        <dd>{formatCents(currentBalanceCents)}</dd>
      </div>
    </dl>
  );
}

BalanceSummary.propTypes = {
  availableBalanceCents: PropTypes.number.isRequired,
  currentBalanceCents: PropTypes.number.isRequired,
};
