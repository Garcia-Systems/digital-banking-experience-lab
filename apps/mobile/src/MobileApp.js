import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  checkSession,
  clearLaboratorySessionToken,
  login,
  logout,
} from "./api/session";
import AccountDashboardScreen from "./screens/AccountDashboardScreen";
import AccountDetailScreen from "./screens/AccountDetailScreen";
import TransactionHistoryScreen from "./screens/TransactionHistoryScreen";
import TransferPreparationScreen from "./screens/TransferPreparationScreen";
import SignInScreen from "./screens/SignInScreen";

export default function MobileApp() {
  const [session, setSession] = useState({ status: "checking", message: "" });
  const [route, setRoute] = useState("dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [account, setAccount] = useState(null);
  const rememberDashboard = useCallback((value) => setDashboard(value), []);
  const selectAccount = (value) => {
    setAccount(value);
    setRoute("account");
  };

  const requireSignIn = useCallback((message = "") => {
    clearLaboratorySessionToken();
    setDashboard(null);
    setAccount(null);
    setRoute("dashboard");
    setSession({ status: "unauthenticated", message });
  }, []);

  useEffect(() => {
    let active = true;
    checkSession()
      .then((current) => {
        if (!active) return;
        setSession({
          status: current ? "authenticated" : "unauthenticated",
          message: "",
        });
      })
      .catch((error) => {
        if (!active) return;
        requireSignIn(
          error?.status === 401
            ? "Your session has expired. Please sign in again."
            : "Sign in to load your account information.",
        );
      });
    return () => {
      active = false;
    };
  }, [requireSignIn]);

  async function signIn(credentials) {
    await login(credentials);
    setSession({ status: "authenticated", message: "" });
  }

  async function signOut() {
    try {
      await logout();
    } finally {
      requireSignIn("You have signed out.");
    }
  }

  return (
    <SafeAreaProvider>
      {session.status === "checking" && (
        <View style={styles.checking}>
          <ActivityIndicator
            accessibilityLabel="Checking laboratory session"
            color="#0b665a"
          />
          <Text style={styles.checkingText}>Checking laboratory session…</Text>
        </View>
      )}
      {session.status === "unauthenticated" && (
        <SignInScreen message={session.message} onSignIn={signIn} />
      )}
      {session.status === "authenticated" && route === "dashboard" && (
        <AccountDashboardScreen
          onDashboardLoaded={rememberDashboard}
          onPrepareTransfer={() => setRoute("transfer")}
          onSelectAccount={selectAccount}
          onSessionExpired={() =>
            requireSignIn("Your session has expired. Please sign in again.")
          }
          onLogout={signOut}
        />
      )}
      {session.status === "authenticated" && route === "account" && account && (
        <AccountDetailScreen
          account={account}
          onBack={() => setRoute("dashboard")}
          onHistory={() => setRoute("history")}
        />
      )}
      {session.status === "authenticated" && route === "history" && account && (
        <TransactionHistoryScreen
          account={account}
          projection={dashboard.projection}
          onBack={() => setRoute("account")}
        />
      )}
      {session.status === "authenticated" &&
        route === "transfer" &&
        dashboard && (
          <TransferPreparationScreen
            accounts={dashboard.accounts}
            onBack={() => setRoute("dashboard")}
          />
        )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  checking: {
    alignItems: "center",
    backgroundColor: "#f3f7f6",
    flex: 1,
    justifyContent: "center",
  },
  checkingText: { color: "#153b38", marginTop: 12 },
});
