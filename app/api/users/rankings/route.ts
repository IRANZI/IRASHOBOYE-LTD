import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get users with their code usage count
    const users = await (prisma as any).user.findMany({
      include: {
        usages: {
          include: {
            code: true,
          },
        },
      },
    });

    // Sort by code count descending
    const rankings = users.sort((a: any, b: any) => b.usages.length - a.usages.length);

    // Transform data to include count and rank
    const rankingsWithCount = rankings.map((user: any, index: number) => ({
      rank: index + 1,
      id: user.id.toString(),
      name: user.name,
      phoneNumber: user.phoneNumber,
      codeCount: user.usages.length,
      codes: user.usages.map((usage: any) => ({
        code: usage.code.code,
        usedAt: usage.usedAt,
      })),
      createdAt: user.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: rankingsWithCount,
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}

