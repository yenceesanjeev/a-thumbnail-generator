import React from 'react';
import type { ProcessedImage } from '../types';

interface ImageGalleryProps {
  images: ProcessedImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No processed images yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <img
            src={image.thumbnail_url}
            alt={image.original_filename}
            className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
            <p className="text-white text-sm truncate">
              {image.original_filename}
            </p>
            <p className="text-white/80 text-xs">
              {new Date(image.processed_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}