import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Input, Button } from "@app/components/ui";
import { useAuth } from "@services/auth/useAuth";

import type { AuthStackParamList } from "@app/types/navigation";

type EmailInputScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "EmailInput"
>;

interface EmailInputScreenProps {
  route?: {
    params?: {
      isSignUp?: boolean;
    };
  };
}

export const EmailInputScreen: React.FC<EmailInputScreenProps> = ({
  route,
}) => {
  const navigation = useNavigation<EmailInputScreenNavigationProp>();
  const { signInWithOtp, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const isSignUp = route?.params?.isSignUp ?? true;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSendCode = async () => {
    if (!validateEmail(email)) return;

    await signInWithOtp(email);
    if (!error) {
      navigation.navigate("OTPVerification", { email, isSignUp });
    }
  };

  const buttonText = isSignUp ? "Send Verification Code" : "Send Login Code";
  const subtitle = isSignUp
    ? "Enter your email to get started"
    : "Enter your email to sign in";

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-center text-base text-gray-600">
            {subtitle}
          </Text>
        </View>

        <View className="mb-6">
          <Input
            label="Email Address"
            variant="email"
            placeholder="Enter your email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (emailError) setEmailError("");
            }}
            error={emailError || error || undefined}
            editable={!loading}
            autoFocus
          />
        </View>

        <Button
          title={buttonText}
          onPress={handleSendCode}
          disabled={loading || !email}
          loading={loading}
          className="mb-4"
        />

        <Text className="text-center text-sm leading-5 text-gray-500">
          {isSignUp
            ? "We'll send you a 6-digit verification code to confirm your email"
            : "We'll send you a 6-digit code to sign in"}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};
