import React from "react";
import { View, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";

import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  PetCategoryCard,
} from "@app/components/ui";
import { PetRegistrationLayout } from "@app/components/layout";
import { usePetRegistrationProgress, usePetSex } from "@app/state";

type PetSexScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetSex"
>;

export default function PetSexScreen({ navigation }: PetSexScreenProps) {
  const { sex, setPetSex } = usePetSex();
  const { previousStep } = usePetRegistrationProgress();

  // TODO: implement actual registration logic
  const handleRegister = () => {
    /*
     * Registration flow is handled in a later task.
     * Keep this placeholder alert for now to verify UI.
     */
    Alert.alert(
      "Registration Complete",
      "Pet registration completed successfully!"
    );
  };

  const handleBack = () => {
    previousStep();
    navigation.goBack();
  };

  const handleAddAnother = () => {
    // Placeholder implementation: navigate back to category selection
    navigation.navigate("PetCategory");
  };

  return (
    <PetRegistrationLayout
      title="Sex"
      footer={
        <View className="flex-col gap-3">
          {/* Row with Back and Add Another buttons */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <TertiaryButton title="Back" onPress={handleBack} />
            </View>
            <View className="flex-1">
              <SecondaryButton
                title="Add Another"
                onPress={handleAddAnother}
                disabled={!sex}
              />
            </View>
          </View>

          {/* Register button */}
          <PrimaryButton
            title="Register"
            onPress={handleRegister}
            disabled={!sex}
          />
        </View>
      }
    >
      <View className="my-[20px] flex-row justify-center gap-6 px-4">
        <PetCategoryCard
          title="Boy"
          selected={sex === "boy"}
          onPress={() => setPetSex("boy")}
        />
        <PetCategoryCard
          title="Girl"
          selected={sex === "girl"}
          onPress={() => setPetSex("girl")}
        />
      </View>
    </PetRegistrationLayout>
  );
}
