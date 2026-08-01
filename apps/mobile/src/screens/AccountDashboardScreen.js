import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchDashboard } from "../api/dashboard";
import AccountCard from "../components/AccountCard";
import ProjectionStatus from "../components/ProjectionStatus";

export default function AccountDashboardScreen({
  loadDashboard = fetchDashboard,
  onSelectAccount,
  onPrepareTransfer,
  onDashboardLoaded,
}) {
  const [request, setRequest] = useState({
    status: "loading",
    dashboard: null,
  });
  const requestActive = useRef(false);

  const load = useCallback(async () => {
    if (requestActive.current) return;
    requestActive.current = true;
    setRequest((current) =>
      current.status === "loading"
        ? current
        : { status: "loading", dashboard: null },
    );
    try {
      const dashboard = await loadDashboard();
      setRequest({ status: "success", dashboard });
      onDashboardLoaded?.(dashboard);
    } catch {
      setRequest({ status: "error", dashboard: null });
    } finally {
      requestActive.current = false;
    }
  }, [loadDashboard, onDashboardLoaded]);

  useEffect(() => {
    load();
  }, [load]);

  if (request.status === "loading") {
    return (
      <SafeAreaView
        edges={["top", "right", "bottom", "left"]}
        style={styles.center}
        accessibilityLiveRegion="polite"
      >
        <ActivityIndicator
          accessibilityLabel="Loading account information"
          color="#0b665a"
          size="large"
        />
        <Text style={styles.loading}>Loading account information…</Text>
      </SafeAreaView>
    );
  }

  if (request.status === "error") {
    return (
      <SafeAreaView
        edges={["top", "right", "bottom", "left"]}
        style={styles.center}
      >
        <Text style={styles.errorTitle}>
          We could not load your account information.
        </Text>
        <Text style={styles.errorBody}>
          Your balances are unavailable. No account values have been estimated.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try Again"
          onPress={load}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { dashboard } = request;
  return (
    <SafeAreaView
      edges={["top", "right", "bottom", "left"]}
      style={styles.safeArea}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.institution}>Harbor Community Credit Union</Text>
        <Text style={styles.eyebrow}>Member dashboard</Text>
        <Text accessibilityRole="header" style={styles.greeting}>
          Good afternoon, {dashboard.member.displayName}
        </Text>
        <ProjectionStatus projection={dashboard.projection} />
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Your accounts
        </Text>
        {dashboard.accounts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No accounts are currently available.
            </Text>
          </View>
        ) : (
          dashboard.accounts.map((account) => (
            <AccountCard
              account={account}
              key={account.id}
              onPress={onSelectAccount}
            />
          ))
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => onPrepareTransfer?.(dashboard.accounts)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Prepare a transfer</Text>
        </Pressable>
        <Text style={styles.disclaimer}>
          Balances are API projections and are not an authoritative ledger.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f7f6" },
  content: { padding: 20, paddingBottom: 36 },
  center: {
    flex: 1,
    minHeight: 480,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
    backgroundColor: "#f3f7f6",
  },
  institution: { color: "#0b665a", fontWeight: "800", fontSize: 16 },
  eyebrow: {
    color: "#526966",
    marginTop: 28,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "700",
  },
  greeting: {
    color: "#102f2c",
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    marginTop: 6,
  },
  sectionTitle: {
    color: "#153b38",
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 12,
  },
  loading: { color: "#153b38", marginTop: 14, fontSize: 16 },
  errorTitle: {
    color: "#6b261d",
    fontSize: 22,
    lineHeight: 29,
    textAlign: "center",
    fontWeight: "800",
  },
  errorBody: {
    color: "#526966",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 21,
  },
  button: {
    minHeight: 48,
    minWidth: 132,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 24,
    backgroundColor: "#0b665a",
    paddingHorizontal: 20,
  },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "800" },
  empty: { backgroundColor: "#ffffff", padding: 22, borderRadius: 14 },
  emptyText: { color: "#153b38", fontSize: 16 },
  disclaimer: { color: "#526966", fontSize: 12, lineHeight: 18, marginTop: 8 },
});
