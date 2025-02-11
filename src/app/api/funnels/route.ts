// app/api/funnels/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, description, inputs } = await req.json();
    
    const funnel = await prisma.funnel.create({
      data: {
        name,
        description,
        FunnelStage: {
          create: inputs?.map((stage: any, index: number) => ({
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
  } catch (error) {
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
