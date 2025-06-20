import React from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { SecondaryButton, TertiaryButton, Input } from "@app/components/ui";
import { PetRegistrationLayout } from "@app/components/layout";
import { usePetBasicInfo, usePetRegistrationProgress } from "@app/state";

type PetBasicInfoScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetBasicInfo"
>;

export default function PetBasicInfoScreen({
  navigation,
}: PetBasicInfoScreenProps) {
  const { name, ownerTitle, setPetName, setPetOwnerTitle } = usePetBasicInfo();
  const { nextStep, previousStep } = usePetRegistrationProgress();

  const handleNext = () => {
    if (name.trim() && ownerTitle.trim()) {
      nextStep();
      navigation.navigate("PetBirthday");
    }
  };

  const handleBack = () => {
    previousStep();
    navigation.goBack();
  };

  const isNextDisabled = !name.trim() || !ownerTitle.trim();

  return (
    <PetRegistrationLayout
      title="Tell us about your pet"
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TertiaryButton title="Back" onPress={handleBack} />
          </View>
          <View className="flex-1">
            <SecondaryButton
              title="Next"
              onPress={handleNext}
              disabled={isNextDisabled}
            />
          </View>
        </View>
      }
    >
      <View className="px-4">
        <View className="gap-6">
          <Input
            label="What's your pet's name?"
            value={name}
            onChangeText={setPetName}
            placeholder="e.g. Bubu"
            autoCapitalize="words"
          />
          <Input
            label="What do you want to be called?"
            value={ownerTitle}
            onChangeText={setPetOwnerTitle}
            placeholder="e.g. Mama, Papa, or your name"
            autoCapitalize="words"
          />
        </View>
      </View>
    </PetRegistrationLayout>
  );
}
