// app/api/activities/[prospect_id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request, 
  { params }: { params: { prospect_id: string } }
): Promise<NextResponse> {
  try {
    const activities = await prisma.activities.findMany({
      where: { prospect_id: parseInt(params.prospect_id) }
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
