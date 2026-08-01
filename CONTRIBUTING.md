# Contributing

Thank you for helping keep the Digital Banking Experience Laboratory clear, deterministic, and useful to learners.

## Before contributing

- Read the [security boundaries](docs/security-boundaries.md).
- Use only fictional data and laboratory credentials.
- Keep scenarios deterministic and preserve their educational intent.
- Open an issue before proposing a new feature or a substantial change to the curriculum.

## Development workflow

1. Install JavaScript dependencies with `npm ci`.
2. Install API dependencies with `composer install --working-dir=services/banking-api`.
3. Make a focused change and update the relevant lesson or test when behavior changes.
4. Run `npm run verify` and `composer test --working-dir=services/banking-api`.
5. Submit a pull request that explains the learner-facing reason for the change.

Use clear commit messages, avoid real financial data, and keep generated build output out of commits. By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
