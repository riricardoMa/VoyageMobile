import React from "react";
import { View } from "react-native";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <View className="flex-row items-center justify-center px-4 py-2">
      {/* Progress line behind the dots */}
      <View className="absolute h-0.5 w-64 bg-iris-bone" />

      {/* Progress dots */}
      <View className="w-64 flex-row items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStep;

          return (
            <View
              key={index}
              className={`h-4 w-4 rounded-full border-2 ${
                isCompleted
                  ? "border-iris-bone bg-fuschia-rodeo-dust"
                  : "border-iris-bone bg-white"
              }`}
            />
          );
        })}
      </View>
    </View>
  );
};
