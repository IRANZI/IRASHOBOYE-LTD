"use client";

import { useEffect, useState } from 'react';

export default function CodeOnlyPage() {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateCode = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/generate-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to generate code');
        }

        const code = await response.text();
        setCode(code);
        
        // Auto-print after a short delay to ensure content is rendered
        setTimeout(() => {
          window.print();
        }, 500);
      } catch (err) {
        setError('Failed to generate code. Please try again.');
        console.error('Error generating code:', err);
      } finally {
        setIsLoading(false);
      }
    };

    generateCode();
  }, []);

  // Add print-specific styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-code, .print-code * {
          visibility: visible;
        }
        .print-code {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48pt;
          font-weight: bold;
          text-align: center;
        }
        @page {
          size: auto;
          margin: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Return cleanup function
    return () => {
      document.head.removeChild(style);
      return undefined; // Explicitly return undefined to match EffectCallback type
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="print-code">
      {code}
    </div>
  );
}
