<?php

return [
    'dashboard' => [
        'generatedAt' => '2026-08-01T09:00:00Z',
        'metrics' => [
            ['label' => 'Members', 'value' => 3],
            ['label' => 'Transfers', 'value' => 3],
            ['label' => 'Verification Requests', 'value' => 2],
            ['label' => 'System Health', 'value' => 'Operational'],
        ],
    ],
    'members' => [
        ['memberId' => 'member-1001', 'displayName' => 'Avery Morgan', 'verificationStatus' => 'verified', 'accountCount' => 2],
        ['memberId' => 'member-1002', 'displayName' => 'Jordan Lee', 'verificationStatus' => 'pending', 'accountCount' => 1],
        ['memberId' => 'member-1003', 'displayName' => 'Sam Rivera', 'verificationStatus' => 'review required', 'accountCount' => 3],
    ],
    'transfers' => [
        ['transferId' => 'transfer-7001', 'member' => 'Avery Morgan', 'amountCents' => 12500, 'status' => 'completed', 'submittedAt' => '2026-08-01T08:15:00Z'],
        ['transferId' => 'transfer-7002', 'member' => 'Jordan Lee', 'amountCents' => 4800, 'status' => 'accepted', 'submittedAt' => '2026-08-01T08:32:00Z'],
        ['transferId' => 'transfer-7003', 'member' => 'Sam Rivera', 'amountCents' => 22100, 'status' => 'rejected', 'submittedAt' => '2026-08-01T08:47:00Z'],
    ],
    'failures' => [
        [
            'operationId' => 'failure-9001', 'operationType' => 'Member verification', 'member' => 'Jordan Lee (member-1002)',
            'status' => 'failed', 'retryable' => true, 'failureCategory' => 'Vendor Timeout',
            'categoryExplanation' => 'The verification vendor did not respond within the expected window.',
            'lastAttemptedAt' => '2026-08-01T08:41:00Z', 'requestSummary' => 'Confirm identity details for a pending membership verification.',
            'operatorNotes' => 'No member action is needed while operations reviews vendor availability.',
            'auditTimeline' => [
                ['at' => '2026-08-01T08:40:00Z', 'event' => 'Verification request received'],
                ['at' => '2026-08-01T08:41:00Z', 'event' => 'Vendor timeout recorded'],
            ],
        ],
        [
            'operationId' => 'failure-9002', 'operationType' => 'External transfer', 'member' => 'Sam Rivera (member-1003)',
            'status' => 'failed', 'retryable' => false, 'failureCategory' => 'Permanent Validation Failure',
            'categoryExplanation' => "The request did not satisfy the vendor's permanent validation rules.",
            'lastAttemptedAt' => '2026-08-01T08:52:00Z', 'requestSummary' => 'Submit a $221.00 external transfer for validation.',
            'operatorNotes' => 'Review the request with the member before any future submission.',
            'auditTimeline' => [
                ['at' => '2026-08-01T08:51:00Z', 'event' => 'Transfer validation requested'],
                ['at' => '2026-08-01T08:52:00Z', 'event' => 'Permanent failure classified'],
            ],
        ],
        [
            'operationId' => 'failure-9003', 'operationType' => 'Member verification', 'member' => 'Avery Morgan (member-1001)',
            'status' => 'failed', 'retryable' => true, 'failureCategory' => 'Authentication Expired',
            'categoryExplanation' => 'The vendor credential expired before the operation completed.',
            'lastAttemptedAt' => '2026-08-01T08:58:00Z', 'requestSummary' => 'Refresh verification evidence for an existing member.',
            'operatorNotes' => 'Eligible for a later controlled retry after credentials are refreshed.',
            'auditTimeline' => [
                ['at' => '2026-08-01T08:57:00Z', 'event' => 'Verification refresh requested'],
                ['at' => '2026-08-01T08:58:00Z', 'event' => 'Expired authentication recorded'],
            ],
        ],
    ],
];
