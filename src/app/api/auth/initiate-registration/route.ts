
// src/app/api/auth/initiate-registration/route.ts
import { NextResponse } from 'next/server';
import { RegistrationService } from '@/lib/services/registration.service';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const result = await RegistrationService.initiateRegistration(email);
    return NextResponse.json(result);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
