import { NextResponse } from 'next/server';
import { EventEmitter } from 'stream';
import { prisma } from '@/lib/prisma';

// Create a simple event emitter for real-time updates
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(100); // Increase max listeners

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  
  // Send initial data
  const sendUpdate = async () => {
    try {
      const codes = await prisma.generatedCode.findMany({
        orderBy: { createdAt: 'desc' },
      });
      // Convert BigInt to string for serialization
      const serializedCodes = codes.map(code => ({
        ...code,
        id: code.id.toString(),
      }));
      const data = JSON.stringify(serializedCodes);
      await writer.write(encoder.encode(`data: ${data}\n\n`));
    } catch (error) {
      console.error('Error sending update:', error);
    }
  };

  // Send initial data
  await sendUpdate();

  // Listen for updates
  const onUpdate = async () => {
    await sendUpdate();
  };

  eventEmitter.on('update', onUpdate);

  // Clean up
  const cleanup = () => {
    eventEmitter.off('update', onUpdate);
    writer.close();
  };

  // Handle client disconnection
  const onClose = () => cleanup();
  const onError = () => cleanup();

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Export a function to trigger updates
export function triggerUpdate() {
  eventEmitter.emit('update');
}
