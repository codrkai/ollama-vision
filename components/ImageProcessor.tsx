'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ImageProcessorProps {
  onProcessComplete: (result: string) => void;
  selectedModel: string;
}

export default function ImageProcessor({ onProcessComplete, selectedModel }: ImageProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      // First, show the image immediately
      const initialResult = JSON.stringify({
        images: reader.result,
        response: null
      });
      onProcessComplete(initialResult);
      
      // Then process the image
      setIsProcessing(true);
      try {
        const base64String = (reader.result as string).split(',')[1];
          
        const response = await axios.post(process.env.NEXT_PUBLIC_OLLAMA_URL + '/api/generate', {
          model: selectedModel,
          prompt: "what is in this image?",
          stream: false,
          images: [base64String]
        });

        const result = JSON.stringify({
          images: reader.result,
          response: response.data
        });
          
        onProcessComplete(result);
      } catch (error) {
        console.error('Error calling Ollama API:', error);
        alert('Failed to process image. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  }, [selectedModel, onProcessComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-base-200' : 'border-base-300 hover:border-primary'}
          ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg">Processing image...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-base-content opacity-50" />
              {isDragActive ? (
                <p className="text-lg">Drop the image here...</p>
              ) : (
                <p className="text-lg">Drag & drop an image here, or click to select</p>
              )}
              <p className="text-sm text-base-content/70">
                Supports: PNG, JPG, JPEG, GIF
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}