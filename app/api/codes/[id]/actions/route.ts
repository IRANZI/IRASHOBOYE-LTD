import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Ensure params is resolved
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  
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
    if (action === 'delete') {
      // Verify the code exists first
      const existingCode = await prisma.generatedCode.findUnique({
        where: { id },
      });

      if (!existingCode) {
        return NextResponse.json(
          { success: false, message: 'Code not found' },
          { status: 404 }
        );
      }

      // Delete the code
      await prisma.generatedCode.delete({
        where: { id },
      });
      
      console.log(`Successfully deleted code with id: ${id}`);
      return NextResponse.json({
        success: true,
        message: 'Code deleted successfully',
      });
    }

    // For print and copy actions, first get the code
    const code = await prisma.generatedCode.findUnique({
      where: { id },
    });

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Code not found' },
        { status: 404 }
      );
    }

    if (action === 'print') {
      // Mark as used when printed
      await prisma.generatedCode.update({
        where: { id },
        data: { used: true, usedAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        code: code.code,
        used: action === 'print' ? true : code.used,
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
