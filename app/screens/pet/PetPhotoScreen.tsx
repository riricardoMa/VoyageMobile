import React from "react";
import { View, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { PrimaryButton, Button } from "@app/components/ui";

type PetPhotoScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetPhoto"
>;

export default function PetPhotoScreen({ navigation }: PetPhotoScreenProps) {
  const handleNext = () => {
    navigation.navigate("PetBasicInfo");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <Text className="text-primary mb-8 text-2xl font-bold">
        Pet Photo - Step 2/5
      </Text>
      <Text className="mb-8 text-center text-base text-gray-600">
        TODO: Implement photo upload/camera UI
      </Text>

      <View className="w-full flex-col gap-4">
        <PrimaryButton title="Next" onPress={handleNext} />
        <Button title="Back" variant="outline" onPress={handleBack} />
      </View>
    </View>
  );
}
