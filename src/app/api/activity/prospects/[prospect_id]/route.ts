// app/api/activities/[prospect_id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Segments {
  params: Promise<{
    prospect_id: string;
  }>;
}

export async function GET(
  req: Request, 
  { params }:Segments
): Promise<NextResponse> {
  try {
    const {prospect_id} = await params;
    const activities = await prisma.activities.findMany({
      where: { prospect_id: parseInt(prospect_id) }
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
