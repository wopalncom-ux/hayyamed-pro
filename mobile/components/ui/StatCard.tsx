import { View, Text } from "react-native";

interface Props {
  label: string;
  value: string;
  sub: string;
  color: string;
}

export function StatCard({ label, value, sub, color }: Props) {
  return (
    <View className="flex-1 bg-white border border-border rounded-2xl p-4">
      <Text className="text-xs text-muted font-medium mb-1">{label}</Text>
      <Text className="text-2xl font-bold" style={{ color }}>{value}</Text>
      <Text className="text-xs text-muted mt-0.5">{sub}</Text>
    </View>
  );
}
