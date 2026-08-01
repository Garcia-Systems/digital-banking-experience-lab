import { validateDashboard } from "../utils/validateDashboard";
import { apiRequest } from "./client";

export const DASHBOARD_SCENARIOS = [
  "success",
  "empty",
  "stale",
  "error",
  "partial",
];

export function dashboardScenario(
  value = process.env.EXPO_PUBLIC_DASHBOARD_SCENARIO,
) {
  return DASHBOARD_SCENARIOS.includes(value) ? value : "success";
}

export async function fetchDashboard({
  baseUrl,
  scenario = dashboardScenario(),
  signal,
} = {}) {
  const safeScenario = dashboardScenario(scenario);
  const response = await apiRequest(
    `/api/dashboard?scenario=${encodeURIComponent(safeScenario)}`,
    { baseUrl, signal },
  );

  const result = validateDashboard(await response.json());
  if (!result.valid) throw new Error("invalid_dashboard_contract");
  return result.dashboard;
}
