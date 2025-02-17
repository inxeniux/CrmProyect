import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// app/api/activities/[id]/route.ts
export async function GET(
  req: Request, 
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    console.log("Received ID:", params.id);  // Agregar para depuración

    const activity = await prisma.activities.findUnique({
      where: { activity_id: parseInt(params.id) },
    });

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request, 
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const data = await req.json();
    const activity = await prisma.activities.update({
      where: { activity_id: parseInt(params.id) },
      data
    });
    return NextResponse.json({ message: 'Activity updated successfully', activity });
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
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await prisma.activities.delete({
      where: { activity_id: parseInt(params.id) }
    });
    return NextResponse.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
