import { StyleSheet, Text, View } from "react-native";
import { formatTimestamp } from "../utils/formatters";

export default function ProjectionStatus({ projection }) {
  return (
    <View
      style={[styles.status, projection.isStale && styles.stale]}
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.title}>
        {projection.isStale
          ? "Account information may be out of date."
          : "Account information is current."}
      </Text>
      <Text style={styles.time}>
        Last updated {formatTimestamp(projection.generatedAt)} UTC
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    borderLeftWidth: 4,
    borderLeftColor: "#168274",
    padding: 12,
    marginVertical: 20,
    backgroundColor: "#e9f5f2",
  },
  stale: { borderLeftColor: "#9b6300", backgroundColor: "#fff4d8" },
  title: { color: "#153b38", fontWeight: "700" },
  time: { color: "#526966", marginTop: 4 },
});
