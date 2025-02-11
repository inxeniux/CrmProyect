import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


// app/api/clients/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await prisma.client.findUnique({
      where: { client_id: parseInt(params.id) }
    });
    
    if (!client) {
      return NextResponse.json(
        { message: 'Client not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const client = await prisma.client.update({
      where: { client_id: parseInt(params.id) },
      data
    });
    return NextResponse.json({ message: 'Client updated successfully',client });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.clients.delete({
      where: { client_id: parseInt(params.id) }
    });
    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}