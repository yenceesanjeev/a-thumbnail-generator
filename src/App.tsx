import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import { DropZone } from './components/DropZone';
import { ImagePreview } from './components/ImagePreview';
import { ProcessingStatus } from './components/ProcessingStatus';
import { StyleGallery } from './components/StyleGallery';
import { GenerateForm } from './components/GenerateForm';
import { GeneratedGallery } from './components/GeneratedGallery';
import { uploadImages, generateImage, getStyles, getGeneratedImages } from './lib/api';
import type { ProcessedImage, GeneratedImage } from './types';

export function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'uploading' | 'processing' | 'generating' | 'error' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [styles, setStyles] = useState<ProcessedImage[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [stylesData, generatedData] = await Promise.all([
        getStyles(),
        getGeneratedImages()
      ]);
      setStyles(stylesData);
      setGeneratedImages(generatedData);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleFileSelect = async (files: File[]) => {
    if (files.length > 5) {
      setError('Maximum 5 files allowed');
      return;
    }

    setSelectedFiles(files);
    setStatus('uploading');
    setUploadProgress(0);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 500);

      const result = await uploadImages(files);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setStatus('processing');
      
      setStyles(prev => [result, ...prev]);
      setSelectedStyleId(result.style_id);
      setStatus(null);
      setSelectedFiles([]);
    } catch (error) {
      setStatus('error');
      setError((error as Error).message);
    }
  };

  const handleGenerate = async (prompt: string) => {
    if (!selectedStyleId) {
      setError('Please select a style first');
      return;
    }

    setStatus('generating');
    setError(null);

    try {
      const result = await generateImage(selectedStyleId, prompt);
      setGeneratedImages(prev => [result, ...prev]);
      setStatus(null);
    } catch (error) {
      setStatus('error');
      setError((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <ImageIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Image Generator
          </h1>
          <p className="text-lg text-gray-600">
            Upload images to create a style, then generate new images with text prompts
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <DropZone
            onFileSelect={handleFileSelect}
            isProcessing={status !== null}
          />

          <div className="flex flex-col items-center space-y-6">
            <ProcessingStatus
              status={status}
              progress={uploadProgress}
            />

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                {selectedFiles.map((file, index) => (
                  <ImagePreview
                    key={index}
                    file={file}
                    onRemove={() => {
                      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                      if (selectedFiles.length === 1) {
                        setStatus(null);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Available Styles</h2>
            <StyleGallery
              styles={styles}
              selectedStyleId={selectedStyleId}
              onStyleSelect={setSelectedStyleId}
            />
          </div>

          {selectedStyleId && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Generate Images</h2>
              <GenerateForm
                onGenerate={handleGenerate}
                isGenerating={status === 'generating'}
              />
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Generated Images</h2>
            <GeneratedGallery images={generatedImages} />
          </div>
        </div>
      </div>
    </div>
  );
}