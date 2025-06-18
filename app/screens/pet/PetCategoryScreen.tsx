import React from "react";
import { View, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { PrimaryButton } from "@app/components/ui";

type PetCategoryScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetCategory"
>;

export default function PetCategoryScreen({
  navigation,
}: PetCategoryScreenProps) {
  const handleNext = () => {
    navigation.navigate("PetPhoto");
  };

  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <Text className="text-primary mb-8 text-2xl font-bold">
        Pet Category - Step 1/5
      </Text>
      <Text className="mb-8 text-center text-base text-gray-600">
        TODO: Implement Dog/Cat selection UI
      </Text>

      <View className="w-full">
        <PrimaryButton title="Next" onPress={handleNext} />
      </View>
    </View>
  );
}
