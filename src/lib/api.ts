import axios, { AxiosError } from 'axios';
import type { ProcessedImage, GeneratedImage, ApiError } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // Increased timeout for file uploads
});

export async function uploadImages(files: File[]): Promise<ProcessedImage> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post<ProcessedImage>('/process-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to upload images'
    );
  }
}

export async function generateImage(styleId: string, prompt: string): Promise<GeneratedImage> {
  try {
    const response = await api.post<GeneratedImage>('/generate-image', {
      style_id: styleId,
      prompt,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to generate image'
    );
  }
}

export async function getStyles(): Promise<ProcessedImage[]> {
  try {
    const response = await api.get<ProcessedImage[]>('/styles');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch styles'
    );
  }
}

export async function getGeneratedImages(): Promise<GeneratedImage[]> {
  try {
    const response = await api.get<GeneratedImage[]>('/generated');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch generated images'
    );
  }
}