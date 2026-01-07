/**
 * Upload Service
 * Simple helper to upload images. For now it returns the original URI
 * as the uploaded URL so the UI can proceed without a backend.
 */

export interface UploadResult {
  success: boolean;
  data?: {
    url: string;
  };
  message?: string;
}

/**
 * Mock upload implementation — returns the local URI as the "uploaded" URL.
 * Replace with real upload logic (presigned URL, FormData + fetch, etc.) when backend is ready.
 */
export async function uploadImage(uri: string): Promise<UploadResult> {
  try {
    // In a real implementation you'd upload the file to a server or cloud storage
    // and return the publicly-accessible URL. For now return the local URI so
    // the app can display images and proceed during development.
    return {
      success: true,
      data: {
        url: uri,
      },
    };
  } catch (error) {
    console.error('uploadImage error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
