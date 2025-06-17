import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { EmailInputScreen } from "./EmailInputScreen";
import { OTPVerificationScreen } from "./OTPVerificationScreen";
import { Button } from "@app/components/ui";

type AuthStep = "email" | "otp" | "success";

interface AuthFlowScreenProps {
  isSignUp?: boolean;
  onAuthSuccess?: () => void;
}

export const AuthFlowScreen: React.FC<AuthFlowScreenProps> = ({
  isSignUp = true,
  onAuthSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [currentEmail, setCurrentEmail] = useState("");

  const handleEmailSubmitted = (email: string) => {
    setCurrentEmail(email);
    setCurrentStep("otp");
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setCurrentEmail("");
  };

  const handleAuthSuccess = () => {
    setCurrentStep("success");
    // Call parent callback after a brief delay to show success screen
    setTimeout(() => {
      onAuthSuccess?.();
    }, 2000);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <EmailInputScreen
            onEmailSubmitted={handleEmailSubmitted}
            isSignUp={isSignUp}
          />
        );

      case "otp":
        return (
          <OTPVerificationScreen
            email={currentEmail}
            onBack={handleBackToEmail}
            onSuccess={handleAuthSuccess}
            isSignUp={isSignUp}
          />
        );

      case "success":
        return (
          <View className="flex-1 items-center justify-center bg-background px-6">
            <View className="mb-8 items-center">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Text className="text-2xl text-green-600">✓</Text>
              </View>
              <Text className="mb-2 text-center text-3xl font-bold text-primary">
                {isSignUp ? "Welcome to Voyage!" : "Welcome Back!"}
              </Text>
              <Text className="text-center text-base text-gray-600">
                {isSignUp
                  ? "Your account has been created successfully"
                  : "You have been signed in successfully"}
              </Text>
            </View>

            <Button
              title="Start Exploring"
              onPress={onAuthSuccess}
              size="lg"
              className="w-full"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {renderCurrentStep()}
    </SafeAreaView>
  );
};
