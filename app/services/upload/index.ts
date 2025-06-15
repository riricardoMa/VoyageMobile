import { SupabaseUploadService } from "./SupabaseUploadService";

// Export only what consumers need (ISP - Interface Segregation Principle)
export type {
  MediaFile,
  UploadOptions,
  UploadResult,
  UploadProgress,
  IUploadService,
} from "./types/UploadTypes";

export { useUpload, UploadProvider } from "./useUpload";

// Service factory for DIP (Dependency Inversion Principle)
export const createUploadService = (bucketName?: string) => {
  return new SupabaseUploadService(bucketName);
};
