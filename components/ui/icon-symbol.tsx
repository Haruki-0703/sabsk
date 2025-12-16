// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for SubscK app
 */
const MAPPING = {
  "house.fill": "home",
  "gearshape.fill": "settings",
  "plus": "add",
  "plus.circle.fill": "add-circle",
  "trash.fill": "delete",
  "pencil": "edit",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "xmark": "close",
  "checkmark": "check",
  "calendar": "event",
  "creditcard.fill": "credit-card",
  "bell.fill": "notifications",
  "info.circle.fill": "info",
  "chart.pie.fill": "pie-chart",
  "magnifyingglass": "search",
  "list.bullet": "list",
  "doc.text.fill": "description",
  "lock.fill": "lock",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
