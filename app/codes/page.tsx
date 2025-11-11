import { Toaster } from 'react-hot-toast';
import CodeManager from '@/components/CodeManager';

export default function CodesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Code Management</h1>
      <CodeManager />
      <Toaster position="bottom-right" />
    </div>
  );
}
