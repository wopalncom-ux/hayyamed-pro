import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  percentage: number;
  color: string;
  completed: number;
  required: number;
  country: string;
}

export function ComplianceRing({ percentage, color, completed, required, country }: Props) {
  const size   = 180;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (Math.min(percentage, 100) / 100) * circ;

  const statusLabel =
    percentage >= 100 ? "Compliant" :
    percentage >= 60  ? "At Risk"   : "Non-Compliant";

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#e2e8f0" strokeWidth={stroke}
          />
          {/* Progress */}
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        {/* Centre text */}
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-4xl font-bold text-gray-900">{percentage}%</Text>
          <Text className="text-xs text-muted mt-0.5">{statusLabel}</Text>
        </View>
      </View>

      <View className="items-center mt-2">
        <Text className="text-sm text-muted">
          <Text className="font-bold text-gray-900">{completed}</Text> / {required} credits
        </Text>
        {country && <Text className="text-xs text-muted mt-0.5">{country}</Text>}
      </View>
    </View>
  );
}
