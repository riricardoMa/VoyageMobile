import React from "react";
import { View, Text, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "@app/types/navigation";
import { PrimaryButton, SecondaryButton } from "@app/components/ui";

type WelcomeScreenProps = NativeStackScreenProps<AppStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const handleRegisterPets = () => {
    Alert.alert("Coming Soon", "Pet registration feature is coming soon!", [
      { text: "OK", style: "default" },
    ]);
  };

  const handleStartExploring = () => {
    // Navigate to MediaUpload screen or any other main app screen
    navigation.navigate("MediaUpload");
  };

  return (
    <View className="flex-1 items-center justify-center bg-fuschia-rodeo-dust/20 px-6">
      {/* Welcome Text */}
      <View className="mb-16 items-center">
        <Text className="text-center text-6xl font-bold leading-tight text-fuschia-rodeo-dust">
          Welcome
        </Text>
        <Text className="text-center text-6xl font-bold leading-tight text-fuschia-rodeo-dust">
          to
        </Text>
        <Text className="text-center text-6xl font-bold leading-tight text-fuschia-rodeo-dust">
          Voyage
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="w-full space-y-4">
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
