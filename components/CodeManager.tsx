'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';

interface Code {
  id: string;
  code: string;
  used: boolean;
  createdAt: string;
  updatedAt: string;
  actions: {
    print: string;
    copy: string;
    delete: string;
  };
}

export default function CodeManager() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/codes/list');
      const { data } = await response.json();
      setCodes(data);
    } catch (error) {
      console.error('Error fetching codes:', error);
      toast.error('Failed to load codes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleDelete = async (codeId: string) => {
    if (!confirm('Are you sure you want to delete this code?')) return;
    
    try {
      const response = await fetch(`/api/codes/${codeId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete' }),
      });
      const result = await response.json();

      if (result.success) {
        alert('Code deleted successfully');
        setCodes(codes.filter(code => code.id !== codeId));
      } else {
        throw new Error(result.message || 'Failed to delete code');
      }
    } catch (error) {
      console.error('Error deleting code:', error);
      alert('Failed to delete code');
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard: ' + code);
  };

  const handlePrint = async (codeId: string, code: string) => {
    if (!confirm('Mark this code as used?')) return;
    
    try {
      const response = await fetch(`/api/codes/${codeId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'print' }),
      });
      const result = await response.json();

      if (result.success) {
        alert('Code marked as used: ' + code);
        fetchCodes(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to update code status');
      }
    } catch (error) {
      console.error('Error updating code status:', error);
      alert('Failed to update code status');
    }
  };

  if (isLoading) {
    return <div>Loading codes...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Manage Codes</h2>
      {codes.length === 0 ? (
        <p>No codes found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id} className="border-t">
                  <td className="px-4 py-2 font-mono">{code.code}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${code.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {code.used ? 'Used' : 'Available'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(code.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrint(code.id, code.code)}
                      disabled={code.used}
                      className="mr-2"
                    >
                      {code.used ? 'Used' : 'Mark as Used'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(code.code)}
                      className="mr-2"
                    >
                      Copy
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(code.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
