// app/api/funnels/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define interface for funnel stage input
interface FunnelStageInput {
  name: string;
  description?: string;
  position?: number;
}

// Define interface for the request body
interface CreateFunnelRequest {
  name: string;
  description?: string;
  inputs?: FunnelStageInput[];
}


export async function POST(req: Request) {
  try {
    const { name, description, inputs } = await req.json() as CreateFunnelRequest;
    
    const funnel = await prisma.funnel.create({
      data: {
        name,
        description,
        FunnelStage: {
          create: inputs?.map((stage: FunnelStageInput, index: number) => ({
            name: stage.name,
            description: stage.description || '',
            position: stage.position || index + 1
          }))
        }
      },
      include: {
        FunnelStage: true
      }
    });
    
    return NextResponse.json(funnel, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function GET() {
  try {
    const funnels = await prisma.funnel.findMany({
      include: {
        FunnelStage: {
          orderBy: {
            position: 'asc'
          }
        }
      }
    });
    
    return NextResponse.json(funnels);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Error al obtener los funnels' },
      { status: 500 }
    );
  }
}
