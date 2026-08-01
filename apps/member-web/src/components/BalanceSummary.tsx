import { formatCents } from "../utils/formatters";
interface BalanceSummaryProps {
  availableBalanceCents: number;
  currentBalanceCents: number;
}
export default function BalanceSummary({
  availableBalanceCents,
  currentBalanceCents,
}: BalanceSummaryProps) {
  return (
    <dl className="balances">
      <div className="primary-balance">
        <dt>Available balance</dt>
        <dd>{formatCents(availableBalanceCents)}</dd>
      </div>
      <div>
        <dt>Current balance</dt>
        <dd>{formatCents(currentBalanceCents)}</dd>
      </div>
    </dl>
  );
}
