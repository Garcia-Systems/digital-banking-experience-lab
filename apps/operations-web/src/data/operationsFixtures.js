export const dashboard = {
  generatedAt: "2026-08-01T09:00:00Z",
  metrics: [
    { label: "Members", value: 3 },
    { label: "Transfers", value: 3 },
    { label: "Verification Requests", value: 2 },
    { label: "System Health", value: "Operational" },
  ],
};

export const members = [
  {
    memberId: "member-1001",
    displayName: "Avery Morgan",
    verificationStatus: "verified",
    accountCount: 2,
  },
  {
    memberId: "member-1002",
    displayName: "Jordan Lee",
    verificationStatus: "pending",
    accountCount: 1,
  },
  {
    memberId: "member-1003",
    displayName: "Sam Rivera",
    verificationStatus: "review required",
    accountCount: 3,
  },
];

export const transfers = [
  {
    transferId: "transfer-7001",
    member: "Avery Morgan",
    amountCents: 12500,
    status: "completed",
    submittedAt: "2026-08-01T08:15:00Z",
  },
  {
    transferId: "transfer-7002",
    member: "Jordan Lee",
    amountCents: 4800,
    status: "accepted",
    submittedAt: "2026-08-01T08:32:00Z",
  },
  {
    transferId: "transfer-7003",
    member: "Sam Rivera",
    amountCents: 22100,
    status: "rejected",
    submittedAt: "2026-08-01T08:47:00Z",
  },
];
