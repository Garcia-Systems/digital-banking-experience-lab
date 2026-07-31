import PropTypes from "prop-types";
import { formatMaskedSuffix } from "../utils/formatters";

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export default function AccountHeader({
  type,
  status,
  displayName,
  accountSuffix,
}) {
  return (
    <header className="account-heading">
      <div>
        <p className="account-type-badge">{capitalize(type)}</p>
        <h3>{displayName}</h3>
        <p className={`account-status account-status--${status}`}>
          Status: <strong>{capitalize(status)}</strong>
        </p>
      </div>
      <p
        className="account-suffix"
        aria-label={`Account ending in ${accountSuffix}`}
      >
        {formatMaskedSuffix(accountSuffix)}
      </p>
    </header>
  );
}

AccountHeader.propTypes = {
  type: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["open", "dormant", "restricted"]).isRequired,
  displayName: PropTypes.string.isRequired,
  accountSuffix: PropTypes.string.isRequired,
};
