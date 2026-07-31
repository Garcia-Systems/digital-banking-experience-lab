const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const timestampFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

export function formatCents(cents) {
  return currencyFormatter.format(cents / 100);
}

export function formatTimestamp(timestamp) {
  return timestampFormatter.format(new Date(timestamp));
}
