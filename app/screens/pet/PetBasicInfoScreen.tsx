import React from "react";
import { View, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { PrimaryButton, Button } from "@app/components/ui";

type PetBasicInfoScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetBasicInfo"
>;

export default function PetBasicInfoScreen({
  navigation,
}: PetBasicInfoScreenProps) {
  const handleNext = () => {
    navigation.navigate("PetBirthday");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <Text className="text-primary mb-8 text-2xl font-bold">
        Pet Basic Info - Step 3/5
      </Text>
      <Text className="mb-8 text-center text-base text-gray-600">
        TODO: Implement pet name and owner nickname inputs
      </Text>

      <View className="w-full flex-col gap-4">
        <PrimaryButton title="Next" onPress={handleNext} />
        <Button title="Back" variant="outline" onPress={handleBack} />
      </View>
    </View>
  );
}
