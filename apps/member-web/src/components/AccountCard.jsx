import { accountPropType } from "../propTypes/bankingPropTypes";
import AccountHeader from "./AccountHeader";
import AccountMetadata from "./AccountMetadata";
import BalanceSummary from "./BalanceSummary";
import CardControls from "./CardControls";
import RecentActivitySummary from "./RecentActivitySummary";

export default function AccountCard({ account }) {
  return (
    <article
      className="account-card"
      aria-label={`${account.displayName}, ${account.type} account`}
    >
      <AccountHeader
        type={account.type}
        status={account.status}
        displayName={account.displayName}
        accountSuffix={account.accountSuffix}
      />
      <BalanceSummary
        availableBalanceCents={account.availableBalanceCents}
        currentBalanceCents={account.currentBalanceCents}
      />
      <AccountMetadata
        nickname={account.nickname}
        ownership={account.ownership}
        interestBearing={account.interestBearing}
        transfersRestricted={account.status === "restricted"}
      />
      <CardControls accountName={account.displayName} />
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
