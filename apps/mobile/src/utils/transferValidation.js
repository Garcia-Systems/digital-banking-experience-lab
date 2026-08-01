export function validateTransfer({ sourceId, destinationId, amount, memo }) {
  const errors = {};
  if (!sourceId) errors.sourceId = "Choose a source account.";
  if (!destinationId) errors.destinationId = "Choose a destination account.";
  if (sourceId && sourceId === destinationId)
    errors.destinationId = "Choose a different destination account.";
  if (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0)
    errors.amount =
      "Enter a positive amount with no more than two decimal places.";
  if (memo.length > 80) errors.memo = "Memo must be 80 characters or fewer.";
  return errors;
}
