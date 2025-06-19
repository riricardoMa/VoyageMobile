import React from "react";
import { View } from "react-native";
import { ProgressIndicator } from "./ProgressIndicator";
import { usePetRegistrationProgress } from "@app/state";

export const PetRegistrationHeader: React.FC = () => {
  const { currentStep, totalSteps } = usePetRegistrationProgress();

  return (
    <View className="bg-white pt-20">
      <View className="items-center px-4">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </View>
    </View>
  );
};
