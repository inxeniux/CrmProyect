// Este archivo podría estar causando conflictos con page.tsx
// Considera eliminarlo si el error persiste después de las otras correcciones
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.next();
}
