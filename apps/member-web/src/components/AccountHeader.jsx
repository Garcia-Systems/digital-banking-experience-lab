import { accountPropType } from "../propTypes/bankingPropTypes";

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export default function AccountHeader({ account }) {
  return (
    <header className="account-heading">
      <div>
        <p className="account-type-badge">{capitalize(account.type)}</p>
        <h3>{account.displayName}</h3>
        <p className={`account-status account-status--${account.status}`}>
          Status: <strong>{capitalize(account.status)}</strong>
        </p>
      </div>
      <p
        className="account-suffix"
        aria-label={`Account ending in ${account.accountSuffix}`}
      >
        •••• {account.accountSuffix}
      </p>
    </header>
  );
}

AccountHeader.propTypes = {
  account: accountPropType.isRequired,
};
