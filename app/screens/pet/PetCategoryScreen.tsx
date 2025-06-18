import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import {
  ProgressIndicator,
  PetCategoryCard,
  SecondaryButton,
} from "@app/components/ui";

type PetCategoryScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetCategory"
>;

type PetCategory = "dog" | "cat" | null;

export default function PetCategoryScreen({
  navigation,
}: PetCategoryScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<PetCategory>(null);

  const handleNext = () => {
    if (selectedCategory) {
      // TODO: Store selected category in state/context
      navigation.navigate("PetPhoto");
    }
  };

  const handleCategorySelect = (category: PetCategory) => {
    setSelectedCategory(category);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="pt-18 flex-1">
        {/* Progress Indicator */}
        <View className="mb-6 items-center px-4">
          <ProgressIndicator currentStep={1} totalSteps={5} />
        </View>

        {/* Category Title */}
        <View className="mb-5 px-4">
          <Text className="text-2xl font-bold text-[#333333]">Category</Text>
        </View>

        {/* Pet Category Cards */}
        <View className="mb-8 flex-row justify-center gap-6 px-4">
          <PetCategoryCard
            title="Dog"
            image={require("@app/assets/pet/dog-image.png")}
            selected={selectedCategory === "dog"}
            onPress={() => handleCategorySelect("dog")}
          />
          <PetCategoryCard
            title="Cat"
            image={require("@app/assets/pet/cat-image.png")}
            selected={selectedCategory === "cat"}
            onPress={() => handleCategorySelect("cat")}
          />
        </View>

        {/* Spacer to push button to bottom */}
        <View className="flex-1" />

        {/* Next Button */}
        <View className="px-4 pb-6">
          <SecondaryButton
            title="Next"
            onPress={handleNext}
            disabled={!selectedCategory}
            className={`${
              selectedCategory
                ? "border-fuschia-rodeo-dust bg-iris-parchment"
                : "border-iris-bone bg-iris-parchment/50"
            }`}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
