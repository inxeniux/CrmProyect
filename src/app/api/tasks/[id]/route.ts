import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// app/api/tasks/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const task = await prisma.tasks.findUnique({
        where: { task_id: parseInt(params.id) }
      });
      
      if (!task) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
      }
      return NextResponse.json(task);
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const data = await req.json();
      await prisma.tasks.update({
        where: { task_id: parseInt(params.id) },
        data
      });
      return NextResponse.json({ message: 'Task updated successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
  }
  
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.tasks.delete({
        where: { task_id: parseInt(params.id) }
      });
      return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }