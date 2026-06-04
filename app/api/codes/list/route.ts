import { NextResponse } from 'next/server';
import type { GeneratedCode } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface CodeWithActions extends Omit<GeneratedCode, 'id'> {
  id: string;
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

    const codesWithActions: CodeWithActions[] = codes.map((code) => ({
      ...code,
      id: code.id.toString(),
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
