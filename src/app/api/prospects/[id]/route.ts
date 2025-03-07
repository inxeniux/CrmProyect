// app/api/prospects/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Segments {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: Request, 
  { params }: Segments
): Promise<NextResponse> {
  try {
    const {id} = await params;
    const prospect = await prisma.prospect.findUnique({
      where: { prospect_id: parseInt(id) }
    });

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }
    
    return NextResponse.json(prospect);
  } catch (error) {
    console.error('Error fetching prospect:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
