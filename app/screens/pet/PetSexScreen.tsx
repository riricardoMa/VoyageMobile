import React from "react";
import { View, Text, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { PrimaryButton, Button } from "@app/components/ui";

type PetSexScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetSex"
>;

export default function PetSexScreen({ navigation }: PetSexScreenProps) {
  const handleRegister = () => {
    Alert.alert(
      "Registration Complete",
      "Pet registration completed successfully!",
      [
        {
          text: "OK",
          onPress: () => {
            // Navigate back to Welcome or main app
            navigation.getParent()?.goBack();
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <Text className="text-primary mb-8 text-2xl font-bold">
        Pet Sex - Step 5/5
      </Text>
      <Text className="mb-8 text-center text-base text-gray-600">
        TODO: Implement boy/girl selection UI
      </Text>

      <View className="w-full flex-col gap-4">
        <PrimaryButton title="Register" onPress={handleRegister} />
        <Button title="Back" variant="outline" onPress={handleBack} />
      </View>
    </View>
  );
}
