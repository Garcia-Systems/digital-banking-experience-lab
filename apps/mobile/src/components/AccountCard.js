import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCents } from "../utils/formatters";

export default function AccountCard({ account, onPress }) {
  const suffix = `•••• ${account.accountSuffix}`;
  const label = `${account.displayName}, ${account.type} account ending in ${account.accountSuffix}, status ${account.status}`;
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={() => onPress?.(account)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.name}>{account.displayName}</Text>
          <Text style={styles.metadata}>
            {account.type} · {suffix}
          </Text>
        </View>
        <Text style={styles.status}>{account.status}</Text>
      </View>
      <Text style={styles.balanceLabel}>Available balance</Text>
      <Text style={styles.available}>
        {formatCents(account.availableBalanceCents)}
      </Text>
      <Text style={styles.current}>
        Current balance {formatCents(account.currentBalanceCents)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d7e1df",
  },
  pressed: { opacity: 0.72 },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  name: { color: "#153b38", fontSize: 19, fontWeight: "700" },
  metadata: { color: "#526966", marginTop: 4, textTransform: "capitalize" },
  status: { color: "#175d52", fontWeight: "700", textTransform: "capitalize" },
  balanceLabel: { color: "#526966", marginTop: 22 },
  available: {
    color: "#102f2c",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 3,
  },
  current: { color: "#526966", marginTop: 8 },
});
