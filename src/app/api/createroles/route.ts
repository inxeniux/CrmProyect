import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';


// Función para manejar la creación de roles y obtener todos los roles
export async function POST(req: Request) {
  try {
    const { name, permissions } = await req.json();

    // Crear el rol
    const role = await prisma.roles.create({
      data: {
        name
      },
    });

    // Si se proporcionan permisos, agregar a la tabla `role_permissions`
    if (permissions && permissions.length > 0) {
      const rolePermissions = permissions.map((permissionId: number) => ({
        role_id: role.id,
        permission_id: permissionId,
      }));

      // Agregar permisos a la tabla `role_permissions`
      await prisma.role_permissions.createMany({
        data: rolePermissions,
      });
    }

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error creando el rol' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Obtener todos los roles con sus permisos asociados
    const roles = await prisma.roles.findMany({
      include: {
        role_permissions: {
          include: {
            permissions: {
              select: {
                name: true, // Solo seleccionamos el nombre del permiso
              },
            },
          },
        },
      },
    });

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    
    return NextResponse.json(
      { error: 'Error obteniendo roles' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Asegura que Prisma se cierre correctamente
  }
}
