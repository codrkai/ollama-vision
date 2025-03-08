'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface ModelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ModelSelect({ value, onChange }: ModelSelectProps) {
  const [models, setModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_OLLAMA_URL + '/api/tags');
        const availableModels = response.data.models.map((model:any) => model.name);
        setModels(availableModels);
        
        // Set default value if current value is not in the list
        if (availableModels.length > 0 && !availableModels.includes(value)) {
          onChange(availableModels[0]);
        }
      } catch (err) {
        setError('Failed to fetch available models');
        console.error('Error fetching models:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [value, onChange]);

  if (isLoading) {
    return (
      <div className="form-control w-full max-w-md mx-auto">
        <label className="label">
          <span className="label-text">Loading models...</span>
        </label>
        <select className="select select-bordered w-full" disabled>
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-control w-full max-w-md mx-auto">
        <label className="label">
          <span className="label-text text-error">{error}</span>
        </label>
        <select className="select select-bordered w-full select-error" disabled>
          <option>Error loading models</option>
        </select>
      </div>
    );
  }

  return (
    <div className="form-control w-full max-w-md mx-auto">
      <label className="label">
        <span className="label-text">Select Model</span>
      </label>
      <select 
        className="select select-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {models.length > 0 ? (
          models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))
        ) : (
          <option disabled>
            No models available
          </option>
        )}
      </select>
    </div>
  );
}