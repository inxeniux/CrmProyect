// app/api/activities/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
      const data = await req.json();
      const activity = await prisma?.activities.create({ data });
      return NextResponse.json(activity, { status: 201 });
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: 'Bad request' },
        { status: 400 }
      );
    }
  }