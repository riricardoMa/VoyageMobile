import React from "react";
import { View, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";

import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  PetCategoryCard,
  LoadingSpinner,
} from "@app/components/ui";
import { PetRegistrationLayout } from "@app/components/layout";
import {
  usePetRegistrationProgress,
  usePetSex,
  usePetData,
  usePetRegistration,
} from "@app/state";
import { usePetApi, useNetworkDebug } from "@app/services/network";
import type { CreatePetRequest } from "@app/services/network/endpoints/petEndpoints";

type PetSexScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetSex"
>;

export default function PetSexScreen({ navigation }: PetSexScreenProps) {
  const { sex, setPetSex } = usePetSex();
  const { previousStep, goToStep } = usePetRegistrationProgress();
  const petData = usePetData();
  const { resetPetRegistration } = usePetRegistration();
  const { createPet, loading, error } = usePetApi();
  const { showLatestResponse, totalRequests } = useNetworkDebug();

  // Helper function to transform pet data for API
  const transformPetDataForApi = (): CreatePetRequest | null => {
    if (
      !petData.category ||
      !petData.photoUploadResult ||
      !petData.sex ||
      !petData.birthday ||
      !petData.name.trim() ||
      !petData.ownerTitle.trim() ||
      !petData.photoUploadResult.filePath
    ) {
      return null;
    }

    return {
      name: petData.name.trim(),
      type: petData.category.toUpperCase() as "DOG" | "CAT",
      avatarFilePath: petData.photoUploadResult.filePath,
      ownerTitle: petData.ownerTitle.trim(),
      birthday: petData.birthday.toISOString(),
      sex: petData.sex.toUpperCase() as "BOY" | "GIRL",
    };
  };

  const handleRegister = async () => {
    const apiData = transformPetDataForApi();

    if (!apiData) {
      Alert.alert(
        "Incomplete Registration",
        "Please complete all required fields before registering."
      );
      return;
    }

    try {
      const result = await createPet(apiData);

      if (result) {
        Alert.alert(
          "Registration Complete",
          "Pet registration completed successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset registration data after successful registration
                resetPetRegistration();
                // Navigate back to the beginning or wherever appropriate
                navigation.navigate("PetCategory");
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Registration Failed",
          error || "Failed to register pet. Please try again."
        );
      }
    } catch (err) {
      Alert.alert(
        "Registration Error",
        "An unexpected error occurred. Please try again."
      );
    }
  };

  const handleBack = () => {
    previousStep();
    navigation.goBack();
  };

  const handleAddAnother = async () => {
    const apiData = transformPetDataForApi();

    if (!apiData) {
      Alert.alert(
        "Incomplete Registration",
        "Please complete all required fields before adding another pet."
      );
      return;
    }

    try {
      const result = await createPet(apiData);

      if (result) {
        // Clear current pet registration data after successful creation
        resetPetRegistration();
        // Move back to step 1 (category selection)
        goToStep(1);
        navigation.navigate("PetCategory");
      } else {
        Alert.alert(
          "Registration Failed",
          error || "Failed to register pet. Please try again."
        );
      }
    } catch (err) {
      Alert.alert(
        "Registration Error",
        "An unexpected error occurred. Please try again."
      );
    }
  };

  // Show loading spinner when API call is in progress
  if (loading) {
    return (
      <PetRegistrationLayout title="Sex" footer={<View />}>
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner />
        </View>
      </PetRegistrationLayout>
    );
  }

  return (
    <PetRegistrationLayout
      title="Sex"
      footer={
        <View className="flex-col gap-3">
          {/* Row with Back and Add Another buttons */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <TertiaryButton title="Back" onPress={handleBack} />
            </View>
            <View className="flex-1">
              <SecondaryButton
                title="Add Another"
                onPress={handleAddAnother}
                disabled={!sex || loading}
              />
            </View>
          </View>

          {/* Register button */}
          <PrimaryButton
            title="Register"
            onPress={handleRegister}
            disabled={!sex || loading}
          />
        </View>
      }
    >
      <View className="my-[20px] flex-row justify-center gap-6 px-4">
        <PetCategoryCard
          title="Boy"
          selected={sex === "boy"}
          onPress={() => setPetSex("boy")}
        />
        <PetCategoryCard
          title="Girl"
          selected={sex === "girl"}
          onPress={() => setPetSex("girl")}
        />
      </View>

      {/* Debug button - only visible in development */}
      {__DEV__ && totalRequests > 0 && (
        <View className="mb-4 px-4">
          <TertiaryButton
            title={`🐛 Show Last API Response (${totalRequests} total)`}
            onPress={showLatestResponse}
          />
        </View>
      )}
    </PetRegistrationLayout>
  );
}
