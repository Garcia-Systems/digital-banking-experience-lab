<?php

return [
    'member' => [
        'id' => 'member-1001',
        'displayName' => 'Alex Morgan',
    ],
    'projection' => [
        'generatedAt' => '2026-07-31T12:00:00Z',
        'isStale' => false,
    ],
    'accounts' => [
        [
            'id' => 'account-2001',
            'type' => 'checking',
            'status' => 'open',
            'displayName' => 'Everyday Checking',
            'nickname' => 'Daily Spending',
            'ownership' => 'individual',
            'interestBearing' => false,
            'accountSuffix' => '4821',
            'availableBalanceCents' => 125000,
            'currentBalanceCents' => 130500,
            'transactions' => [
                [
                    'description' => 'Harbor Market',
                    'amountCents' => -7452,
                    'type' => 'card purchase',
                    'postedAt' => '2026-07-30',
                ],
                [
                    'description' => 'Payroll deposit',
                    'amountCents' => 185000,
                    'type' => 'deposit',
                    'postedAt' => '2026-07-28',
                ],
            ],
        ],
        [
            'id' => 'account-2002',
            'type' => 'savings',
            'status' => 'dormant',
            'displayName' => 'Member Savings',
            'nickname' => 'Vacation Savings',
            'ownership' => 'joint',
            'interestBearing' => true,
            'accountSuffix' => '7314',
            'availableBalanceCents' => 420000,
            'currentBalanceCents' => 420000,
            'transactions' => [
                [
                    'description' => 'Monthly savings transfer',
                    'amountCents' => 25000,
                    'type' => 'transfer',
                    'postedAt' => '2026-07-25',
                ],
            ],
        ],
    ],
];
