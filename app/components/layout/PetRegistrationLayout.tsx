import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";

interface PetRegistrationLayoutProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export const PetRegistrationLayout: React.FC<PetRegistrationLayoutProps> = ({
  title,
  children,
  footer,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            {/* Header */}
            <View className="mb-[10px] px-4 pt-6">
              <Text className="my-5 text-2xl font-bold text-[#333333]">
                {title}
              </Text>
            </View>

            {/* Content */}
            <View className="flex-1">{children}</View>
          </View>
        </ScrollView>

        {/* Footer (CTAs) */}
        <View className="px-4 py-3">{footer}</View>
      </View>
    </SafeAreaView>
  );
};

export default PetRegistrationLayout;
