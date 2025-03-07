import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

interface Segments {
  params: Promise<{
    id: string;

  }>;
}
// app/api/tasks/[id]/route.ts
export async function GET(
  req: NextRequest, 
  { params }: Segments
): Promise<NextResponse> {
  try {
    const {id} = await params;
    const task = await prisma.task.findUnique({
      where: { task_id: parseInt(id) }
    });

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch  {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest, 
  { params }:Segments
): Promise<NextResponse> {
  try {
    const {id} = await params;
    const data = await req.json();
    await prisma.task.update({
      where: { task_id: parseInt(id) },
      data
    });
    return NextResponse.json({ message: 'Task updated successfully' });
  } catch  {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest, 
  { params }: Segments
): Promise<NextResponse> {
  try {
    const {id} = await params;
    await prisma.task.delete({
      where: { task_id: parseInt(id) }
    });
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch  {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
