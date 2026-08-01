export interface Account {
  id: string;
  type: string;
  status: string;
  displayName: string;
  nickname?: string;
  ownership: "individual" | "joint";
  accountSuffix: string;
  interestBearing: boolean;
  availableBalanceCents: number;
  currentBalanceCents: number;
  transactions: unknown[];
}
export interface DashboardProjection {
  generatedAt: string;
  isStale: boolean;
  reason?: string;
}
export type TransferSummary =
  | { id: string; status: "accepted" | "completed"; amountCents: number }
  | {
      id: string;
      status: "rejected";
      amountCents: number;
      failureReason: string;
    };
export interface Dashboard {
  member: { id: string; displayName: string };
  projection: DashboardProjection;
  accounts: Account[];
}
