const isString = (value) => typeof value === "string";
const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

function isAccount(account) {
  return (
    account !== null &&
    typeof account === "object" &&
    [
      "id",
      "type",
      "status",
      "displayName",
      "nickname",
      "ownership",
      "accountSuffix",
    ].every((field) => isString(account[field])) &&
    typeof account.interestBearing === "boolean" &&
    isNumber(account.availableBalanceCents) &&
    isNumber(account.currentBalanceCents) &&
    Array.isArray(account.transactions)
  );
}

export function validateDashboard(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    value.member === null ||
    typeof value.member !== "object" ||
    !isString(value.member.id) ||
    !isString(value.member.displayName) ||
    value.projection === null ||
    typeof value.projection !== "object" ||
    !isString(value.projection.generatedAt) ||
    typeof value.projection.isStale !== "boolean" ||
    !Array.isArray(value.accounts) ||
    !value.accounts.every(isAccount)
  ) {
    return { valid: false, reason: "invalid_dashboard_contract" };
  }

  return { valid: true, dashboard: value };
}
