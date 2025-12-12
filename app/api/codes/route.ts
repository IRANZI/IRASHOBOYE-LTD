import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const codes = await prisma.generatedCode.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializedCodes = codes.map(code => ({
      ...code,
      id: code.id.toString(), // Convert BigInt to string
    }));

    return NextResponse.json(serializedCodes);
  } catch (error) {
    console.error('Error fetching codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch codes' },
      { status: 500 }
    );
  }
}
