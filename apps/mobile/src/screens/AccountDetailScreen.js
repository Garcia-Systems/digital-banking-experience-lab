import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import TransactionRow from "../components/TransactionRow";
import { formatCents } from "../utils/formatters";

export default function AccountDetailScreen({ account, onBack, onHistory }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Account details" onBack={onBack} />
        <Text style={styles.eyebrow}>{account.nickname}</Text>
        <Text style={styles.name}>{account.displayName}</Text>
        <Text style={styles.suffix}>
          Account ending in •••• {account.accountSuffix}
        </Text>
        <View style={styles.balances}>
          <Text style={styles.label}>Available balance</Text>
          <Text style={styles.available}>
            {formatCents(account.availableBalanceCents)}
          </Text>
          <Text style={styles.current}>
            Current balance {formatCents(account.currentBalanceCents)}
          </Text>
        </View>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Recent transactions
        </Text>
        {account.transactions.slice(0, 2).map((transaction) => (
          <TransactionRow
            key={`${transaction.postedAt}-${transaction.description}`}
            transaction={transaction}
          />
        ))}
        {account.transactions.length === 0 && (
          <Text style={styles.empty}>No recent transactions.</Text>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={onHistory}
          style={styles.button}
        >
          <Text style={styles.buttonText}>View transaction history</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f7f6" },
  content: { padding: 20, paddingBottom: 36 },
  eyebrow: { color: "#0b665a", fontWeight: "800", textTransform: "uppercase" },
  name: { color: "#153b38", fontSize: 22, fontWeight: "800", marginTop: 5 },
  suffix: { color: "#526966", marginTop: 5 },
  balances: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 22,
  },
  label: { color: "#526966" },
  available: {
    color: "#102f2c",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 4,
  },
  current: { color: "#526966", marginTop: 8 },
  sectionTitle: { color: "#153b38", fontSize: 20, fontWeight: "800" },
  empty: { color: "#526966", paddingVertical: 18 },
  button: {
    backgroundColor: "#0b665a",
    borderRadius: 10,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "800" },
});
