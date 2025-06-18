import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OTPInput } from "@app/components/ui";
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
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { verifyOtp, signInWithOtp, loading, error } = useAuth();

  const { email } = route.params;

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

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !loading && !otpError) {
      handleVerifyOtp();
    }
  }, [otp, loading, otpError]);

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
  };

  const handleResendCode = async () => {
    setOtp("");
    setOtpError("");
    setResendCountdown(30);
    await signInWithOtp(email);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FAFAFA]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 px-6 pt-8">
        <View className="mb-2">
          <Text className="mb-6 text-2xl font-bold text-[#333333]">
            Enter the code we just emailed you
          </Text>
        </View>

        <View className="mb-4">
          <OTPInput
            value={otp}
            onChangeText={text => {
              setOtp(text);
              if (otpError) setOtpError("");
            }}
            error={otpError}
            autoFocus
            disabled={loading}
          />
        </View>

        <View className="flex-row justify-center">
          <Text className="text-base text-[#333333]">
            Didn't Receive Code?{" "}
          </Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={resendCountdown > 0 || loading}
          >
            <Text className="text-base font-bold text-fuschia-rodeo-dust">
              {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : "Resend"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
