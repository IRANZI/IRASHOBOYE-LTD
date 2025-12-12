import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { triggerUpdate } from '../codes/updates/route';

// Initialize Prisma Client
const prisma = new PrismaClient();

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { markAsUsed = false } = await request.json().catch(() => ({}));
    let newCodeValue = '';
    let newCode;

    // Try up to 10 times to avoid duplicate codes
    for (let i = 0; i < 10; i++) {
      newCodeValue = generateSixDigitCode();
      try {
        newCode = await prisma.generatedCode.create({
          data: { code: newCodeValue, used: markAsUsed },
        });
        break; // Success
      } catch (error: any) {
        if (error.code === 'P2002') continue; // Duplicate, try again
        throw error;
      }
    }

    if (!newCode) {
      return NextResponse.json(
        { success: false, message: 'Failed to generate a unique code. Please try again.' },
        { status: 500 }
      );
    }

    // Trigger real-time updates
    triggerUpdate();

    return NextResponse.json({
      success: true,
      message: 'Code generated successfully!',
      code: newCode.code
    });

  } catch (error) {
    console.error('Error in generate-code endpoint:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client when done
    await prisma.$disconnect();
  }
}
