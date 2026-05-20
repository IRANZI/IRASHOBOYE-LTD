import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name, phoneNumber } = await request.json();

    // Validate input
    if (!name || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    const codeId = Number(id);
    if (!Number.isInteger(codeId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid code ID format' },
        { status: 400 }
      );
    }

    // Check if code exists and is used
    const code = await prisma.generatedCode.findUnique({
      where: { id: codeId },
    });

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Code not found' },
        { status: 404 }
      );
    }

    if (!code.used) {
      return NextResponse.json(
        { success: false, message: 'Code must be marked as used before registering a user' },
        { status: 400 }
      );
    }

    // Find or create user by phone number
    let user = await (prisma as any).user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      user = await (prisma as any).user.create({
        data: {
          name,
          phoneNumber,
        },
      });
    } else {
      // Update name if it's different
      if (user.name !== name) {
        user = await (prisma as any).user.update({
          where: { id: user.id },
          data: { name },
        });
      }
    }

    // Check if this user already used this code
    const existingUsage = await (prisma as any).codeUsage.findUnique({
      where: {
        codeId_userId: {
          codeId,
          userId: user.id,
        },
      },
    });

    if (existingUsage) {
      return NextResponse.json({
        success: true,
        message: 'User already registered for this code',
        data: {
          user: {
            id: user.id.toString(),
            name: user.name,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          code: {
            id: code.id.toString(),
            code: code.code,
            used: code.used,
            usedAt: code.usedAt,
            createdAt: code.createdAt,
            updatedAt: code.updatedAt,
          },
        },
      });
    }

    // Create code usage record
    const usage = await (prisma as any).codeUsage.create({
      data: {
        codeId,
        userId: user.id,
      },
      include: {
        user: true,
        code: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        usage: {
          id: usage.id.toString(),
          codeId: usage.codeId.toString(),
          userId: usage.userId.toString(),
          usedAt: usage.usedAt,
        },
        user: {
          id: usage.user.id.toString(),
          name: usage.user.name,
          phoneNumber: usage.user.phoneNumber,
          createdAt: usage.user.createdAt,
          updatedAt: usage.user.updatedAt,
        },
        code: {
          id: usage.code.id.toString(),
          code: usage.code.code,
          used: usage.code.used,
          usedAt: usage.code.usedAt,
          createdAt: usage.code.createdAt,
          updatedAt: usage.code.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register user' },
      { status: 500 }
    );
  }
}

