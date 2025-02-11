import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(req: Request) {
    try {
      const data = await req.json();
      const task = await prisma.task.create({ data });
      return NextResponse.json(task, { status: 201 });
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
  }
  
  export async function GET() {
    try {
      const tasks = await prisma.task.findMany();
      return NextResponse.json(tasks);
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }