import {
  freshAccountDashboard,
  staleAccountDashboard,
} from "./accountDashboardFixtures";

export function selectDashboardFixture(search) {
  const scenario = new URLSearchParams(search).get("scenario");
  return scenario === "stale" ? staleAccountDashboard : freshAccountDashboard;
}
