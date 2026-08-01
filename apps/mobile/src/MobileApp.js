import { useCallback, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AccountDashboardScreen from "./screens/AccountDashboardScreen";
import AccountDetailScreen from "./screens/AccountDetailScreen";
import TransactionHistoryScreen from "./screens/TransactionHistoryScreen";
import TransferPreparationScreen from "./screens/TransferPreparationScreen";

export default function MobileApp() {
  const [route, setRoute] = useState("dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [account, setAccount] = useState(null);
  const rememberDashboard = useCallback((value) => setDashboard(value), []);
  const selectAccount = (value) => {
    setAccount(value);
    setRoute("account");
  };

  return (
    <SafeAreaProvider>
      {route === "dashboard" && (
        <AccountDashboardScreen
          onDashboardLoaded={rememberDashboard}
          onPrepareTransfer={() => setRoute("transfer")}
          onSelectAccount={selectAccount}
        />
      )}
      {route === "account" && account && (
        <AccountDetailScreen
          account={account}
          onBack={() => setRoute("dashboard")}
          onHistory={() => setRoute("history")}
        />
      )}
      {route === "history" && account && (
        <TransactionHistoryScreen
          account={account}
          projection={dashboard.projection}
          onBack={() => setRoute("account")}
        />
      )}
      {route === "transfer" && dashboard && (
        <TransferPreparationScreen
          accounts={dashboard.accounts}
          onBack={() => setRoute("dashboard")}
        />
      )}
    </SafeAreaProvider>
  );
}
