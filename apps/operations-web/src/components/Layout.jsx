import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="shell">
      <aside>
        <p className="eyebrow">Harbor Community</p>
        <h1>Operations Portal</h1>
        <p className="role">Signed in as Operations User</p>
        <nav aria-label="Operations">
          <NavLink to="/operations" end>
            Home
          </NavLink>
          <NavLink to="/operations/members">Members</NavLink>
          <NavLink to="/operations/transfers">Transfers</NavLink>
          <NavLink to="/operations/failures">Failed Operations</NavLink>
          <NavLink to="/operations/verifications">
            Verification Requests
          </NavLink>
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
