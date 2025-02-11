// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const client = await prisma.prospect.create({ data });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    );
  }
}