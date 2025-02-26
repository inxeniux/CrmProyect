import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { hash } from "bcryptjs";
import { emailService } from "@/lib/email";
import { validateToken } from "@/lib/authToken";

// Crear usuario
export async function POST(req: Request) {
  try {
    const { businessId, role } = await validateToken(req);
    if (role !== "Admin") throw new Error("Unauthorized");
    const { email, firstName, lastName, phoneNumber, roleUser } =
      await req.json();
    const length = 12;
    const randomPassword = crypto
      .randomBytes(6)
      .toString("hex")
      .slice(0, length);
    const hashedPassword = await hash(randomPassword, 12);

    const emailVerification = await prisma.user.findUnique({
      where: { email },
    });
    if (emailVerification)
      return NextResponse.json(
        { error: "Email ya existente" },
        { status: 401 }
      );

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        businessId,
        role: roleUser,
        phoneNumber,
        status: "Active",
      },
    });

    await emailService.sendWelcomeEmailInvitation(
      email,
      firstName,
      randomPassword,
      "business"
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 400 }
    );
  }
}

// Actualizar usuario
export async function PUT(req: Request) {
  try {
    const { role } = await validateToken(req);
    if (role !== "Admin") throw new Error("Unauthorized");

    const {
      id,
      firstName,
      lastName,
      phoneNumber,
      role: newRole,
    } = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, role: newRole, phoneNumber },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 400 }
    );
  }
}
