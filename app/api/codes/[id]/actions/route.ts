import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  console.log('Received request to /api/codes/[id]/actions with id:', id);
  
  let action;
  try {
    const body = await request.json();
    console.log('Request body:', body);
    action = body.action;
    
    if (!action) {
      throw new Error('Action is required');
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Invalid request' },
      { status: 400 }
    );
  }
  console.log('Action:', action, 'ID:', id);

  if (!['print', 'copy', 'delete'].includes(action)) {
    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  }

  try {
    const codeId = Number(id);
    if (!Number.isInteger(codeId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid code ID format' },
        { status: 400 }
      );
    }

    if (action === 'delete') {
      // Verify the code exists first
      const existingCode = await prisma.generatedCode.findUnique({
        where: { id: codeId },
      });

      if (!existingCode) {
        return NextResponse.json(
          { success: false, message: 'Code not found' },
          { status: 404 }
        );
      }

      // Delete the code
      await prisma.generatedCode.delete({
        where: { id: codeId },
      });
      
      console.log(`Successfully deleted code with id: ${id}`);
      return NextResponse.json({
        success: true,
        message: 'Code deleted successfully',
      });
    }

    // For print and copy actions, first get the code
    const code = await prisma.generatedCode.findUnique({
      where: { id: codeId },
    });

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Code not found' },
        { status: 404 }
      );
    }

    if (action === 'print') {
      // Mark the code as printed without changing usage/registration status.
      await prisma.generatedCode.update({
        where: { id: codeId },
        data: { printed: true, printedAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        code: code.code,
        used: code.used,
        printed: action === 'print' ? true : code.printed,
      },
      message: `Code ${action}ed successfully`,
    });
  } catch (error) {
    console.error(`Error ${action}ing code:`, error);
    return NextResponse.json(
      { success: false, message: `Failed to ${action} code` },
      { status: 500 }
    );
  }
}
