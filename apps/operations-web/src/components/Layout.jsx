import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="shell">
      <aside>
        <p className="eyebrow">Harbor Community</p>
        <h1>Operations Portal</h1>
        <p className="role">Signed in as Operations User</p>
        <nav aria-label="Operations">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/members">Members</NavLink>
          <NavLink to="/transfers">Transfers</NavLink>
        </nav>
        <p className="notice">
          Educational access model: authorization is intentionally simplified.
        </p>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
