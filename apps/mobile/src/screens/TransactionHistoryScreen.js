import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProjectionStatus from "../components/ProjectionStatus";
import ScreenHeader from "../components/ScreenHeader";
import TransactionRow from "../components/TransactionRow";

export default function TransactionHistoryScreen({
  account,
  projection,
  loadHistory,
  onBack,
}) {
  const [request, setRequest] = useState({ status: "loading", history: [] });

  useEffect(() => {
    let active = true;
    Promise.resolve(loadHistory ? loadHistory(account) : account.transactions)
      .then((history) => {
        if (active) setRequest({ status: "success", history });
      })
      .catch(() => {
        if (active) setRequest({ status: "error", history: [] });
      });
    return () => {
      active = false;
    };
  }, [account, loadHistory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Transaction history" onBack={onBack} />
        <Text style={styles.account}>
          {account.displayName} · •••• {account.accountSuffix}
        </Text>
        <ProjectionStatus projection={projection} />
        {request.status === "loading" && (
          <View style={styles.state}>
            <ActivityIndicator
              accessibilityLabel="Loading transaction history"
              color="#0b665a"
            />
            <Text style={styles.stateText}>Loading transaction history…</Text>
          </View>
        )}
        {request.status === "error" && (
          <Text style={styles.error}>
            We could not load transaction history.
          </Text>
        )}
        {request.status === "success" && request.history.length === 0 && (
          <Text style={styles.stateText}>
            No transactions are available for this account.
          </Text>
        )}
        {request.status === "success" &&
          request.history.map((transaction) => (
            <TransactionRow
              key={`${transaction.postedAt}-${transaction.description}`}
              transaction={transaction}
            />
          ))}
        <Text style={styles.readOnly}>
          Transaction history is read-only and reflects the latest API
          projection.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f7f6" },
  content: { padding: 20, paddingBottom: 36 },
  account: { color: "#526966", fontWeight: "700" },
  state: { paddingVertical: 30, alignItems: "center" },
  stateText: { color: "#526966", paddingVertical: 16 },
  error: { color: "#6b261d", fontWeight: "700", paddingVertical: 24 },
  readOnly: { color: "#526966", fontSize: 12, lineHeight: 18, marginTop: 20 },
});
