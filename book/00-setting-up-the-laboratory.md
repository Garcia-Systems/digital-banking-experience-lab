# 00: Setting up the laboratory

## Learning objectives

- Install the locked JavaScript and PHP dependencies.
- Start the Banking API, Member Web, Operations Portal, and Mobile Laboratory.
- Distinguish synthetic laboratory data from production banking data.
- Run the repository's complete validation suite.

## Banking concept

**Laboratory boundaries.** A banking laboratory must make its trust boundary explicit. Harbor Community Credit Union, its members, balances, and outcomes are synthetic; the applications demonstrate experience design, not a ledger or compliance claim.

## Frontend concept

**Workspace orchestration.** npm workspaces provide one root entry point for the three clients, while Composer manages the independent Banking API. Vite proxies browser `/api` requests; Expo uses an explicit network-reachable base URL.

## Implementation

`package.json`, `.npmrc`, `services/banking-api/composer.json`, and the application manifests define the toolchain. `README.md` is the complete setup reference; `docs/security-boundaries.md` defines safe use.

## Run the laboratory

From the repository root unless the command changes directory:

```bash
npm run verify
```

## What to observe

All client checks complete; `composer test` completes separately. With services running, Member Web appears on port 5173, Operations Portal on 5174, and Expo displays the Mobile Laboratory sign-in screen.

## Engineering tradeoffs

Locked installs make builds reproducible but require deliberate lockfile updates. Keeping the PHP service separate preserves its runtime boundary at the cost of a second install and test command.

## Automated tests

The root command runs all client suites. `services/banking-api/tests/Feature/EndToEndLaboratoryTest.php` checks the integrated API journey.

## Exercise

Run each application from a fresh clone, then record which process owns each port and which client-to-API transport it uses.

The exercise reinforces this chapter's boundary and prepares the next step in the completed Harbor journey.
