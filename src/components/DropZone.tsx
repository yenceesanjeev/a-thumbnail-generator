import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (files: File[]) => void;
  isProcessing: boolean;
}

export function DropZone({ onFileSelect, isProcessing }: DropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/zip': ['.zip']
    },
    disabled: isProcessing,
    multiple: true,
    maxFiles: 5
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        flex flex-col items-center justify-center
        transition-colors duration-200
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
      `}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-600 text-center">
        {isDragActive
          ? "Drop the files here"
          : isProcessing
          ? "Processing..."
          : "Drag & drop up to 5 images or a ZIP file"}
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Supports: JPG, JPEG, PNG, ZIP (containing images)
      </p>
    </div>
  );
}