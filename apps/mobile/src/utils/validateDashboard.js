function validAccount(account) {
  return (
    account &&
    typeof account.id === "string" &&
    typeof account.displayName === "string" &&
    typeof account.type === "string" &&
    typeof account.status === "string" &&
    /^\d{4}$/.test(account.accountSuffix) &&
    Number.isInteger(account.availableBalanceCents) &&
    Number.isInteger(account.currentBalanceCents) &&
    Array.isArray(account.transactions) &&
    account.transactions.every(validTransaction)
  );
}

function validTransaction(transaction) {
  return Boolean(
    transaction &&
      typeof transaction.description === "string" &&
      Number.isInteger(transaction.amountCents) &&
      typeof transaction.type === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(transaction.postedAt) &&
      !Number.isNaN(Date.parse(`${transaction.postedAt}T00:00:00Z`)),
  );
}

export function validateDashboard(value) {
  const valid = Boolean(
    value &&
      value.member &&
      typeof value.member.displayName === "string" &&
      value.projection &&
      typeof value.projection.generatedAt === "string" &&
      !Number.isNaN(Date.parse(value.projection.generatedAt)) &&
      typeof value.projection.isStale === "boolean" &&
      Array.isArray(value.accounts) &&
      value.accounts.every(validAccount),
  );
  return valid ? { valid: true, dashboard: value } : { valid: false };
}
