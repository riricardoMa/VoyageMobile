import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { PetCategoryCard, SecondaryButton } from "@app/components/ui";
import { usePetCategory, usePetRegistrationProgress } from "@app/state";

type PetCategoryScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetCategory"
>;

export default function PetCategoryScreen({
  navigation,
}: PetCategoryScreenProps) {
  const { category, setPetCategory } = usePetCategory();
  const { nextStep } = usePetRegistrationProgress();

  const handleNext = () => {
    if (category) {
      nextStep();
      navigation.navigate("PetPhoto");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Category Title */}
        <View className="mb-[10px] px-4 pt-6">
          <Text className="my-5 text-2xl font-bold text-[#333333]">
            Category
          </Text>
        </View>

        {/* Pet Category Cards */}
        <View className="my-[20px] flex-row justify-center gap-6 px-4">
          <PetCategoryCard
            title="Dog"
            image={require("@app/assets/pet/dog-image.png")}
            selected={category === "dog"}
            onPress={() => setPetCategory("dog")}
          />
          <PetCategoryCard
            title="Cat"
            image={require("@app/assets/pet/cat-image.png")}
            selected={category === "cat"}
            onPress={() => setPetCategory("cat")}
          />
        </View>

        {/* Next Button */}
        <View className="px-4 pt-3">
          <SecondaryButton
            title="Next"
            onPress={handleNext}
            disabled={!category}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
