import React from "react";
import { View, Text, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { PrimaryButton, Button, TertiaryButton } from "@app/components/ui";
import { PetRegistrationLayout } from "@app/components/layout";

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
    <PetRegistrationLayout
      title="Sex"
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TertiaryButton title="Back" onPress={handleBack} />
          </View>
          <View className="flex-1">
            <PrimaryButton title="Register" onPress={handleRegister} />
          </View>
        </View>
      }
    >
      <View className="flex-1 items-center justify-center">
        <Text className="mb-8 text-center text-base text-gray-600">
          TODO: Implement boy/girl selection UI
        </Text>
      </View>
    </PetRegistrationLayout>
  );
}
