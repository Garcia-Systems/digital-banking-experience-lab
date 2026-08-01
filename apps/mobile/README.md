# Harbor mobile laboratory

This Expo workspace implements one read-only Harbor Community Credit Union account dashboard. It uses native primitives and includes no navigation, authentication, transfers, device features, or production builds.

## Run it

Start the PHP API, then run from the repository root:

```bash
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000 npm run mobile:start
```

`127.0.0.1` works only when the Expo runtime can reach the API on the development machine. A physical device or Expo Go normally needs the computer's network-accessible address, such as `http://<development-host>:8000`; never commit a developer-specific address. Android emulator networking may require its host alias, while the iOS simulator commonly shares the Mac host network.

Choose an allowlisted deterministic response before starting Expo:

```bash
EXPO_PUBLIC_DASHBOARD_SCENARIO=stale EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000 npm run mobile:start
```

Valid scenarios are `success`, `empty`, `stale`, `error`, and `partial`. The partial HTTP-200 response deliberately fails contract validation and displays the safe unavailable state.

## Validate it

```bash
npm run test --workspace @dbel/mobile
npm run lint --workspace @dbel/mobile
npm run mobile:validate
```

`mobile:validate` checks the public Expo configuration; it does not build a signed or native production binary. Tests mock the request boundary and require neither a running API nor an emulator. The API URL is public configuration, not a credential.

## Safe areas

Phones can reserve screen space for notches, status bars, and home indicators. The built-in React Native `SafeAreaView` is deprecated, so the application creates one `SafeAreaProvider` near its root and uses `SafeAreaView` from `react-native-safe-area-context` for each full-screen request state. Insets come from the device rather than hardcoded production padding; component tests supply deterministic example metrics.
