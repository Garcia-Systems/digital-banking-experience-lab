# Harbor mobile laboratory

This Expo workspace presents the fictional Harbor Community Credit Union member experience with laboratory authentication, account and transaction views, and transfer preparation. It consumes the same deterministic Banking API contract as the web clients; it does not submit transfers or create a production native build.

## Run it

Start the PHP API, then run from the repository root:

```bash
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000 npm run mobile:start
```

Sign in with `member-1001` / `password`. A physical device or Expo Go normally needs the development computer's network-accessible address instead of `127.0.0.1`; never commit a developer-specific address.

Set `EXPO_PUBLIC_DASHBOARD_SCENARIO` to `success`, `empty`, `stale`, `error`, or `partial` to select a deterministic response. The malformed `partial` response demonstrates safe contract-validation failure.

## Validate it

```bash
npm run test --workspace @dbel/mobile
npm run lint --workspace @dbel/mobile
npm run mobile:validate
```

`mobile:validate` checks public Expo configuration; it does not build a signed native binary. Tests require neither a running API nor an emulator. The API URL and scenario are public configuration, not credentials.
