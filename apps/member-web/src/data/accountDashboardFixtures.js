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
      status: "open",
      displayName: "Everyday Checking",
      nickname: "Daily Spending",
      ownership: "individual",
      interestBearing: false,
      accountSuffix: "4821",
      availableBalanceCents: 125000,
      currentBalanceCents: 130500,
      transactions: [],
    },
    {
      id: "account-2002",
      type: "savings",
      status: "dormant",
      displayName: "Member Savings",
      nickname: "Vacation Savings",
      ownership: "joint",
      interestBearing: true,
      accountSuffix: "7314",
      availableBalanceCents: 420000,
      currentBalanceCents: 420000,
      transactions: [],
    },
  ],
};

export const freshAccountDashboard = accountDashboardFixture;

export const emptyAccountDashboard = {
  ...accountDashboardFixture,
  accounts: [],
};

export const staleAccountDashboard = {
  ...accountDashboardFixture,
  projection: {
    generatedAt: "2026-07-31T10:15:00Z",
    isStale: true,
  },
};

export const individualCheckingDashboard = {
  ...accountDashboardFixture,
  accounts: [accountDashboardFixture.accounts[0]],
};

export const jointSavingsDashboard = {
  ...accountDashboardFixture,
  accounts: [accountDashboardFixture.accounts[1]],
};
