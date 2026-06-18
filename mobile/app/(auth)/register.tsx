import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleRegister() {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert("Required", "Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    setLoading(false);
    if (error) {
      Alert.alert("Registration failed", error.message);
    } else {
      Alert.alert(
        "Check your email",
        "We sent a verification link to " + email + ". Verify your email to continue.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-12">
        <View className="mb-10">
          <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">H</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900">Create account</Text>
          <Text className="text-muted mt-1">Start tracking your CME for free</Text>
        </View>

        {/* Full name */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1.5">Full name</Text>
          <TextInput
            className="bg-white border border-border rounded-xl px-4 py-3.5 text-gray-900 text-base"
            placeholder="Dr. Ahmed Al-Mansoori"
            placeholderTextColor="#94a3b8"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            returnKeyType="next"
            accessibilityLabel="Full name"
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1.5">Email</Text>
          <TextInput
            className="bg-white border border-border rounded-xl px-4 py-3.5 text-gray-900 text-base"
            placeholder="doctor@example.com"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            accessibilityLabel="Email address"
          />
        </View>

        {/* Password */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-1.5">Password</Text>
          <TextInput
            className="bg-white border border-border rounded-xl px-4 py-3.5 text-gray-900 text-base"
            placeholder="Minimum 8 characters"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            accessibilityLabel="Password"
          />
        </View>

        <TouchableOpacity
          className={`bg-primary rounded-xl py-4 items-center ${loading ? "opacity-60" : ""}`}
          onPress={handleRegister}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Create account"
        >
          <Text className="text-white font-semibold text-base">
            {loading ? "Creating account…" : "Create account"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-muted">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text className="text-xs text-muted text-center mt-8 px-4 leading-5">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
