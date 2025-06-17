import React from "react";
import { View, Text } from "react-native";
import { LoadingSpinner } from "@app/components/ui";

export const SplashScreen: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View className="mb-8 items-center">
        {/* You can replace this with your app logo */}
        <Text className="mb-4 text-4xl font-bold text-primary">Voyage</Text>
        <Text className="text-center text-base text-gray-600">
          Preparing your experience...
        </Text>
      </View>

      <LoadingSpinner />
    </View>
  );
};
