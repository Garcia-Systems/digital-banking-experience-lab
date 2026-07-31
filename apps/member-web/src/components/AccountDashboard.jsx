import AccountList from "./AccountList";
import ProjectionStatus from "./ProjectionStatus";
import { dashboardPropType } from "../propTypes/bankingPropTypes";
import { Link } from "react-router-dom";

export default function AccountDashboard({ dashboard }) {
  return (
    <>
      <main id="main-content">
        <section className="welcome" aria-labelledby="page-title">
          <p className="eyebrow">Member dashboard</p>
          <h1 id="page-title">
            Good afternoon, {dashboard.member.displayName}
          </h1>
          <p>A clear view of your fictional Harbor accounts.</p>
          <Link className="primary-link" to="/transfers/new">
            Transfer Money
          </Link>
        </section>
        <ProjectionStatus projection={dashboard.projection} />
        <section className="accounts" aria-labelledby="accounts-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your money</p>
              <h2 id="accounts-title">Deposit accounts</h2>
            </div>
            <p>{dashboard.accounts.length} accounts</p>
          </div>
          <AccountList accounts={dashboard.accounts} />
        </section>
      </main>
    </>
  );
}

AccountDashboard.propTypes = {
  dashboard: dashboardPropType.isRequired,
};
