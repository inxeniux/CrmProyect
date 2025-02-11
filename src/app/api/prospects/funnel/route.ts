import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// app/api/prospects/route.ts
export async function POST(req: Request) {
    try {
      const data = await req.json();
      const prospect = await prisma.prospect.create({ data });
      return NextResponse.json(prospect, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
  }
  
  export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const data = await req.json();
      await prisma.prospect.update({
        where: { prospect_id: parseInt(params.id) },
        data
      });
      return NextResponse.json({ message: 'Prospect updated successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
  }
  
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.prospect.delete({
        where: { prospect_id: parseInt(params.id) }
      });
      return NextResponse.json({ message: 'Prospect deleted successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }