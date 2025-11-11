import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const codes = await prisma.generatedCode.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error('Error fetching codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch codes' },
      { status: 500 }
    );
  }
}
