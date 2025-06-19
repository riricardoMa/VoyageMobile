import React from "react";
import { View } from "react-native";
import { ProgressIndicator } from "./ProgressIndicator";

interface PetRegistrationHeaderProps {
  routeName: string;
}

const getStepFromRouteName = (routeName: string): number => {
  const stepMap: Record<string, number> = {
    PetCategory: 1,
    PetPhoto: 2,
    PetBasicInfo: 3,
    PetBirthday: 4,
    PetSex: 5,
  };
  return stepMap[routeName] || 1;
};

export const PetRegistrationHeader: React.FC<PetRegistrationHeaderProps> = ({
  routeName,
}) => {
  const currentStep = getStepFromRouteName(routeName);

  return (
    <View className="bg-white pt-20">
      <View className="items-center px-4">
        <ProgressIndicator currentStep={currentStep} totalSteps={5} />
      </View>
    </View>
  );
};
