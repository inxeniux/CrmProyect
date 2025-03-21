
// src/app/api/auth/initiate-registration/route.ts
import { NextResponse } from 'next/server';
import { RegistrationService } from '@/lib/services/registration.service';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const result = await RegistrationService.initiateRegistration(email);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error instanceof Error ? error.message :'Error desconocido' }, { status: 400 });
 
  }
}
