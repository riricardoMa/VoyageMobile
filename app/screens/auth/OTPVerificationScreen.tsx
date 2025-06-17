import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OTPInput, Button, LoadingSpinner } from "@app/components/ui";
import { useAuth } from "@services/auth/useAuth";

import type { AuthStackParamList } from "@app/types/navigation";

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "OTPVerification"
>;

type OTPVerificationScreenRouteProp = RouteProp<
  AuthStackParamList,
  "OTPVerification"
>;

export const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { verifyOtp, signInWithOtp, loading, error } = useAuth();

  const { email, isSignUp = true } = route.params;

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    setOtpError("");
    await verifyOtp(email, otp);

    if (error) {
      setOtpError("Invalid verification code. Please try again.");
    }
    // Note: Navigation will be handled automatically by the AuthContext
    // when isAuthenticated becomes true
  };

  const handleResendCode = async () => {
    setOtp("");
    setOtpError("");
    setResendCountdown(60);
    await signInWithOtp(email);
  };

  const handleBackToEmail = () => {
    navigation.navigate("EmailInput", { isSignUp });
  };

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <View className="mb-8">
        <Text className="mb-2 text-center text-base text-gray-600">
          We sent a 6-digit code to:
        </Text>
        <Text className="text-center text-base font-semibold text-primary">
          {email}
        </Text>
      </View>

      <View className="mb-6">
        <OTPInput
          value={otp}
          onChangeText={text => {
            setOtp(text);
            if (otpError) setOtpError("");
          }}
          error={otpError || error || undefined}
          autoFocus
        />
      </View>

      <Button
        title="Verify Code"
        onPress={handleVerifyOtp}
        disabled={loading || otp.length !== 6}
        loading={loading}
        className="mb-4"
      />

      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handleResendCode}
          disabled={resendCountdown > 0 || loading}
          className={`px-4 py-2 ${resendCountdown > 0 || loading ? "opacity-50" : ""}`}
        >
          <Text className="font-medium text-primary">
            {resendCountdown > 0
              ? `Resend in ${resendCountdown}s`
              : "Resend Code"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBackToEmail}
          disabled={loading}
          className={`px-4 py-2 ${loading ? "opacity-50" : ""}`}
        >
          <Text className="font-medium text-gray-600">Change Email</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center text-sm leading-5 text-gray-500">
        Check your spam folder if you don't see the email
      </Text>

      {loading && (
        <View className="mt-6">
          <LoadingSpinner />
        </View>
      )}
    </View>
  );
};
