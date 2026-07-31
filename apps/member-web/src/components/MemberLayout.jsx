import { NavLink, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

export default function MemberLayout({ session, onLogout }) {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#main-content">
          <span className="brand-mark" aria-hidden="true">
            H
          </span>
          <span>Harbor Community Credit Union</span>
        </a>
        <nav aria-label="Member navigation">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/transfers/new">Transfers</NavLink>
          <NavLink to="/verification">Verification</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <button className="nav-button" type="button" onClick={onLogout}>
            Logout
          </button>
        </nav>
        <p className="signed-in-member">Signed in as {session.displayName}</p>
      </header>
      <Outlet />
      <footer>
        <p>Educational demonstration • Fictional data only</p>
      </footer>
    </>
  );
}

MemberLayout.propTypes = {
  session: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
};
