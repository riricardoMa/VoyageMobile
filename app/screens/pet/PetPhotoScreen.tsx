import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PetRegistrationStackParamList } from "@app/types/navigation";
import {
  SecondaryButton,
  TertiaryButton,
  UploadProgressBar,
} from "@app/components/ui";
import { useUpload } from "@app/services/upload";
import {
  usePetRegistrationStore,
  selectPetPhoto,
} from "@app/state/stores/petRegistrationStore";
import type {
  MediaFile,
  UploadOptions,
} from "@app/services/upload/types/UploadTypes";
import { usePetRegistrationProgress } from "@app/state/hooks/usePetRegistration";
import { Close } from "@app/components/svg";
import { PetRegistrationLayout } from "@app/components/layout";

type PetPhotoScreenProps = NativeStackScreenProps<
  PetRegistrationStackParamList,
  "PetPhoto"
>;

export default function PetPhotoScreen({ navigation }: PetPhotoScreenProps) {
  // Local state for UI
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadingFileId, setUploadingFileId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload service hook
  const {
    pickImage,
    pickImageFromCamera,
    uploadFile,
    isUploading,
    error: uploadError,
    clearError,
    getProgress,
  } = useUpload();

  // Pet registration store
  const existingPhoto = usePetRegistrationStore(selectPetPhoto);
  const setPetPhoto = usePetRegistrationStore(state => state.setPetPhoto);
  const clearPetPhoto = usePetRegistrationStore(state => state.clearPetPhoto);
  const { nextStep, previousStep } = usePetRegistrationProgress();

  useEffect(() => {
    if (!uploadingFileId) {
      setUploadProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      const progress = getProgress(uploadingFileId);
      if (progress) {
        setUploadProgress(progress.progress);
      }
      if (progress?.progress === 100) {
        clearInterval(progressInterval);
      }
    }, 500); // Poll every 500ms

    return () => {
      clearInterval(progressInterval);
    };
  }, [uploadingFileId, getProgress]);

  // Upload options for pet photos - use public bucket
  const uploadOptions: UploadOptions = {
    folder: "pets/photos",
    resize: {
      width: 1024,
      height: 1024,
      quality: 0.8,
    },
    compress: true,
    usePublicBucket: true, // Use public bucket for pet photos
  };

  const handleNext = useCallback(() => {
    if (existingPhoto?.success) {
      nextStep();
      navigation.navigate("PetSex");
    }
  }, [existingPhoto, navigation, nextStep]);

  const handleBack = useCallback(() => {
    previousStep();
    navigation.goBack();
  }, [navigation, previousStep]);

  const handleImageSelection = useCallback(
    async (source: "camera" | "library") => {
      try {
        setIsProcessing(true);
        clearError();
        setUploadingFileId(null);

        // Pick image based on source
        const mediaFile: MediaFile | null =
          source === "camera"
            ? await pickImageFromCamera(uploadOptions)
            : await pickImage(uploadOptions);

        if (!mediaFile) {
          setIsProcessing(false);
          return; // User cancelled
        }

        setUploadingFileId(mediaFile.id);

        // Upload the selected file
        const uploadResult = await uploadFile(mediaFile, uploadOptions);

        if (uploadResult.success) {
          // Store the upload result in the pet registration store
          setPetPhoto(uploadResult);
        } else {
          Alert.alert(
            "Upload Failed",
            uploadResult.error || "Failed to upload photo. Please try again.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again.",
          [{ text: "OK" }]
        );
      } finally {
        setIsProcessing(false);
        setUploadingFileId(null);
      }
    },
    [
      pickImage,
      pickImageFromCamera,
      uploadFile,
      uploadOptions,
      setPetPhoto,
      clearError,
    ]
  );

  const handleTakePhoto = useCallback(() => {
    handleImageSelection("camera");
  }, [handleImageSelection]);

  const handleAddFromLibrary = useCallback(() => {
    handleImageSelection("library");
  }, [handleImageSelection]);

  const handleRetakePhoto = useCallback(() => {
    Alert.alert(
      "Replace Photo",
      "Would you like to take a new photo or choose from library?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: handleTakePhoto },
        { text: "Choose from Library", onPress: handleAddFromLibrary },
      ]
    );
  }, [handleTakePhoto, handleAddFromLibrary]);

  const handleRemovePhoto = useCallback(() => {
    Alert.alert("Remove Photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          clearPetPhoto();
        },
      },
    ]);
  }, [clearPetPhoto]);

  const hasValidPhoto = existingPhoto?.success && existingPhoto.publicUrl;
  const isDisabled = isUploading || isProcessing || !hasValidPhoto;
  const isLoadingState = isUploading || isProcessing || !!uploadingFileId;

  const renderPhotoUploadArea = () => {
    if (hasValidPhoto) {
      // Show uploaded photo state
      return (
        <TouchableOpacity
          onPress={handleRetakePhoto}
          className="relative aspect-square w-full max-w-[354px]"
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: existingPhoto.publicUrl }}
            className="h-full w-full rounded-xl bg-gray-200"
            resizeMode="cover"
            onError={() => {
              // If image fails to load, clear the photo state to show upload area again
              clearPetPhoto();
              Alert.alert(
                "Image Load Error",
                "The uploaded image could not be displayed. Please try uploading again.",
                [{ text: "OK" }]
              );
            }}
          />
          <TouchableOpacity
            onPress={handleRemovePhoto}
            className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-black/50"
          >
            <Close color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    if (isLoadingState) {
      // Show loading state
      return (
        <View className="h-full w-full justify-center px-4">
          <UploadProgressBar progress={uploadProgress} />
        </View>
      );
    }

    // Show initial upload state
    return (
      <View className="flex-1 items-center justify-center">
        <View className="items-center gap-2">
          <Text className="text-center text-lg font-bold text-zinc-800">
            Add a photo
          </Text>
          <Text className="text-center text-sm font-normal text-zinc-800">
            Take a photo or upload one from your library
          </Text>
        </View>

        <View className="items-center gap-6 pt-6">
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="h-10 w-full min-w-36 max-w-[480px] items-center justify-center rounded-xl bg-orange-100 px-4"
            disabled={isLoadingState}
          >
            <Text className="text-center text-sm font-bold text-zinc-800">
              Take photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddFromLibrary}
            className="h-10 min-w-36 max-w-[480px] items-center justify-center rounded-xl bg-orange-100 px-4"
            disabled={isLoadingState}
          >
            <Text className="text-center text-sm font-bold text-zinc-800">
              Add from library
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {uploadError && (
          <View className="mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2">
            <Text className="text-center text-sm text-red-600">
              {uploadError}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <PetRegistrationLayout
      title="Headphoto"
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TertiaryButton
              title="Back"
              onPress={handleBack}
              disabled={isLoadingState}
            />
          </View>
          <View className="flex-1">
            <SecondaryButton
              title="Next"
              onPress={handleNext}
              disabled={isDisabled}
            />
          </View>
        </View>
      }
    >
      <View className="my-4 w-full items-center justify-center">
        <View className="border-secondary h-[354px] w-[354px] items-center justify-center gap-6 rounded-xl border-2 border-dashed border-[#D4DBE3]">
          <View className="w-full flex-1">{renderPhotoUploadArea()}</View>
        </View>
      </View>
    </PetRegistrationLayout>
  );
}
