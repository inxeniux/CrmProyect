import { validateToken } from "@/lib/authToken";
import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';


export async function PUT(req:Request){
    try{
    
        const {userId} = await validateToken(req);
        const {firstName, lastName, phoneNumber } = await req.json();
        const user = await prisma.user.update({
          where: { id:userId },
          data: { firstName, lastName, phoneNumber },
        });

        
        return NextResponse.json(
              { message: 'User updated successfully', user },
              { status: 201 }
            );
    }
    catch(error){
    console.log('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
        
    }
}

export async function GET(req: Request) {
    const { userId } = await validateToken(req);
   
    try {
      const user = await prisma.user.findUnique({
        where: { id:userId }
      });
      
      return NextResponse.json(user);
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        
        { error: 'Error al obtener los funnels' },
        { status: 500 }
      );
    }
   }