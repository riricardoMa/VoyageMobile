import React from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { PetCategoryCard, SecondaryButton } from "@app/components/ui";
import { usePetCategory, usePetRegistrationProgress } from "@app/state";
import { PetRegistrationLayout } from "@app/components/layout";

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
    <PetRegistrationLayout
      title="Category"
      footer={
        <SecondaryButton
          title="Next"
          onPress={handleNext}
          disabled={!category}
        />
      }
    >
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
    </PetRegistrationLayout>
  );
}
