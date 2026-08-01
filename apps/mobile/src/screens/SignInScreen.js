import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen({ message, onSignIn }) {
  const [memberId, setMemberId] = useState("member-1001");
  const [password, setPassword] = useState("password");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      await onSignIn({ memberId, password });
    } catch (requestError) {
      setError(
        requestError?.status === 401
          ? "The laboratory credentials were not recognized."
          : "Sign in is temporarily unavailable.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Fictional learning environment</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Mobile member sign in
        </Text>
        <Text style={styles.hint}>
          Use the deterministic laboratory credentials. Never use these
          credentials in a real system.
        </Text>
        {message ? (
          <Text accessibilityLiveRegion="polite" style={styles.message}>
            {message}
          </Text>
        ) : null}
        {error ? (
          <Text accessibilityLiveRegion="assertive" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <Text style={styles.label}>Member ID</Text>
        <TextInput
          accessibilityLabel="Member ID"
          autoCapitalize="none"
          editable={!submitting}
          onChangeText={setMemberId}
          style={styles.input}
          value={memberId}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          accessibilityLabel="Password"
          editable={!submitting}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          value={password}
        />
        <Pressable
          accessibilityRole="button"
          disabled={submitting}
          onPress={submit}
          style={[styles.button, submitting && styles.disabled]}
        >
          {submitting ? (
            <ActivityIndicator
              accessibilityLabel="Signing in"
              color="#ffffff"
            />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </Pressable>
        <Text style={styles.credentials}>
          Laboratory hint: member-1001 / password
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f3f7f6",
    padding: 20,
  },
  card: { backgroundColor: "#ffffff", borderRadius: 16, padding: 24 },
  eyebrow: {
    color: "#0b665a",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: { color: "#102f2c", fontSize: 28, fontWeight: "800", marginTop: 8 },
  hint: { color: "#526966", lineHeight: 21, marginTop: 10 },
  message: { color: "#6b4e12", marginTop: 16 },
  error: { color: "#6b261d", marginTop: 16 },
  label: { color: "#153b38", fontWeight: "700", marginTop: 18 },
  input: {
    borderColor: "#8aa19e",
    borderRadius: 8,
    borderWidth: 1,
    color: "#102f2c",
    marginTop: 6,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0b665a",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 24,
    minHeight: 48,
  },
  disabled: { opacity: 0.7 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "800" },
  credentials: { color: "#526966", fontSize: 12, marginTop: 16 },
});
