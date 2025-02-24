import { validateToken } from "@/lib/authToken";
import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { hash } from "bcryptjs";

export async function PUT(request: Request) {
  const { userId } = await validateToken(request);

  try {
    const {password} = await request.json();

    const hashedPassword = await hash(password, 12);
    

    const user = await prisma.user.update({
        where: { id:userId },
        data: { password:hashedPassword},
      });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error instanceof Error ? error.message :'Error desconocido' }, { status: 400 });
 
  }
}