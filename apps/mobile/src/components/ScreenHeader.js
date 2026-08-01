import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ScreenHeader({ title, onBack }) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        style={styles.back}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 22 },
  back: { alignSelf: "flex-start", minHeight: 44, justifyContent: "center" },
  backText: { color: "#0b665a", fontSize: 17, fontWeight: "700" },
  title: { color: "#102f2c", fontSize: 28, fontWeight: "800" },
});
