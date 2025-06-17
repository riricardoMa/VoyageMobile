import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@app/types/navigation";
import { Iconify } from "react-native-iconify";

type AuthWelcomeScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "AuthWelcome"
>;

export const AuthWelcomeScreen: React.FC<AuthWelcomeScreenProps> = ({
  navigation,
}) => {
  const handleSignUpWithEmail = () => {
    navigation.navigate("EmailInput", { isSignUp: true });
  };

  const handleLogin = () => {
    navigation.navigate("EmailInput", { isSignUp: false });
  };

  return (
    <View className="bg-auth-background flex-1 items-center justify-center px-6">
      {/* Logo */}
      <View className="mb-8 items-center">
        <Image
          source={require("@app/assets/auth/logo.png")}
          className="mb-6 h-[228px] w-[261px]"
          resizeMode="contain"
        />

        {/* Voyage Text */}
        <Image
          source={require("@app/assets/auth/voyage-text.png")}
          className="mb-6 h-[52px] w-[211px]"
          resizeMode="contain"
        />
      </View>

      {/* Sign Up Buttons */}
      <View className="mt-16 w-full max-w-xs space-y-4">
        {/* Sign Up with Email - Primary CTA */}
        <TouchableOpacity
          onPress={handleSignUpWithEmail}
          className="flex-row items-center justify-center rounded-full bg-primary px-6 py-4"
        >
          <Iconify icon="ic:outline-email" size={24} color="white" />
          <Text className="ml-2 text-lg font-medium text-white">
            Sign Up with Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <View className="mt-12 flex-row">
        <Text className="text-auth-login-text text-base">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text className="text-base font-medium text-primary">Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
