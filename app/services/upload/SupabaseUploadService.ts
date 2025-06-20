import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "@services/auth/supabase";
import type {
  IUploadService,
  MediaFile,
  UploadOptions,
  UploadResult,
  UploadProgress,
} from "./types/UploadTypes";
import { MediaProcessor } from "./utils/MediaProcessor";

/**
 * Supabase implementation of upload service
 * Follows DIP - depends on abstractions (interfaces)
 * Follows SRP - handles only upload operations
 */
export class SupabaseUploadService implements IUploadService {
  private mediaProcessor: MediaProcessor;
  private uploadProgress: Map<string, UploadProgress>;
  private readonly privateBucketName: string;
  private readonly publicBucketName: string;

  constructor(
    privateBucketName: string = "media",
    publicBucketName: string = "media-public"
  ) {
    this.mediaProcessor = new MediaProcessor();
    this.uploadProgress = new Map();
    this.privateBucketName = privateBucketName;
    this.publicBucketName = publicBucketName;
  }

  // Helper method to get the correct bucket name
  private getBucketName(usePublicBucket?: boolean): string {
    return usePublicBucket ? this.publicBucketName : this.privateBucketName;
  }

  async pickImage(options?: UploadOptions): Promise<MediaFile | null> {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Media library permission denied");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets[0]) return null;

      const asset = result.assets[0];
      let mediaFile: MediaFile = {
        id: this.generateFileId(),
        uri: asset.uri,
        type: "image",
        name: asset.fileName || `image_${Date.now()}.jpg`,
        size: asset.fileSize || 0,
        mimeType: asset.mimeType || "image/jpeg",
        width: asset.width,
        height: asset.height,
      };

      // Process image if options provided
      if (options?.resize) {
        mediaFile = await this.mediaProcessor.resizeImage(
          mediaFile,
          options.resize
        );
      }

      return mediaFile;
    } catch (error) {
      console.error("Error picking image:", error);
      throw error;
    }
  }

  async pickImageFromCamera(
    options?: UploadOptions
  ): Promise<MediaFile | null> {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Camera permission denied");
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets[0]) return null;

      const asset = result.assets[0];
      let mediaFile: MediaFile = {
        id: this.generateFileId(),
        uri: asset.uri,
        type: "image",
        name: asset.fileName || `camera_image_${Date.now()}.jpg`,
        size: asset.fileSize || 0,
        mimeType: asset.mimeType || "image/jpeg",
        width: asset.width,
        height: asset.height,
      };

      // Process image if options provided
      if (options?.resize) {
        mediaFile = await this.mediaProcessor.resizeImage(
          mediaFile,
          options.resize
        );
      }

      return mediaFile;
    } catch (error) {
      console.error("Error taking photo:", error);
      throw error;
    }
  }

  async pickVideo(options?: UploadOptions): Promise<MediaFile | null> {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Media library permission denied");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets[0]) return null;

      const asset = result.assets[0];
      let mediaFile: MediaFile = {
        id: this.generateFileId(),
        uri: asset.uri,
        type: "video",
        name: asset.fileName || `video_${Date.now()}.mp4`,
        size: asset.fileSize || 0,
        mimeType: asset.mimeType || "video/mp4",
        width: asset.width,
        height: asset.height,
        duration: asset.duration || undefined,
      };

      // Compress video if needed
      if (options?.compress) {
        mediaFile = await this.mediaProcessor.compressVideo(mediaFile);
      }

      return mediaFile;
    } catch (error) {
      console.error("Error picking video:", error);
      throw error;
    }
  }

  async pickMedia(options?: UploadOptions): Promise<MediaFile | null> {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Media library permission denied");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets[0]) return null;

      const asset = result.assets[0];
      const isVideo = asset.type === "video";

      let mediaFile: MediaFile = {
        id: this.generateFileId(),
        uri: asset.uri,
        type: isVideo ? "video" : "image",
        name:
          asset.fileName ||
          `${isVideo ? "video" : "image"}_${Date.now()}.${isVideo ? "mp4" : "jpg"}`,
        size: asset.fileSize || 0,
        mimeType: asset.mimeType || (isVideo ? "video/mp4" : "image/jpeg"),
        width: asset.width,
        height: asset.height,
        duration: asset.duration || undefined,
      };

      // Process media based on type and options
      if (!isVideo && options?.resize) {
        mediaFile = await this.mediaProcessor.resizeImage(
          mediaFile,
          options.resize
        );
      } else if (isVideo && options?.compress) {
        mediaFile = await this.mediaProcessor.compressVideo(mediaFile);
      }

      return mediaFile;
    } catch (error) {
      console.error("Error picking media:", error);
      throw error;
    }
  }

  async uploadFile(
    file: MediaFile,
    options?: UploadOptions
  ): Promise<UploadResult> {
    try {
      // Initialize progress tracking
      this.updateProgress(file.id, { progress: 0, status: "pending" });

      // Generate file path
      const folder = options?.folder || "uploads";
      const fileName = `${folder}/${file.id}_${file.name}`;

      // Determine which bucket to use
      const bucketName = this.getBucketName(options?.usePublicBucket);

      console.log(
        `📤 Uploading to ${options?.usePublicBucket ? "PUBLIC" : "PRIVATE"} bucket: ${bucketName}`
      );

      // Read file as base64 for React Native
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer for Supabase
      const arrayBuffer = this.base64ToArrayBuffer(base64);

      this.updateProgress(file.id, { progress: 25, status: "uploading" });

      // Upload to Supabase Storage using ArrayBuffer
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, arrayBuffer, {
          contentType: file.mimeType,
          upsert: true, // Allow overwrites
        });

      if (error) {
        console.error("Supabase upload error:", error);
        this.updateProgress(file.id, {
          progress: 0,
          status: "error",
          error: error.message,
        });
        return {
          success: false,
          fileId: file.id,
          error: error.message,
        };
      }

      this.updateProgress(file.id, { progress: 75, status: "uploading" });

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      let thumbnailUrl: string | undefined;

      // Generate and upload thumbnail for videos if requested
      if (file.type === "video" && options?.generateThumbnail) {
        try {
          const thumbnail = await this.mediaProcessor.generateThumbnail(file);
          const thumbnailResult = await this.uploadFile(thumbnail, {
            folder: `${folder}/thumbnails`,
            usePublicBucket: options.usePublicBucket, // Use same bucket for thumbnails
          });
          if (thumbnailResult.success) {
            thumbnailUrl = thumbnailResult.publicUrl;
          }
        } catch (thumbnailError) {
          console.warn("Failed to generate thumbnail:", thumbnailError);
        }
      }

      this.updateProgress(file.id, { progress: 100, status: "completed" });

      return {
        success: true,
        fileId: file.id,
        filePath: fileName,
        publicUrl: urlData.publicUrl,
        thumbnailUrl,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Upload failed:", error);
      this.updateProgress(file.id, {
        progress: 0,
        status: "error",
        error: errorMessage,
      });

      return {
        success: false,
        fileId: file.id,
        error: errorMessage,
      };
    }
  }

  async uploadMultiple(
    files: MediaFile[],
    options?: UploadOptions
  ): Promise<UploadResult[]> {
    // Upload files in parallel for better performance
    const uploadPromises = files.map(file => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  async deleteFile(
    fileId: string,
    options?: { usePublicBucket?: boolean }
  ): Promise<boolean> {
    try {
      const bucketName = this.getBucketName(options?.usePublicBucket);

      // Find the file path - this would need to be stored or tracked
      // For now, we'll assume the file path follows our naming convention
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list("uploads", {
          search: fileId,
        });

      if (error || !data || data.length === 0) {
        return false;
      }

      const filePath = `uploads/${data[0]?.name ?? "Unknown"}`;
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      return !deleteError;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  getUploadProgress(fileId: string): UploadProgress | null {
    return this.uploadProgress.get(fileId) || null;
  }

  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateProgress(fileId: string, progress: Partial<UploadProgress>) {
    const current = this.uploadProgress.get(fileId) || {
      fileId,
      progress: 0,
      status: "pending" as const,
    };

    this.uploadProgress.set(fileId, { ...current, ...progress });
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }
}
