
// app/api/business/route.ts
import { NextResponse } from 'next/server';
import { validateToken } from '@/lib/authToken';
import prisma from '@/lib/prisma';
import { uploadLogoToS3 } from '@/lib/awsS3';


export async function POST(req: Request) {
  try {
    const { name, email, phoneNumber, address, website, industry } = await req.json();

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
        industry
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

 
 
 export async function PUT(req: Request) {
  try {
    const { role } = await validateToken(req);
    if (role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const address = formData.get('address') as string;
    const website = formData.get('website') as string;
    const industry = formData.get('industry') as string;
    const logoFile = formData.get('logo') as File | null;

    if (!id || !name) {
      return NextResponse.json({ error: 'Business ID and name are required' }, { status: 400 });
    }

    let logoUrl: string | null = null;
    if (logoFile) {
    
      logoUrl = await uploadLogoToS3(logoFile);
    }

    const updatedBusiness = await prisma.business.update({
      where: { id:parseInt(id) },
      data: {
        name,
        email,
        phoneNumber,
        address,
        website,
        industry,
        logo: logoUrl || undefined,
      },
    });

    return NextResponse.json({
      message: 'Business updated successfully',
      business: updatedBusiness,
    }, { status: 200 });
  } catch (error) {
    
    console.log('Error updating business:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}


 

