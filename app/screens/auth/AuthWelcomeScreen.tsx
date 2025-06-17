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
    <View className="flex-1 items-center justify-center bg-fuschia-rodeo-dust/20 px-4">
      {/* Logo */}
      <View className="items-center">
        <Image
          source={require("@app/assets/auth/logo.png")}
          className="h-[228px] w-[261px]"
          resizeMode="contain"
        />

        {/* Voyage Text */}
        <Image
          source={require("@app/assets/auth/voyage-text.png")}
          className="h-[52px] w-[211px]"
          resizeMode="contain"
        />
      </View>

      {/* Sign Up Buttons */}
      <View className="mt-10 w-full space-y-4">
        {/* Sign Up with Email - Primary CTA */}
        <TouchableOpacity
          onPress={handleSignUpWithEmail}
          className="flex-row items-center justify-center rounded-full bg-fuschia-rodeo-dust px-6 py-4"
        >
          <Iconify icon="ic:outline-email" size={24} color="white" />
          <Text className="ml-2 text-lg font-medium text-white">
            Sign Up with Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <View className="mt-6 flex-row">
        <Text className="text-base text-[#333333]">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text className="text-base font-medium text-fuschia-rodeo-dust">
            Log in
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Extra Space */}
      <View className="h-10" />
    </View>
  );
};
