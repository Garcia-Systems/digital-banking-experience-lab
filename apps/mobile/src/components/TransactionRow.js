import { StyleSheet, Text, View } from "react-native";
import { formatCents } from "../utils/formatters";

export default function TransactionRow({ transaction }) {
  return (
    <View style={styles.row}>
      <View style={styles.details}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.metadata}>
          {transaction.type} · {transaction.postedAt}
        </Text>
      </View>
      <Text
        style={[styles.amount, transaction.amountCents < 0 && styles.debit]}
      >
        {formatCents(transaction.amountCents)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#d7e1df",
    gap: 12,
  },
  details: { flex: 1 },
  description: { color: "#153b38", fontWeight: "700" },
  metadata: { color: "#526966", marginTop: 4, textTransform: "capitalize" },
  amount: { color: "#0b665a", fontWeight: "800" },
  debit: { color: "#6b261d" },
});
