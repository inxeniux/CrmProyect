
// src/app/api/auth/complete-registration/route.ts
import { NextResponse } from 'next/server';
import { RegistrationService } from '@/lib/services/registration.service';

export async function POST(request: Request) {
  try {
    const registrationData = await request.json();
    const result = await RegistrationService.completeRegistration(registrationData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
