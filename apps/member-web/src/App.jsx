import { useEffect, useState } from "react";
import AccountDashboard from "./components/AccountDashboard";

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Dashboard request failed");
        }

        return response.json();
      })
      .then(setDashboard)
      .catch(() => setHasError(true));
  }, []);

  if (hasError) {
    return <p role="alert">Unable to load dashboard.</p>;
  }

  if (!dashboard) {
    return <p role="status">Loading dashboard...</p>;
  }

  return <AccountDashboard dashboard={dashboard} />;
}
