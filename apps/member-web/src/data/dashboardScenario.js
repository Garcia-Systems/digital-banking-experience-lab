const allowedScenarios = new Set([
  "success",
  "empty",
  "stale",
  "error",
  "partial",
]);

export function dashboardScenario(search = window.location.search) {
  const requested = new URLSearchParams(search).get("scenario") ?? "success";
  return allowedScenarios.has(requested) ? requested : "success";
}
