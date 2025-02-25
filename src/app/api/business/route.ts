
// app/api/business/route.ts
import { NextResponse } from 'next/server';
import { validateToken } from '@/lib/authToken';
import prisma from '@/lib/prisma';


export async function POST(req: Request) {
  try {
    const { name, email, phoneNumber, address, website, industry, logo } = await req.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    // Check if business email already exists
    if (email) {
      const existingBusiness = await prisma.business.findUnique({
        where: { email }
      });

      if (existingBusiness) {
        return NextResponse.json(
          { error: 'Business with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Create business
    const business = await prisma.business.create({
      data: {
        name,
        email,
        phoneNumber,
        address,
        website,
        industry,
        logo
      }
    });

    return NextResponse.json(
      { message: 'Business created successfully', businessId: business.id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Business creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request) {
  try {
    const { id,name, email, phoneNumber, address, website, industry, logo } = await req.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    // Check if business email already exists
    if (email) {
      const existingBusiness = await prisma.business.update({
        where: { id:id },
        data:{
          name,
          email, 
          phoneNumber, 
          address, 
          website, 
          industry,
          logo
        }
      });

      if (existingBusiness) {
        return NextResponse.json(
          { error: 'Business  already updated' },
          { status: 409 }
        );
      }
    }

    // Create business
    const business = await prisma.business.create({
      data: {
        name,
        email,
        phoneNumber,
        address,
        website,
        industry,
        logo
      }
    });

    return NextResponse.json(
      { message: 'Business created successfully', businessId: business.id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Business creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: Request) {
  const { businessId } = await validateToken(req);
 
  try {
    const business = await prisma.business.findUnique({
      where: { id:businessId }
    });
    
    return NextResponse.json(business);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      
      { error: 'Error al obtener los funnels' },
      { status: 500 }
    );
  }
 }

