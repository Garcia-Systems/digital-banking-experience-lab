import { Link, useParams } from "react-router-dom";
import AccountHeader from "./AccountHeader";
import BalanceSummary from "./BalanceSummary";
import ProjectionStatus from "./ProjectionStatus";
import { dashboardPropType } from "../propTypes/bankingPropTypes";

export default function AccountDetails({ dashboard }) {
  const { accountId } = useParams();
  const account = dashboard.accounts.find(({ id }) => id === accountId);

  if (!account) {
    return (
      <main id="main-content" className="route-page">
        <h1>Account not found.</h1>
        <p>We could not find that account.</p>
        <Link to="/">Return to dashboard</Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="route-page">
      <p className="eyebrow">Account details</p>
      <h1>{account.displayName}</h1>
      <section
        className="account-card account-detail"
        aria-label={`${account.displayName} details`}
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
      </section>
      <ProjectionStatus projection={dashboard.projection} />
      <section
        className="activity-placeholder"
        aria-labelledby="activity-title"
      >
        <h2 id="activity-title">Recent activity</h2>
        <p>No recent activity is shown in this fictional example.</p>
        <p>
          This account page will become the home for transaction history in
          later chapters.
        </p>
      </section>
    </main>
  );
}

AccountDetails.propTypes = { dashboard: dashboardPropType.isRequired };
