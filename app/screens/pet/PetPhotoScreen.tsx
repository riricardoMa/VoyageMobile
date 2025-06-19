import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import { SecondaryButton, TertiaryButton } from "@app/components/ui";

type PetPhotoScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetPhoto"
>;

export default function PetPhotoScreen({ navigation }: PetPhotoScreenProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedPhoto) {
      // TODO: Store selected photo in state/context
      navigation.navigate("PetBasicInfo");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTakePhoto = () => {
    // TODO: Implement camera functionality
    // For now, simulate photo selection with a placeholder
    setSelectedPhoto("camera_photo");
  };

  const handleAddFromLibrary = () => {
    // TODO: Implement photo library functionality
    // For now, simulate photo selection with a placeholder
    setSelectedPhoto("library_photo");
  };

  const renderPhotoUploadArea = () => {
    if (selectedPhoto) {
      // Show uploaded photo state
      return (
        <View className="flex-1 items-center justify-end rounded-xl border-2 border-dashed border-[#D4DBE3] p-6">
          <View className="absolute left-0.5 top-0.5 h-[354px] w-[354px] rounded-xl bg-gray-300">
            {/* Placeholder for actual image */}
            <View className="flex-1 items-center justify-center rounded-xl bg-gray-200">
              <Text className="text-lg text-gray-500">Photo Preview</Text>
              <Text className="mt-2 text-sm text-gray-400">
                {selectedPhoto}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Show initial upload state
    return (
      <View className="items-center gap-6 rounded-xl border-2 border-dashed border-[#D4DBE3] px-6 py-14">
        <View className="items-center gap-2">
          <View className="h-6">
            <Text className="text-center text-lg font-bold text-[#333333]">
              Add a photo
            </Text>
          </View>
          <Text className="text-center text-sm text-[#333333]">
            Take a photo or upload one from your library
          </Text>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="h-10 items-center justify-center rounded-xl bg-iris-parchment px-4"
          >
            <Text className="text-sm font-bold text-[#333333]">Take photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddFromLibrary}
            className="h-10 items-center justify-center rounded-xl bg-iris-parchment px-4"
          >
            <Text className="text-sm font-bold text-[#333333]">
              Add from library
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Title */}
        <View className="px-4 py-5">
          <Text className="text-2xl font-bold text-[#333333]">Headphoto</Text>
        </View>

        {/* Photo Upload Area */}
        <View className="flex-1 px-4 pb-4">{renderPhotoUploadArea()}</View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 px-4 pb-3">
          <View className="flex-1">
            <TertiaryButton title="Back" onPress={handleBack} />
          </View>
          <View className="flex-1">
            <SecondaryButton
              title="Next"
              onPress={handleNext}
              disabled={!selectedPhoto}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
