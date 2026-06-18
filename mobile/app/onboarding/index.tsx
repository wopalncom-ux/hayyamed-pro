import { View, Text, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";

export default function OnboardingScreen() {
  const { profile } = useAuth();
  const step = profile?.onboarding_step ?? 1;

  function openWeb() {
    Linking.openURL(`https://hayyamed.pro/onboarding/${step}`);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface items-center justify-center px-8">
      <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-6">
        <Text className="text-white text-3xl font-bold">H</Text>
      </View>

      <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
        Complete your profile
      </Text>
      <Text className="text-muted text-center leading-6 mb-2">
        You&apos;re on step {step} of 7. Complete your profile on the web to unlock the full dashboard.
      </Text>
      <Text className="text-xs text-muted text-center mb-8">
        Your progress is saved — you can continue any time.
      </Text>

      <TouchableOpacity
        className="bg-primary rounded-xl w-full py-4 items-center mb-3"
        onPress={openWeb}
        accessibilityRole="button"
        accessibilityLabel="Continue onboarding on web"
      >
        <Text className="text-white font-semibold text-base">Continue on hayyamed.pro</Text>
      </TouchableOpacity>

      <Text className="text-xs text-muted text-center mt-6 leading-5">
        Hayya Med Pro supports CME tracking only. Verify requirements with your regulatory authority.
      </Text>
    </SafeAreaView>
  );
}
