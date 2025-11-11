import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const generateUniqueCode = () => {
  // Generate a random 6-character alphanumeric code
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export async function POST(request: Request) {
  const { markAsUsed = false } = await request.json().catch(() => ({}));
  let code: string;
  let isUnique = false;
  
  // Try up to 10 times to generate a unique code
  for (let i = 0; i < 10; i++) {
    code = `K${generateUniqueCode()}`;
    
    // Check if code already exists
    const existingCode = await prisma.generatedCode.findUnique({
      where: { code },
    });
    
    if (!existingCode) {
      // If code doesn't exist, create it
      const newCode = await prisma.generatedCode.create({
        data: {
          code,
          used: markAsUsed, // Mark as used if markAsUsed is true
        },
      });
      
      return NextResponse.json({
        success: true,
        code: newCode.code,
        message: 'Unique code generated successfully',
      });
    }
  }
  
  // If we couldn't generate a unique code after 10 attempts
  return NextResponse.json(
    { success: false, message: 'Failed to generate a unique code. Please try again.' },
    { status: 500 }
  );
}
