import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "../services/auth/useAuth";
import Button from "@components/Button";
import Input from "@components/Input";

export default function SignInScreen() {
  const { signInWithGoogle, signInWithOtp, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    setMessage("");
    await signInWithOtp(email);
    setOtpSent(true);
    setMessage("Check your email for the login link.");
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-6 text-center text-gray-900">
        Sign In
      </Text>

      {error ? (
        <Text className="text-red-500 mb-4 text-center">{error}</Text>
      ) : null}

      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
        label="Email Address"
      />

      <Button
        title={otpSent ? "Resend Magic Link" : "Send Magic Link"}
        onPress={handleSendOtp}
        disabled={loading || !email}
        loading={loading}
        variant="primary"
        size="lg"
      />

      <View className="h-4" />

      <Button
        title="Sign in with Google"
        onPress={signInWithGoogle}
        disabled={loading}
        variant="secondary"
        size="lg"
      />

      {message ? (
        <Text className="text-green-600 mt-4 text-center font-medium">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
