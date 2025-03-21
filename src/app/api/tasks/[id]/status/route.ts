import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server';

interface Segments {
  params: Promise<{
    id: string;

  }>;
}
export async function PUT(
  request: Request,
  { params }: Segments
): Promise<NextResponse> {  // Agregar `Promise<NextResponse>`
  try {
    const { status } = await request.json();
    const {id} = await params;
    const taskId = parseInt(id);  // Convertir `id` a número de forma segura
    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { task_id: taskId },
      data: { status },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la tarea' },
      { status: 500 }
    );
  }
}


