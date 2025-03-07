import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Segments {
  params: Promise<{
    id: string;
  }>;
}

// app/api/activities/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: Segments
) {
  try {
    const { id} = await params;

    const activity = await prisma.activities.findUnique({
      where: { activity_id: Number(id) }, // Convertir id a número
    });

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest, 
  { params }:  Segments
): Promise<NextResponse> {
  try {
    const data = await req.json();
    const { id} = await params;

    const activity = await prisma.activities.update({
      where: { activity_id: parseInt(id) },
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
  req: NextRequest, 
  { params }:Segments
): Promise<NextResponse> {
  try {
    const {id} = await params;
    await prisma.activities.delete({
      where: { activity_id: parseInt(id) }
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
