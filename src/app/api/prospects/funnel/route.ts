import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Crear un nuevo prospecto
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.json();
    
    // Validar que los datos requeridos estén presentes
    if (!data) {
      return NextResponse.json({ error: 'Missing request body' }, { status: 400 });
    }

    const prospect = await prisma.prospect.create({ data });
    return NextResponse.json(prospect, { status: 201 });
  } catch (error) {
    console.error('Error creating prospect:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Actualizar un prospecto
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;
    const data = await req.json();

    // Validar ID y datos de entrada
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid prospect ID' }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Missing request body' }, { status: 400 });
    }

    await prisma.prospect.update({
      where: { prospect_id: parseInt(id, 10) },
      data,
    });

    return NextResponse.json({ message: 'Prospect updated successfully' });
  } catch (error) {
    console.error('Error updating prospect:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Eliminar un prospecto
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    // Validar ID antes de intentar eliminar
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid prospect ID' }, { status: 400 });
    }

    await prisma.prospect.delete({
      where: { prospect_id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Prospect deleted successfully' });
  } catch (error) {
    console.error('Error deleting prospect:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
