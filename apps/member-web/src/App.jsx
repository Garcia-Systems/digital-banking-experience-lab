import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AccountDashboard from "./components/AccountDashboard";
import { dashboardScenario } from "./data/dashboardScenario";
import { validateDashboard } from "./data/validateDashboard";
import { Route, Routes } from "react-router-dom";
import MemberLayout from "./components/MemberLayout";
import AccountDetails from "./components/AccountDetails";
import Settings from "./components/Settings";
import NotFound from "./components/NotFound";
import TransferForm from "./components/TransferForm";
import TransferDetails from "./components/TransferDetails";

const initialRequest = { status: "idle", dashboard: null, error: null };

function DashboardLoading() {
  return (
    <p className="request-state" role="status">
      Loading account information…
    </p>
  );
}

function DashboardError({ onRetry }) {
  return (
    <section className="request-state request-error" role="alert">
      <p>We could not load your account information.</p>
      <button type="button" onClick={onRetry}>
        Try again
      </button>
    </section>
  );
}

DashboardError.propTypes = { onRetry: PropTypes.func.isRequired };

export default function App() {
  const [request, setRequest] = useState(initialRequest);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setRequest({ status: "loading", dashboard: null, error: null });
    const scenario = dashboardScenario();

    fetch(`/api/dashboard?scenario=${scenario}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Dashboard request failed");
        }

        return response.json();
      })
      .then((payload) => {
        const result = validateDashboard(payload);
        if (!result.valid) throw new Error(result.reason);
        if (active)
          setRequest({
            status: "success",
            dashboard: result.dashboard,
            error: null,
          });
      })
      .catch((error) => {
        if (active) setRequest({ status: "error", dashboard: null, error });
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  if (request.status === "idle" || request.status === "loading") {
    return <DashboardLoading />;
  }

  if (request.status === "error") {
    return <DashboardError onRetry={() => setAttempt((value) => value + 1)} />;
  }

  return (
    <Routes>
      <Route element={<MemberLayout />}>
        <Route
          index
          element={<AccountDashboard dashboard={request.dashboard} />}
        />
        <Route
          path="accounts/:accountId"
          element={<AccountDetails dashboard={request.dashboard} />}
        />
        <Route path="settings" element={<Settings />} />
        <Route
          path="transfers/new"
          element={<TransferForm accounts={request.dashboard.accounts} />}
        />
        <Route path="transfers/:transferId" element={<TransferDetails />} />
        <Route path="not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
