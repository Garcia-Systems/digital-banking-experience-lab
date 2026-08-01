import { dashboardScenario } from "../data/dashboardScenario";
import { validateDashboard } from "../data/validateDashboard";
import type { Dashboard } from "../types/banking";

export async function fetchDashboard(
  onUnauthorized: () => void,
): Promise<Dashboard> {
  const response = await fetch(
    `/api/dashboard?scenario=${dashboardScenario()}`,
  );
  if (response.status === 401) {
    onUnauthorized();
    throw new Error("unauthorized");
  }
  if (!response.ok) throw new Error("Dashboard request failed");
  const payload: unknown = await response.json();
  const result = validateDashboard(payload);
  if (!result.valid) throw new Error(result.reason);
  // Runtime validation establishes the boundary before this compile-time type applies.
  return result.dashboard as Dashboard;
}
