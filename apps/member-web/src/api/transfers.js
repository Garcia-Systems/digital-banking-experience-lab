const allowedTransferScenarios = new Set([
  "accepted",
  "completed",
  "rejected",
  "unavailable",
]);

export function selectTransferScenario(search) {
  const requested = new URLSearchParams(search).get("transferScenario");
  return allowedTransferScenarios.has(requested) ? requested : undefined;
}

export function buildTransferEndpoint(scenario) {
  if (!scenario || !allowedTransferScenarios.has(scenario)) {
    return "/api/transfers";
  }

  const params = new URLSearchParams({ scenario });
  return `/api/transfers?${params.toString()}`;
}

export function submitTransfer(payload, { scenario } = {}) {
  return fetch(buildTransferEndpoint(scenario), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
