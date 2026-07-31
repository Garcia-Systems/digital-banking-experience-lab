import AccountDashboard from "./components/AccountDashboard";
import { selectDashboardFixture } from "./data/selectDashboardFixture";

export default function App() {
  return (
    <AccountDashboard
      dashboard={selectDashboardFixture(window.location.search)}
    />
  );
}
