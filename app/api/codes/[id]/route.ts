import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { used } = await request.json();
    
    const updatedCode = await prisma.generatedCode.update({
      where: { id: params.id },
      data: {
        used,
        usedAt: used ? new Date() : null,
      },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error('Error updating code:', error);
    return NextResponse.json(
      { error: 'Failed to update code' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const requestId = Math.random().toString(36).substring(2, 8);
  const logContext = {
    requestId,
    endpoint: 'DELETE /api/codes/[id]',
    codeId: params.id,
    timestamp: new Date().toISOString()
  };

  console.log('DELETE request received:', { 
    ...logContext,
    headers: Object.fromEntries(request.headers.entries()),
    url: request.url
  });
  
  // Validate the ID parameter
  const id = params?.id;
  const isValidId = id && typeof id === 'string' && id.trim() !== '';
  
  if (!isValidId) {
    const errorDetails = { 
      ...logContext, 
      receivedId: id,
      type: typeof id,
      isString: typeof id === 'string',
      isEmpty: typeof id === 'string' ? id.trim() === '' : 'N/A (not a string)'
    };
    
    console.error('Invalid ID parameter:', errorDetails);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'A valid code ID is required',
        requestId,
        ...(process.env.NODE_ENV === 'development' && { details: errorDetails })
      },
      { status: 400 }
    );
  }
  
  // At this point, we know id is a non-empty string
  const trimmedId = id.trim();

  try {
    console.log('Checking if code exists:', { ...logContext });
    
    // First check if the code exists
    console.log('Checking if code exists with ID:', { 
      ...logContext,
      trimmedId,
      idType: typeof trimmedId
    });
    
    const existingCode = await prisma.generatedCode.findUnique({
      where: { id: trimmedId },
      select: { id: true, code: true }
    });

    if (!existingCode) {
      console.error('Code not found:', { ...logContext });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Code not found',
          requestId
        },
        { status: 404 }
      );
    }

    console.log('Attempting to delete code:', { 
      ...logContext, 
      code: existingCode.code 
    });

    // Perform the delete operation
    console.log('Attempting to delete code with ID:', trimmedId);
    
    const deleteResult = await prisma.generatedCode.delete({
      where: { id: trimmedId },
    });

    console.log('Successfully deleted code:', { 
      ...logContext, 
      deletedCode: deleteResult 
    });

    return NextResponse.json({ 
      success: true,
      message: 'Code deleted successfully',
      requestId
    });
  } catch (error) {
    const errorContext = {
      ...logContext,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error as any).code && { code: (error as any).code },
        ...(error as any).meta && { meta: (error as any).meta }
      } : 'Unknown error',
      timestamp: new Date().toISOString()
    };

    console.error('Error in DELETE /api/codes/[id]:', JSON.stringify(errorContext, null, 2));
    
    // Handle specific Prisma errors
    if (error instanceof Error && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Code not found or already deleted',
            requestId
          },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete code',
        ...(process.env.NODE_ENV === 'development' && {
          error: error instanceof Error ? error.message : 'Unknown error',
          ...(error as any).code && { code: (error as any).code }
        }),
        requestId
      },
      { status: 500 }
    );
  }
}
