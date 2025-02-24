// app/api/funnels/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateToken } from '@/lib/authToken';


export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { role } = await validateToken(req);
    if (role !== 'Admin') throw new Error('Unauthorized');
    
    try {
      const funnels = await prisma.user.findMany({
          where: { businessId: parseInt(params.id)}
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


export async function DELETE(
    req: Request, 
    { params }: { params: { id: string } }
  ): Promise<NextResponse> {
    const { role } = await validateToken(req);
    if (role !== 'Admin') throw new Error('Unauthorized');
    try {
      await prisma.user.delete({
        where: { id: parseInt(params.id) }
      });
      return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }