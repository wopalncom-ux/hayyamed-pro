import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert("Required", "Please enter your email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: "https://hayyamed.pro/reset-password",
    });
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Email sent",
        "Check your inbox for a password reset link.",
        [{ text: "Back to sign in", onPress: () => router.replace("/(auth)/login") }]
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface px-6"
    >
      <View className="flex-1 justify-center">
        <TouchableOpacity
          className="mb-8 flex-row items-center"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text className="text-primary text-base">← Back</Text>
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-gray-900 mb-2">Reset password</Text>
        <Text className="text-muted mb-8">
          Enter your email and we&apos;ll send a reset link.
        </Text>

        <Text className="text-sm font-semibold text-gray-700 mb-1.5">Email</Text>
        <TextInput
          className="bg-white border border-border rounded-xl px-4 py-3.5 text-gray-900 text-base mb-6"
          placeholder="doctor@example.com"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleReset}
          accessibilityLabel="Email address"
        />

        <TouchableOpacity
          className={`bg-primary rounded-xl py-4 items-center ${loading ? "opacity-60" : ""}`}
          onPress={handleReset}
          disabled={loading}
          accessibilityRole="button"
        >
          <Text className="text-white font-semibold text-base">
            {loading ? "Sending…" : "Send reset link"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
