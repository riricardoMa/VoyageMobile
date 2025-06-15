import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useUpload } from "@services/upload";

// For testing purposes only
export const MediaUploadScreen: React.FC = () => {
  const {
    pickImage,
    pickVideo,
    pickMedia,
    uploadFile,
    uploadMultiple,
    isUploading,
    recentUploads,
    error,
    clearError,
    uploadProgress,
  } = useUpload();

  const handleImageUpload = async () => {
    try {
      const image = await pickImage({
        resize: { width: 800, height: 600, quality: 0.8 },
        folder: "profile-images",
      });

      if (image) {
        const result = await uploadFile(image);
        if (result.success) {
          Alert.alert(
            "Success",
            `Image uploaded successfully!\n${result.publicUrl}`
          );
        } else {
          Alert.alert("Error", result.error || "Upload failed");
        }
      }
    } catch (uploadError) {
      Alert.alert("Error", "Failed to upload image");
    }
  };

  const handleVideoUpload = async () => {
    try {
      const video = await pickVideo({
        compress: true,
        generateThumbnail: true,
        folder: "videos",
      });

      if (video) {
        const result = await uploadFile(video);
        if (result.success) {
          Alert.alert(
            "Success",
            `Video uploaded successfully!\nVideo: ${result.publicUrl}\nThumbnail: ${result.thumbnailUrl || "Not generated"}`
          );
        } else {
          Alert.alert("Error", result.error || "Upload failed");
        }
      }
    } catch (uploadError) {
      Alert.alert("Error", "Failed to upload video");
    }
  };

  const handleMediaUpload = async () => {
    try {
      const media = await pickMedia({
        resize: { width: 1200, height: 900, quality: 0.9 },
        compress: true,
        generateThumbnail: true,
        folder: "mixed-media",
      });

      if (media) {
        const result = await uploadFile(media);
        if (result.success) {
          Alert.alert("Success", `${media.type} uploaded successfully!`);
        } else {
          Alert.alert("Error", result.error || "Upload failed");
        }
      }
    } catch (uploadError) {
      Alert.alert("Error", "Failed to upload media");
    }
  };

  const handleMultipleUpload = async () => {
    try {
      // For demo purposes, we'll pick multiple images
      const files = [];

      for (let i = 0; i < 2; i++) {
        const media = await pickMedia({
          folder: "batch-upload",
        });
        if (media) {
          files.push(media);
        }
      }

      if (files.length > 0) {
        const results = await uploadMultiple(files);
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        Alert.alert(
          "Batch Upload Complete",
          `Successful: ${successful}\nFailed: ${failed}`
        );
      }
    } catch (uploadError) {
      Alert.alert("Error", "Failed to upload multiple files");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800">
          Media Upload Demo
        </Text>

        {/* Upload Buttons */}
        <View className="mb-6 space-y-4">
          <TouchableOpacity
            onPress={handleImageUpload}
            disabled={isUploading}
            className={`rounded-lg p-4 ${isUploading ? "bg-gray-400" : "bg-blue-500"}`}
          >
            <Text className="text-center font-semibold text-white">
              {isUploading ? "Uploading..." : "📸 Upload Image"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleVideoUpload}
            disabled={isUploading}
            className={`rounded-lg p-4 ${isUploading ? "bg-gray-400" : "bg-green-500"}`}
          >
            <Text className="text-center font-semibold text-white">
              {isUploading ? "Uploading..." : "🎥 Upload Video"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMediaUpload}
            disabled={isUploading}
            className={`rounded-lg p-4 ${isUploading ? "bg-gray-400" : "bg-purple-500"}`}
          >
            <Text className="text-center font-semibold text-white">
              {isUploading ? "Uploading..." : "🎭 Upload Media (Image/Video)"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMultipleUpload}
            disabled={isUploading}
            className={`rounded-lg p-4 ${isUploading ? "bg-gray-400" : "bg-orange-500"}`}
          >
            <Text className="text-center font-semibold text-white">
              {isUploading ? "Uploading..." : "📚 Batch Upload"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Display */}
        {error && (
          <View className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-red-700">{error}</Text>
              <TouchableOpacity onPress={clearError}>
                <Text className="font-bold text-red-700">✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Upload Progress */}
        {uploadProgress.size > 0 && (
          <View className="mb-6">
            <Text className="mb-2 text-lg font-semibold text-gray-800">
              Upload Progress:
            </Text>
            {Array.from(uploadProgress.entries()).map(([fileId, progress]) => (
              <View key={fileId} className="mb-2">
                <View className="mb-1 flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">
                    {fileId.substring(0, 20)}...
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {progress.progress}%
                  </Text>
                </View>
                <View className="h-2 rounded-full bg-gray-200">
                  <View
                    className={`h-2 rounded-full ${
                      progress.status === "completed"
                        ? "bg-green-500"
                        : progress.status === "error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                    }`}
                    style={{ width: `${progress.progress}%` }}
                  />
                </View>
                {progress.error && (
                  <Text className="mt-1 text-xs text-red-500">
                    {progress.error}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Recent Uploads */}
        {recentUploads.length > 0 && (
          <View>
            <Text className="mb-4 text-lg font-semibold text-gray-800">
              Recent Uploads:
            </Text>
            {recentUploads.map((upload, index) => (
              <View
                key={upload.fileId}
                className="mb-2 rounded-lg bg-white p-4 shadow-sm"
              >
                <View className="mb-2 flex-row items-center">
                  <Text className="mr-2 text-lg">
                    {upload.success ? "✅" : "❌"}
                  </Text>
                  <Text className="flex-1 font-medium text-gray-800">
                    Upload #{index + 1}
                  </Text>
                </View>

                <Text className="mb-1 text-xs text-gray-500">
                  File ID: {upload.fileId}
                </Text>

                {upload.publicUrl && (
                  <Text
                    className="mb-1 text-xs text-blue-600"
                    numberOfLines={2}
                  >
                    URL: {upload.publicUrl}
                  </Text>
                )}

                {upload.thumbnailUrl && (
                  <Text
                    className="mb-1 text-xs text-green-600"
                    numberOfLines={2}
                  >
                    Thumbnail: {upload.thumbnailUrl}
                  </Text>
                )}

                {upload.error && (
                  <Text className="text-xs text-red-500">
                    Error: {upload.error}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
