export interface MediaFile {
  id: string;
  uri: string;
  type: "image" | "video";
  name: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number; // for videos in milliseconds
}

export interface UploadProgress {
  fileId: string;
  progress: number; // 0-100
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

export interface UploadOptions {
  folder?: string;
  resize?: {
    width: number;
    height: number;
    quality?: number; // 0-1
  };
  compress?: boolean;
  generateThumbnail?: boolean; // for videos
}

export interface UploadResult {
  success: boolean;
  fileId: string;
  filePath?: string; // Supabase storage path for backend retrieval
  publicUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

// Interface following ISP - only expose what consumers need
export interface IUploadService {
  pickImage(options?: UploadOptions): Promise<MediaFile | null>;
  pickVideo(options?: UploadOptions): Promise<MediaFile | null>;
  pickMedia(options?: UploadOptions): Promise<MediaFile | null>;
  uploadFile(file: MediaFile, options?: UploadOptions): Promise<UploadResult>;
  uploadMultiple(
    files: MediaFile[],
    options?: UploadOptions
  ): Promise<UploadResult[]>;
  deleteFile(fileId: string): Promise<boolean>;
  getUploadProgress(fileId: string): UploadProgress | null;
}

export interface IMediaProcessor {
  resizeImage(
    file: MediaFile,
    options: UploadOptions["resize"]
  ): Promise<MediaFile>;
  compressVideo(file: MediaFile): Promise<MediaFile>;
  generateThumbnail(videoFile: MediaFile): Promise<MediaFile>;
}
