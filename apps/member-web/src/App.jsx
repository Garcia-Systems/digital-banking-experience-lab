import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AccountDashboard from "./components/AccountDashboard";
import AccountDetails from "./components/AccountDetails";
import Login from "./components/Login";
import MemberLayout from "./components/MemberLayout";
import MemberVerification from "./components/MemberVerification";
import NotFound from "./components/NotFound";
import Settings from "./components/Settings";
import TransferDetails from "./components/TransferDetails";
import TransferForm from "./components/TransferForm";
import { fetchDashboard } from "./api/dashboard";

const initialRequest = { status: "idle", dashboard: null, error: null };
const expiredMessage = "Your session has expired. Please sign in again.";

function Status({ children, error = false }) {
  return (
    <p
      className={`request-state${error ? " request-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
Status.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.bool,
};

function ProtectedApplication({ session, onLogout, onUnauthorized }) {
  const [request, setRequest] = useState(initialRequest);
  const location = useLocation();

  const loadDashboard = useCallback(() => {
    let active = true;
    setRequest({ status: "loading", dashboard: null, error: null });
    fetchDashboard(onUnauthorized)
      .then((dashboard) => {
        if (active) setRequest({ status: "success", dashboard, error: null });
      })
      .catch((error) => {
        if (active && error.message !== "unauthorized")
          setRequest({ status: "error", dashboard: null, error });
      });
    return () => {
      active = false;
    };
  }, [onUnauthorized]);

  useEffect(() => loadDashboard(), [loadDashboard]);

  const dashboardElement =
    request.status === "success" ? (
      <AccountDashboard dashboard={request.dashboard} />
    ) : request.status === "error" ? (
      <main id="main-content" className="route-page">
        <h1>Dashboard temporarily unavailable</h1>
        <Status error>
          We could not load your account information. No balances are shown
          because they may be incomplete.
        </Status>
        <button
          className="primary-action"
          type="button"
          onClick={loadDashboard}
        >
          Retry dashboard
        </button>
      </main>
    ) : (
      <main id="main-content" className="route-page">
        <Status>Loading account information…</Status>
      </main>
    );

  const accountsElement = (Component) =>
    request.status === "success" ? (
      <Component
        dashboard={request.dashboard}
        accounts={request.dashboard.accounts}
      />
    ) : (
      dashboardElement
    );

  return (
    <Routes location={location}>
      <Route element={<MemberLayout session={session} onLogout={onLogout} />}>
        <Route index element={dashboardElement} />
        <Route
          path="accounts/:accountId"
          element={accountsElement(AccountDetails)}
        />
        <Route path="settings" element={<Settings />} />
        <Route path="verification" element={<MemberVerification />} />
        <Route path="transfers/new" element={accountsElement(TransferForm)} />
        <Route path="transfers/:transferId" element={<TransferDetails />} />
        <Route path="not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
ProtectedApplication.propTypes = {
  session: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  onUnauthorized: PropTypes.func.isRequired,
};

export default function App() {
  const [auth, setAuth] = useState({
    status: "loading",
    session: null,
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    fetch("/api/session")
      .then(async (response) => ({ response, payload: await response.json() }))
      .then(({ response, payload }) => {
        if (!active) return;
        if (response.ok && payload.authenticated)
          setAuth({ status: "authenticated", session: payload, message: "" });
        else setAuth({ status: "anonymous", session: null, message: "" });
      })
      .catch(() => {
        if (active)
          setAuth({
            status: "anonymous",
            session: null,
            message: "Sign in to continue.",
          });
      });
    return () => {
      active = false;
    };
  }, []);

  const unauthorized = useCallback(() => {
    setAuth({ status: "anonymous", session: null, message: expiredMessage });
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setAuth({
      status: "anonymous",
      session: null,
      message: "You have signed out.",
    });
    navigate("/login", { replace: true });
  };

  if (auth.status === "loading") return <Status>Checking your session…</Status>;
  if (auth.status === "anonymous") {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              message={auth.message}
              onLogin={(session) => {
                setAuth({ status: "authenticated", session, message: "" });
                navigate("/", { replace: true });
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <ProtectedApplication
      session={auth.session}
      onLogout={logout}
      onUnauthorized={unauthorized}
    />
  );
}
