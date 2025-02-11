
// src/app/api/auth/complete-registration/route.ts
import { NextResponse } from 'next/server';
import { RegistrationService } from '@/lib/services/registration.service';

export async function POST(request: Request) {
  try {
    const registrationData = await request.json();
    console.log(registrationData)
    const result = await RegistrationService.completeBuisnessRegistration(registrationData);
    return NextResponse.json(result);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      
      { error: error.message },
      { status: 400 }
    );
  }
}
