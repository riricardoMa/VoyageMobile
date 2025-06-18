import React from "react";
import { View, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "@app/types/navigation";
import { PrimaryButton, SecondaryButton } from "@app/components/ui";
import { Welcome } from "@app/components/svg/Welcome";

type WelcomeScreenProps = NativeStackScreenProps<AppStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const handleRegisterPets = () => {
    navigation.navigate("PetRegistration");
  };

  const handleStartExploring = () => {
    // Navigate to MediaUpload screen or any other main app screen
    navigation.navigate("MediaUpload");
  };

  return (
    <View className="flex-1 items-center justify-center bg-fuschia-rodeo-dust/20 px-6">
      {/* Welcome Text */}
      <View className="mb-16 items-center">
        <Welcome />
      </View>

      {/* Action Buttons */}
      <View className="flex w-full flex-col gap-4">
        {/* Register Pets - Primary Button */}
        <PrimaryButton title="Register Pets" onPress={handleRegisterPets} />

        {/* Start Exploring - Secondary Button */}
        <SecondaryButton
          title="Start Exploring"
          onPress={handleStartExploring}
        />
      </View>

      {/* Add Extra Space */}
      <View className="h-10" />
    </View>
  );
}
