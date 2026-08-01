import { validateDashboard } from "../utils/validateDashboard";

export const DASHBOARD_SCENARIOS = [
  "success",
  "empty",
  "stale",
  "error",
  "partial",
];
const defaultBaseUrl = "http://127.0.0.1:8000";

export function dashboardScenario(
  value = process.env.EXPO_PUBLIC_DASHBOARD_SCENARIO,
) {
  return DASHBOARD_SCENARIOS.includes(value) ? value : "success";
}

export async function fetchDashboard({
  baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || defaultBaseUrl,
  scenario = dashboardScenario(),
  signal,
} = {}) {
  const safeScenario = dashboardScenario(scenario);
  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/api/dashboard?scenario=${encodeURIComponent(safeScenario)}`,
    { signal },
  );

  if (!response.ok) throw new Error("dashboard_unavailable");

  const result = validateDashboard(await response.json());
  if (!result.valid) throw new Error("invalid_dashboard_contract");
  return result.dashboard;
}
