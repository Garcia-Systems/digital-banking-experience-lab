import { NavLink, Outlet } from "react-router-dom";

export default function MemberLayout() {
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
          <NavLink to="/transfers/new">Transfer Money</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </header>
      <Outlet />
      <footer>
        <p>Educational demonstration • Fictional data only</p>
      </footer>
    </>
  );
}
