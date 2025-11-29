/**
 * Upload Service for Foundly App
 * Handles file uploads (images, documents, etc.)
 */

import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { UploadImageResponse } from '../types/api.types';
import { ApiError } from '../utils/api';
import { getAuthToken } from '../utils/storage';

/**
 * Upload single image
 */
export const uploadImage = async (imageUri: string): Promise<UploadImageResponse> => {
  try {
    // Create FormData
    const formData = new FormData();
    
    // Get file extension from URI
    const fileExtension = imageUri.split('.').pop() || 'jpg';
    const fileName = `upload_${Date.now()}.${fileExtension}`;
    
    // Append image to FormData
    formData.append('image', {
      uri: imageUri,
      type: `image/${fileExtension}`,
      name: fileName,
    } as any);

    // Get auth token
    const token = await getAuthToken();
    
    // Make upload request
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.upload.image}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData as any,
    });

    if (!response.ok) {
      const errorData: any = await response.json();
      throw new ApiError(
        errorData.error?.message || 'Image upload failed',
        response.status,
        errorData.error?.code
      );
    }

    const data = await response.json();
    return data as UploadImageResponse;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to upload image', 0, 'UPLOAD_ERROR');
  }
};

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (
  imageUris: string[]
): Promise<UploadImageResponse[]> => {
  try {
    // Upload images in parallel
    const uploadPromises = imageUris.map(uri => uploadImage(uri));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Upload image with progress tracking
 */
export const uploadImageWithProgress = async (
  imageUri: string,
  onProgress?: (progress: number) => void
): Promise<UploadImageResponse> => {
  try {
    // Create FormData
    const formData = new FormData();
    
    const fileExtension = imageUri.split('.').pop() || 'jpg';
    const fileName = `upload_${Date.now()}.${fileExtension}`;
    
    formData.append('image', {
      uri: imageUri,
      type: `image/${fileExtension}`,
      name: fileName,
    } as any);

    // Get auth token
    const token = await getAuthToken();
    
    // Create XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response as UploadImageResponse);
          } catch {
            reject(new ApiError('Invalid response from server', xhr.status));
          }
        } else {
          reject(new ApiError('Image upload failed', xhr.status));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new ApiError('Network error during upload', 0, 'NETWORK_ERROR'));
      });

      xhr.addEventListener('abort', () => {
        reject(new ApiError('Upload cancelled', 0, 'UPLOAD_CANCELLED'));
      });

      // Open and send request
      xhr.open('POST', `${API_BASE_URL}${API_ENDPOINTS.upload.image}`);
      xhr.setRequestHeader('Accept', 'application/json');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  } catch (error: any) {
    throw error;
  }
};
