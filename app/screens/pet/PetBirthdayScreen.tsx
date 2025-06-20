import React, { useCallback } from "react";
import { View, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { SecondaryButton, TertiaryButton } from "@app/components/ui";
import { DatePicker } from "@app/components/ui/DatePicker";
import { usePetBirthday, usePetRegistrationProgress } from "@app/state";
import { PetRegistrationLayout } from "@app/components/layout";

type PetBirthdayScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetBirthday"
>;

export default function PetBirthdayScreen({
  navigation,
}: PetBirthdayScreenProps) {
  const { birthday, setPetBirthday } = usePetBirthday();
  const { nextStep, previousStep } = usePetRegistrationProgress();

  const handleNext = useCallback(() => {
    if (birthday) {
      nextStep();
      navigation.navigate("PetSex");
    }
  }, [birthday, navigation, nextStep]);

  const handleBack = useCallback(() => {
    previousStep();
    navigation.goBack();
  }, [navigation, previousStep]);

  return (
    <PetRegistrationLayout
      title="Birthday"
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TertiaryButton title="Back" onPress={handleBack} />
          </View>
          <View className="flex-1">
            <SecondaryButton
              title="Next"
              onPress={handleNext}
              disabled={!birthday}
            />
          </View>
        </View>
      }
    >
      {/* Labels */}
      <View className="flex-row justify-center gap-6 px-4 pt-5">
        <Text className="w-1/2 text-center text-lg font-bold text-[#333333]">
          Month
        </Text>
        <Text className="w-1/2 text-center text-lg font-bold text-[#333333]">
          Year
        </Text>
      </View>

      {/* Date picker */}
      <View className="px-4 pt-2">
        <DatePicker value={birthday} onChange={setPetBirthday} />
      </View>
    </PetRegistrationLayout>
  );
}
