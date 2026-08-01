import { SafeAreaProvider } from "react-native-safe-area-context";
import AccountDashboardScreen from "./screens/AccountDashboardScreen";

export default function MobileApp() {
  return (
    <SafeAreaProvider>
      <AccountDashboardScreen />
    </SafeAreaProvider>
  );
}
