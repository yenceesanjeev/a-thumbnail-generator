import React from 'react';
import type { ProcessedImage } from '../types';

interface StyleGalleryProps {
  styles: ProcessedImage[];
  selectedStyleId: string | null;
  onStyleSelect: (styleId: string) => void;
}

export function StyleGallery({ styles, selectedStyleId, onStyleSelect }: StyleGalleryProps) {
  if (styles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No styles available. Upload an image to create a style.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {styles.map((style) => (
        <div
          key={style.id}
          className={`relative cursor-pointer group ${
            selectedStyleId === style.style_id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onStyleSelect(style.style_id)}
        >
          <img
            src={style.preview_url}
            alt={style.original_filename}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <p className="text-white text-sm px-2 text-center">
              {style.original_filename}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}