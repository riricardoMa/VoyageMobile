import * as FileSystem from "expo-file-system";
import * as VideoThumbnails from "expo-video-thumbnails";
import type {
  IMediaProcessor,
  MediaFile,
  UploadOptions,
} from "../types/UploadTypes";

/**
 * Media processing utilities following SRP
 * Handles only media processing operations
 */
export class MediaProcessor implements IMediaProcessor {
  async resizeImage(
    file: MediaFile,
    options: UploadOptions["resize"]
  ): Promise<MediaFile> {
    if (!options || file.type !== "image") return file;

    try {
      // Using Expo ImageManipulator for resizing
      const { ImageManipulator } = await import("expo-image-manipulator");

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        file.uri,
        [{ resize: { width: options.width, height: options.height } }],
        {
          compress: options.quality || 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const fileInfo = await FileSystem.getInfoAsync(manipulatedImage.uri);

      return {
        ...file,
        uri: manipulatedImage.uri,
        size:
          fileInfo.exists && !fileInfo.isDirectory ? fileInfo.size : file.size,
        width: manipulatedImage.width,
        height: manipulatedImage.height,
      };
    } catch (error) {
      console.error("Error resizing image:", error);
      return file;
    }
  }

  /**
   * TODO
   * @param file
   * @returns
   */
  async compressVideo(file: MediaFile): Promise<MediaFile> {
    if (file.type !== "video") return file;

    try {
      // Video compression not yet implemented
      // This is a placeholder - actual implementation would depend on requirements
      console.log("Video compression not yet implemented");
      return file;
    } catch (error) {
      console.error("Error compressing video:", error);
      return file;
    }
  }

  async generateThumbnail(videoFile: MediaFile): Promise<MediaFile> {
    if (videoFile.type !== "video") throw new Error("File must be a video");

    try {
      // Using Expo VideoThumbnails to generate thumbnail
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoFile.uri, {
        time: 1000, // 1 second into the video
      });

      const fileInfo = await FileSystem.getInfoAsync(uri);

      return {
        id: `${videoFile.id}_thumbnail`,
        uri,
        type: "image",
        name: `${videoFile.name}_thumbnail.jpg`,
        size: fileInfo.exists && !fileInfo.isDirectory ? fileInfo.size : 0,
        mimeType: "image/jpeg",
      };
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      throw error;
    }
  }
}
