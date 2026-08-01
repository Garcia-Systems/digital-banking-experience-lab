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
    displayName: "Alex Morgan",
    verificationStatus: "verified",
    accountCount: 2,
    email: "alex.morgan@example.test",
    phone: "(555) 010-1001",
    accounts: [
      {
        name: "Everyday Checking",
        maskedNumber: "•••• 4821",
        balanceCents: 130500,
      },
      {
        name: "Member Savings",
        maskedNumber: "•••• 7314",
        balanceCents: 420000,
      },
    ],
  },
  {
    memberId: "member-1002",
    displayName: "Jordan Lee",
    verificationStatus: "pending",
    accountCount: 1,
    email: "jordan.lee@example.test",
    phone: "(555) 010-1002",
    accounts: [
      {
        name: "Everyday Checking",
        maskedNumber: "•••• 2281",
        balanceCents: 132420,
      },
    ],
  },
  {
    memberId: "member-1003",
    displayName: "Sam Rivera",
    verificationStatus: "review required",
    accountCount: 3,
    email: "sam.rivera@example.test",
    phone: "(555) 010-1003",
    accounts: [
      {
        name: "Everyday Checking",
        maskedNumber: "•••• 9034",
        balanceCents: 51890,
      },
    ],
  },
];

export const transfers = [
  {
    transferId: "transfer-7001",
    member: "Alex Morgan",
    amountCents: 12500,
    status: "completed",
    submittedAt: "2026-08-01T08:15:00Z",
    memberId: "member-1001",
    verificationStatus: "verified",
    failureId: null,
  },
  {
    transferId: "transfer-7002",
    member: "Jordan Lee",
    amountCents: 4800,
    status: "accepted",
    submittedAt: "2026-08-01T08:32:00Z",
    memberId: "member-1002",
    verificationStatus: "pending",
    failureId: null,
  },
  {
    transferId: "transfer-7003",
    member: "Sam Rivera",
    amountCents: 22100,
    status: "rejected",
    submittedAt: "2026-08-01T08:47:00Z",
    memberId: "member-1003",
    verificationStatus: "review required",
    failureId: "failure-9002",
  },
];

export const verifications = [
  {
    verificationId: "verification-5001",
    memberId: "member-1002",
    member: "Jordan Lee",
    status: "pending",
    lastAttemptAt: "2026-08-01T08:41:00Z",
    retryEligible: true,
    failureId: "failure-9001",
    summary: "Identity evidence is awaiting a deterministic vendor retry.",
  },
  {
    verificationId: "verification-5002",
    memberId: "member-1003",
    member: "Sam Rivera",
    status: "review required",
    lastAttemptAt: "2026-08-01T08:52:00Z",
    retryEligible: false,
    failureId: null,
    summary:
      "An employee may review the shared context; no action is available.",
  },
];

export const failures = [
  {
    operationId: "failure-9001",
    operationType: "Member verification",
    member: "Jordan Lee (member-1002)",
    status: "failed",
    retryable: true,
    failureCategory: "Vendor Timeout",
    categoryExplanation:
      "The verification vendor did not respond within the expected window.",
    lastAttemptedAt: "2026-08-01T08:41:00Z",
    requestSummary:
      "Confirm identity details for a pending membership verification.",
    operatorNotes:
      "No member action is needed while operations reviews vendor availability.",
    auditTimeline: [
      { at: "2026-08-01T08:40:00Z", event: "Verification request received" },
      { at: "2026-08-01T08:41:00Z", event: "Vendor timeout recorded" },
    ],
  },
  {
    operationId: "failure-9002",
    operationType: "External transfer",
    member: "Sam Rivera (member-1003)",
    status: "failed",
    retryable: false,
    failureCategory: "Permanent Validation Failure",
    categoryExplanation:
      "The request did not satisfy the vendor's permanent validation rules.",
    lastAttemptedAt: "2026-08-01T08:52:00Z",
    requestSummary: "Submit a $221.00 external transfer for validation.",
    operatorNotes:
      "Review the request with the member before any future submission.",
    auditTimeline: [
      { at: "2026-08-01T08:51:00Z", event: "Transfer validation requested" },
      { at: "2026-08-01T08:52:00Z", event: "Permanent failure classified" },
    ],
  },
  {
    operationId: "failure-9003",
    operationType: "Member verification",
    member: "Alex Morgan (member-1001)",
    status: "failed",
    retryable: true,
    failureCategory: "Authentication Expired",
    categoryExplanation:
      "The vendor credential expired before the operation completed.",
    lastAttemptedAt: "2026-08-01T08:58:00Z",
    requestSummary: "Refresh verification evidence for an existing member.",
    operatorNotes:
      "Eligible for a controlled retry after credentials are refreshed.",
    auditTimeline: [
      { at: "2026-08-01T08:57:00Z", event: "Verification refresh requested" },
      { at: "2026-08-01T08:58:00Z", event: "Expired authentication recorded" },
    ],
  },
];
