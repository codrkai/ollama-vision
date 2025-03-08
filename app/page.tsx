'use client';

import { useState, useEffect } from 'react';
import ImageProcessor from '@/components/ImageProcessor';
import ModelSelect from '@/components/ModelSelect';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [processedResult, setProcessedResult] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);

  const handleProcessComplete = (result: string) => {
    setProcessedResult(result);
    const parsedResult = JSON.parse(result);
    setPreviewImage(parsedResult.images);
    setResponseData(parsedResult.response);
    setIsDialogOpen(true);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Ollama Vision</h1>
        
        <ModelSelect 
          value={selectedModel}
          onChange={setSelectedModel}
        />

        <ImageProcessor 
          selectedModel={selectedModel}
          onProcessComplete={handleProcessComplete}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>IMAGE</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              {previewImage && (
                <div className="relative w-full aspect-video max-w-md mx-auto overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={previewImage}
                    alt="Analyzed Image"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {responseData ? (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">RESPONSE</h3>
                  <p className="whitespace-pre-wrap">{responseData?.response || 'Processing...'}</p>
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
                  <p>Analyzing image...</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}