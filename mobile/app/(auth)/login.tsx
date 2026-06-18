import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Required", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setLoading(false);
    if (error) Alert.alert("Sign in failed", error.message);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-12">
        {/* Header */}
        <View className="mb-10">
          <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">H</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900">Welcome back</Text>
          <Text className="text-muted mt-1">Sign in to your Hayya Med Pro account</Text>
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
            autoComplete="email"
            returnKeyType="next"
            accessibilityLabel="Email address"
          />
        </View>

        {/* Password */}
        <View className="mb-2">
          <Text className="text-sm font-semibold text-gray-700 mb-1.5">Password</Text>
          <TextInput
            className="bg-white border border-border rounded-xl px-4 py-3.5 text-gray-900 text-base"
            placeholder="Your password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            accessibilityLabel="Password"
          />
        </View>

        {/* Forgot password */}
        <View className="items-end mb-6">
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-medium">Forgot password?</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Sign in button */}
        <TouchableOpacity
          className={`bg-primary rounded-xl py-4 items-center ${loading ? "opacity-60" : ""}`}
          onPress={handleLogin}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
        >
          <Text className="text-white font-semibold text-base">
            {loading ? "Signing in…" : "Sign in"}
          </Text>
        </TouchableOpacity>

        {/* Register link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-muted">New to Hayya Med Pro? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">Create account</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Disclaimer */}
        <Text className="text-xs text-muted text-center mt-8 px-4 leading-5">
          Hayya Med Pro supports CME tracking only. Verify requirements with your regulatory authority.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
