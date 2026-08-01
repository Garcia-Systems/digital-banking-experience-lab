import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { formatCents } from "../utils/formatters";
import { validateTransfer } from "../utils/transferValidation";

export default function TransferPreparationScreen({ accounts, onBack }) {
  const [form, setForm] = useState({
    sourceId: "",
    destinationId: "",
    amount: "",
    memo: "",
  });
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState(null);
  const update = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setReview(null);
  };
  const prepare = () => {
    const nextErrors = validateTransfer(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setReview(form);
  };
  const accountName = (id) =>
    accounts.find((account) => account.id === id)?.displayName;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title="Prepare a transfer" onBack={onBack} />
        <Text style={styles.intro}>
          Choose accounts and review the details. Nothing will be submitted.
        </Text>
        <Text style={styles.label}>From account</Text>
        <View style={styles.choices}>
          {accounts.map((account) => (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: form.sourceId === account.id }}
              key={account.id}
              onPress={() => update("sourceId", account.id)}
              style={[
                styles.choice,
                form.sourceId === account.id && styles.selected,
              ]}
            >
              <Text>
                {account.displayName} · •••• {account.accountSuffix}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.sourceId && <Text style={styles.error}>{errors.sourceId}</Text>}
        <Text style={styles.label}>To account</Text>
        <View style={styles.choices}>
          {accounts.map((account) => (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{
                checked: form.destinationId === account.id,
              }}
              key={account.id}
              onPress={() => update("destinationId", account.id)}
              style={[
                styles.choice,
                form.destinationId === account.id && styles.selected,
              ]}
            >
              <Text>
                {account.displayName} · •••• {account.accountSuffix}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.destinationId && (
          <Text style={styles.error}>{errors.destinationId}</Text>
        )}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          accessibilityLabel="Amount"
          keyboardType="decimal-pad"
          onChangeText={(value) => update("amount", value)}
          placeholder="0.00"
          style={styles.input}
          value={form.amount}
        />
        {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}
        <Text style={styles.label}>Memo (optional)</Text>
        <TextInput
          accessibilityLabel="Memo"
          maxLength={81}
          onChangeText={(value) => update("memo", value)}
          style={styles.input}
          value={form.memo}
        />
        {errors.memo && <Text style={styles.error}>{errors.memo}</Text>}
        <Pressable
          accessibilityRole="button"
          onPress={prepare}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Review transfer</Text>
        </Pressable>
        {review && (
          <View
            accessibilityLabel="Transfer review summary"
            style={styles.review}
          >
            <Text accessibilityRole="header" style={styles.reviewTitle}>
              Review summary
            </Text>
            <Text>From: {accountName(review.sourceId)}</Text>
            <Text>To: {accountName(review.destinationId)}</Text>
            <Text>
              Amount: {formatCents(Math.round(Number(review.amount) * 100))}
            </Text>
            <Text>Memo: {review.memo || "None"}</Text>
            <Text style={styles.notice}>
              Prepared only — this transfer has not been submitted.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f7f6" },
  content: { padding: 20, paddingBottom: 40 },
  intro: { color: "#526966", lineHeight: 21, marginBottom: 12 },
  label: {
    color: "#153b38",
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 8,
  },
  choices: { gap: 8 },
  choice: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c7d5d2",
    borderRadius: 10,
    padding: 14,
  },
  selected: {
    borderColor: "#0b665a",
    borderWidth: 2,
    backgroundColor: "#e9f5f2",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c7d5d2",
    borderRadius: 10,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  error: { color: "#9b2c20", marginTop: 6 },
  button: {
    backgroundColor: "#0b665a",
    borderRadius: 10,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontWeight: "800" },
  review: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginTop: 22,
    gap: 8,
  },
  reviewTitle: { color: "#153b38", fontSize: 20, fontWeight: "800" },
  notice: { color: "#9b6300", fontWeight: "700", marginTop: 8 },
});
