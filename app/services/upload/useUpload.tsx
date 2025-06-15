import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type PropsWithChildren,
} from "react";
import { SupabaseUploadService } from "./SupabaseUploadService";
import type {
  IUploadService,
  MediaFile,
  UploadOptions,
  UploadResult,
  UploadProgress,
} from "./types/UploadTypes";

interface UploadContextType {
  // File picking methods
  pickImage: (options?: UploadOptions) => Promise<MediaFile | null>;
  pickVideo: (options?: UploadOptions) => Promise<MediaFile | null>;
  pickMedia: (options?: UploadOptions) => Promise<MediaFile | null>;

  // Upload methods
  uploadFile: (
    file: MediaFile,
    options?: UploadOptions
  ) => Promise<UploadResult>;
  uploadMultiple: (
    files: MediaFile[],
    options?: UploadOptions
  ) => Promise<UploadResult[]>;

  // Management methods
  deleteFile: (fileId: string) => Promise<boolean>;

  // State
  isUploading: boolean;
  uploadProgress: Map<string, UploadProgress>;
  recentUploads: UploadResult[];
  error: string | null;

  // Utility methods
  clearError: () => void;
  getProgress: (fileId: string) => UploadProgress | null;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

interface UploadProviderProps extends PropsWithChildren {
  bucketName?: string;
}

export const UploadProvider = ({
  children,
  bucketName,
}: UploadProviderProps) => {
  const [uploadService] = useState<IUploadService>(
    () => new SupabaseUploadService(bucketName)
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<
    Map<string, UploadProgress>
  >(new Map());
  const [recentUploads, setRecentUploads] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const pickImage = useCallback(
    async (options?: UploadOptions) => {
      try {
        clearError();
        return await uploadService.pickImage(options);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error picking image";
        setError(errorMessage);
        return null;
      }
    },
    [uploadService, clearError]
  );

  const pickVideo = useCallback(
    async (options?: UploadOptions) => {
      try {
        clearError();
        return await uploadService.pickVideo(options);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error picking video";
        setError(errorMessage);
        return null;
      }
    },
    [uploadService, clearError]
  );

  const pickMedia = useCallback(
    async (options?: UploadOptions) => {
      try {
        clearError();
        return await uploadService.pickMedia(options);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error picking media";
        setError(errorMessage);
        return null;
      }
    },
    [uploadService, clearError]
  );

  const uploadFile = useCallback(
    async (file: MediaFile, options?: UploadOptions) => {
      try {
        clearError();
        setIsUploading(true);

        const result = await uploadService.uploadFile(file, options);

        if (result.success) {
          setRecentUploads(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 uploads
        } else {
          setError(result.error || "Upload failed");
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload error";
        setError(errorMessage);
        return {
          success: false,
          fileId: file.id,
          error: errorMessage,
        };
      } finally {
        setIsUploading(false);
      }
    },
    [uploadService, clearError]
  );

  const uploadMultiple = useCallback(
    async (files: MediaFile[], options?: UploadOptions) => {
      try {
        clearError();
        setIsUploading(true);

        const results = await uploadService.uploadMultiple(files, options);

        const successfulUploads = results.filter(r => r.success);
        if (successfulUploads.length > 0) {
          setRecentUploads(prev =>
            [...successfulUploads, ...prev].slice(0, 10)
          );
        }

        const failedUploads = results.filter(r => !r.success);
        if (failedUploads.length > 0) {
          setError(`${failedUploads.length} uploads failed`);
        }

        return results;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Multiple upload error";
        setError(errorMessage);
        return files.map(file => ({
          success: false,
          fileId: file.id,
          error: errorMessage,
        }));
      } finally {
        setIsUploading(false);
      }
    },
    [uploadService, clearError]
  );

  const deleteFile = useCallback(
    async (fileId: string) => {
      try {
        clearError();
        const success = await uploadService.deleteFile(fileId);

        if (success) {
          // Remove from recent uploads
          setRecentUploads(prev =>
            prev.filter(upload => upload.fileId !== fileId)
          );
        } else {
          setError("Failed to delete file");
        }

        return success;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Delete error";
        setError(errorMessage);
        return false;
      }
    },
    [uploadService, clearError]
  );

  const getProgress = useCallback(
    (fileId: string) => {
      return uploadService.getUploadProgress(fileId);
    },
    [uploadService]
  );

  // Update progress state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // This would be more efficient with event listeners in a real implementation
      const newProgress = new Map<string, UploadProgress>();

      // Get progress for files currently being tracked
      uploadProgress.forEach((_, fileId) => {
        const progress = uploadService.getUploadProgress(fileId);
        if (progress) {
          newProgress.set(fileId, progress);
        }
      });

      setUploadProgress(newProgress);
    }, 500);

    return () => clearInterval(interval);
  }, [uploadService, uploadProgress]);

  return (
    <UploadContext.Provider
      value={{
        pickImage,
        pickVideo,
        pickMedia,
        uploadFile,
        uploadMultiple,
        deleteFile,
        isUploading,
        uploadProgress,
        recentUploads,
        error,
        clearError,
        getProgress,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
}
