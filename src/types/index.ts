export interface ProcessedImage {
  id: number;
  original_filename: string;
  style_id: string;
  preview_url: string;
  processed_at: string;
}

export interface GeneratedImage {
  id: number;
  style_id: string;
  prompt: string;
  image_url: string;
  generated_at: string;
}

export interface ApiError {
  message: string;
  status: number;
}