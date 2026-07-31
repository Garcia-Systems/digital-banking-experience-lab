import AccountDashboard from "./components/AccountDashboard";
import {
  freshAccountDashboard,
  staleAccountDashboard,
} from "./data/accountDashboardFixtures";

export function fixtureForSearch(search) {
  const scenario = new URLSearchParams(search).get("scenario");
  return scenario === "stale" ? staleAccountDashboard : freshAccountDashboard;
}

export default function App() {
  return (
    <AccountDashboard dashboard={fixtureForSearch(window.location.search)} />
  );
}
