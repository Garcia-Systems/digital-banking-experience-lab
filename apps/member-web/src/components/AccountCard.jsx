import { accountPropType } from "../propTypes/bankingPropTypes";
import AccountHeader from "./AccountHeader";
import BalanceSummary from "./BalanceSummary";
import RecentActivitySummary from "./RecentActivitySummary";

export default function AccountCard({ account }) {
  return (
    <article
      className="account-card"
      aria-label={`${account.displayName}, ${account.type} account`}
    >
      <AccountHeader account={account} />
      <BalanceSummary
        availableBalanceCents={account.availableBalanceCents}
        currentBalanceCents={account.currentBalanceCents}
      />
      <RecentActivitySummary
        accountName={account.displayName}
        transactions={account.transactions}
      />
    </article>
  );
}

AccountCard.propTypes = {
  account: accountPropType.isRequired,
};
