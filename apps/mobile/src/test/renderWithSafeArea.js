import { render } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, right: 0, bottom: 34, left: 0 },
};

export function renderWithSafeArea(ui) {
  return render(
    <SafeAreaProvider initialMetrics={initialMetrics}>{ui}</SafeAreaProvider>,
  );
}
