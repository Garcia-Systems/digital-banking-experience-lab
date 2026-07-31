import { formatCents } from "../utils/formatters";
import { accountPropType } from "../propTypes/bankingPropTypes";

export default function AccountCard({ account }) {
  const accountTypeLabel = `${account.type.charAt(0).toUpperCase()}${account.type.slice(1)}`;
  const accountStatusLabel = `${account.status.charAt(0).toUpperCase()}${account.status.slice(1)}`;

  return (
    <article className="account-card">
      <div className="account-heading">
        <div>
          <p className="account-type-badge">{accountTypeLabel}</p>
          <h3>{account.displayName}</h3>
          <p className={`account-status account-status--${account.status}`}>
            Status: <strong>{accountStatusLabel}</strong>
          </p>
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
      <section
        className="recent-activity"
        aria-labelledby={`activity-${account.id}`}
      >
        <h4 id={`activity-${account.id}`}>Recent activity</h4>
        {account.transactions.length > 0 ? (
          <ul>
            {account.transactions.map((transaction) => (
              <li key={transaction.id}>{transaction.description}</li>
            ))}
          </ul>
        ) : (
          <p>No recent transactions.</p>
        )}
      </section>
    </article>
  );
}

AccountCard.propTypes = {
  account: accountPropType.isRequired,
};
