export const accountDashboardFixture = {
  member: {
    id: "member-1001",
    displayName: "Alex Morgan",
  },
  projection: {
    generatedAt: "2026-07-31T12:00:00Z",
    isStale: false,
  },
  accounts: [
    {
      id: "account-2001",
      type: "checking",
      displayName: "Everyday Checking",
      accountSuffix: "4821",
      availableBalanceCents: 125000,
      currentBalanceCents: 130500,
    },
    {
      id: "account-2002",
      type: "savings",
      displayName: "Member Savings",
      accountSuffix: "7314",
      availableBalanceCents: 420000,
      currentBalanceCents: 420000,
    },
  ],
};

export const freshAccountDashboard = accountDashboardFixture;

export const staleAccountDashboard = {
  ...accountDashboardFixture,
  projection: {
    generatedAt: "2026-07-31T10:15:00Z",
    isStale: true,
  },
};
