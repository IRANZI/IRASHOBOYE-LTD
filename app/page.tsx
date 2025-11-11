"use client";
import CodeGeneratorUI from "@/components/code-generator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <CodeGeneratorUI />
      </main>
    </div>
  );
}
