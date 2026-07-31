import AccountList from "./AccountList";
import ProjectionStatus from "./ProjectionStatus";
import { dashboardPropType } from "../propTypes/bankingPropTypes";

export default function AccountDashboard({ dashboard }) {
  return (
    <>
      <header className="site-header">
        <a
          className="brand"
          href="#main-content"
          aria-label="Harbor Community Credit Union, skip to accounts"
        >
          <span className="brand-mark" aria-hidden="true">
            H
          </span>
          <span>Harbor Community Credit Union</span>
        </a>
      </header>
      <main id="main-content">
        <section className="welcome" aria-labelledby="page-title">
          <p className="eyebrow">Member dashboard</p>
          <h1 id="page-title">
            Good afternoon, {dashboard.member.displayName}
          </h1>
          <p>A clear view of your fictional Harbor accounts.</p>
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
      <footer>
        <p>Educational demonstration • Fictional data only</p>
      </footer>
    </>
  );
}

AccountDashboard.propTypes = {
  dashboard: dashboardPropType.isRequired,
};
