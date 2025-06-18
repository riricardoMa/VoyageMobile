import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Input, Button, PrimaryButton } from "@app/components/ui";
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

  const handleLoginPress = () => {
    navigation.navigate("EmailInput", { isSignUp: false });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FAFAFA]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 px-6 pt-8">
        <View className="mb-6">
          <Input
            label="What's your email?"
            variant="email"
            placeholder="Email"
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

        <PrimaryButton
          title="Send Code"
          onPress={handleSendCode}
          disabled={loading || !email}
          loading={loading}
          className="mb-8"
        />

        <View className="flex-row justify-center">
          <Text className="text-base text-gray-600">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text className="text-base text-gray-400">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
