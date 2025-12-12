'use client';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function GenerateButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAsUsed: false }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Code generated: ${data.code}`, {
          duration: 5000,
          position: 'top-right',
        });
      } else {
        toast.error(data.message || 'Failed to generate code');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? 'Generating...' : 'Generate Code'}
      </button>
      <Toaster />
    </>
  );
}
