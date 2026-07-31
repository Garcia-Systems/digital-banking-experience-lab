import {
  emptyAccountDashboard,
  freshAccountDashboard,
  individualCheckingDashboard,
  jointSavingsDashboard,
  staleAccountDashboard,
} from "./accountDashboardFixtures";

export function selectDashboardFixture(search) {
  const scenario = new URLSearchParams(search).get("scenario");

  if (scenario === "individual-checking") {
    return individualCheckingDashboard;
  }

  if (scenario === "joint-savings") {
    return jointSavingsDashboard;
  }

  if (scenario === "empty-accounts") {
    return emptyAccountDashboard;
  }

  return scenario === "stale" ? staleAccountDashboard : freshAccountDashboard;
}
