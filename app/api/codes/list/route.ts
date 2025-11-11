import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

type GeneratedCode = {
  id: string;
  code: string;
  used: boolean;
  usedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const prisma = new PrismaClient();

interface CodeWithActions extends Omit<GeneratedCode, 'usedAt'> {
  actions: {
    print: string;
    copy: string;
    delete: string;
  };
}

export async function GET() {
  try {
    const codes = await prisma.generatedCode.findMany({
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
    });

    // Add action URLs to each code
    const codesWithActions: CodeWithActions[] = codes.map((code: GeneratedCode) => ({
      ...code,
      actions: {
        print: `/api/codes/${code.id}/actions`,
        copy: `/api/codes/${code.id}/actions`,
        delete: `/api/codes/${code.id}/actions`
      }
    }));

    return NextResponse.json({
      success: true,
      data: codesWithActions,
    });
  } catch (error) {
    console.error('Error fetching codes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch codes' },
      { status: 500 }
    );
  }
}
