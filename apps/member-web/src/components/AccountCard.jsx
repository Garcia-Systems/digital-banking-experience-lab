import { formatCents } from "../utils/formatters";

export default function AccountCard({ account }) {
  return (
    <article className="account-card">
      <div className="account-heading">
        <div>
          <p className="account-type">{account.type}</p>
          <h3>{account.displayName}</h3>
        </div>
        <p
          className="account-suffix"
          aria-label={`Account ending in ${account.accountSuffix}`}
        >
          •••• {account.accountSuffix}
        </p>
      </div>
      <dl className="balances">
        <div className="primary-balance">
          <dt>Available balance</dt>
          <dd>{formatCents(account.availableBalanceCents)}</dd>
        </div>
        <div>
          <dt>Current balance</dt>
          <dd>{formatCents(account.currentBalanceCents)}</dd>
        </div>
      </dl>
    </article>
  );
}
