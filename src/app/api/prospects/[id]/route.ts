// app/api/prospects/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  
  try {
      const prospect = await prisma?.prospects.findUnique({
        where: { prospect_id: parseInt(params.id) }
      });
       
      if (!prospect) {
        return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
      }
      return NextResponse.json(prospect);
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }