import {
  emptyAccountDashboard,
  freshAccountDashboard,
  staleAccountDashboard,
} from "./accountDashboardFixtures";

export function selectDashboardFixture(search) {
  const scenario = new URLSearchParams(search).get("scenario");

  if (scenario === "empty-accounts") {
    return emptyAccountDashboard;
  }

  return scenario === "stale" ? staleAccountDashboard : freshAccountDashboard;
}
