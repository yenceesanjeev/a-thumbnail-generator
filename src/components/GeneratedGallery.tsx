import React from 'react';
import type { GeneratedImage } from '../types';

interface GeneratedGalleryProps {
  images: GeneratedImage[];
}

export function GeneratedGallery({ images }: GeneratedGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No generated images yet. Select a style and enter a prompt to generate images.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <img
            src={image.image_url}
            alt={image.prompt}
            className="w-full aspect-square object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
            <p className="text-white text-sm line-clamp-2">
              {image.prompt}
            </p>
            <p className="text-white/80 text-xs mt-1">
              {new Date(image.generated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}