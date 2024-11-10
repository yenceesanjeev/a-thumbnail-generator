import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'uploading' | 'processing' | 'generating' | 'error' | null;
  progress: number;
}

export function ProcessingStatus({ status, progress }: ProcessingStatusProps) {
  if (!status) return null;

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-4">
      {status === 'error' ? (
        <div className="text-red-500 text-center">
          An error occurred. Please try again with a different image or prompt.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-700">
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-500" />
              {status === 'uploading' ? 'Uploading files...' : 
               status === 'processing' ? 'Processing style...' : 
               'Generating image...'}
            </span>
            <span className="text-blue-600 font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}