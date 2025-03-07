import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Segments {
  params: Promise<{
    id: string;
  }>;
}
// app/api/clients/[id]/route.ts
export async function GET(
  req: Request, 
  { params }: Segments
): Promise<NextResponse> { 
  try {
    const {id} = await params;
    const client = await prisma.client.findUnique({
      where: { client_id: parseInt(id) }
    });
    
    if (!client) {
      return NextResponse.json(
        { message: 'Client not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(client);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request, 
  { params }: Segments
): Promise<NextResponse> { 
  try {
    const data = await req.json();
    const {id}= await params;
    const client = await prisma.client.update({
      where: { client_id: parseInt(id) },
      data
    });
    return NextResponse.json({ message: 'Client updated successfully', client });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request, 
  { params }: Segments
): Promise<NextResponse> { 
  try {
    const {id} = await params;
    await prisma.client.delete({
      where: { client_id: parseInt(id) }
    });
    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
