import { validateToken } from "@/lib/authToken";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { role, businessId } = await validateToken(req);
    if (role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { color1, color2, color3 } = await req.json();

    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        color1: color1 || undefined,
        color2: color2 || undefined,
        color3: color3 || undefined,
      },
    });

    return NextResponse.json(
      {
        message: "Busines scolors updated successfully",
        business: updatedBusiness,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating business:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { role, businessId } = await validateToken(req);
    if (role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedBusiness = await prisma.business.findUnique({
      where: { id: businessId },
    });

    return NextResponse.json({ updatedBusiness }, { status: 200 });
  } catch (error) {
    console.log("Error updating business:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessId, color1, color2, color3 } = body;

    if (!businessId) {
      return new Response(
        JSON.stringify({ error: "Business ID is required" }),
        { status: 400 }
      );
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        color1,
        color2,
        color3,
      },
    });

    return Response.json(updatedBusiness);
  } catch (error) {
    console.error("[COLOR_UPDATE]", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}
