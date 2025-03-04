// src/app/api/clients/bulk-upload/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { parse } from 'papaparse';

// Procesar FormData para subir archivos
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se ha proporcionado un archivo' },
        { status: 400 }
      );
    }

    // Obtener extensión del archivo
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    // Convertir File a ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(fileBuffer);
    
    let clients = [];

    // Procesar según el tipo de archivo
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Procesar Excel
      const workbook = XLSX.read(fileData, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      clients = XLSX.utils.sheet_to_json(worksheet);
    } 
    else if (fileExtension === 'csv') {
      // Procesar CSV
      const csvText = new TextDecoder().decode(fileData);
      const result = parse(csvText, {
        header: true,
        skipEmptyLines: true
      });
      clients = result.data;
    } 
    else {
      return NextResponse.json(
        { error: 'Formato de archivo no soportado. Use .xlsx, .xls o .csv' },
        { status: 400 }
      );
    }

    // Validar y transformar datos
    const validatedClients = clients.map(client => validateAndTransformClient(client));
    
    // Insertar en batch para mejor rendimiento
    const result = await prisma.$transaction(
      validatedClients.map(client => 
        prisma.client.create({
          data: client
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `${result.length} clientes importados correctamente`,
      count: result.length
    });
  } catch (error) {
    console.error('Error en carga masiva:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar la carga masiva',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Función para validar y transformar los datos del cliente
function validateAndTransformClient(rawClient: any) {
  // Mapear los nombres de columnas del archivo a los campos del modelo
  const client: any = {
    company_name: rawClient.company_name || rawClient.companyName || rawClient.empresa || '',
    contact_name: rawClient.contact_name || rawClient.contactName || rawClient.contacto || '',
    position: rawClient.position || rawClient.cargo || '',
    phone_number: rawClient.phone_number || rawClient.phoneNumber || rawClient.telefono || '',
    email: rawClient.email || rawClient.correo || '',
    website: rawClient.website || rawClient.sitio_web || rawClient.sitioWeb || '',
    address: rawClient.address || rawClient.direccion || '',
    city: rawClient.city || rawClient.ciudad || '',
    state: rawClient.state || rawClient.estado || '',
    postal_code: rawClient.postal_code || rawClient.postalCode || rawClient.cp || '',
    country: rawClient.country || rawClient.pais || 'México',
    lead_source: rawClient.lead_source || rawClient.leadSource || rawClient.fuente || '',
    industry: rawClient.industry || rawClient.industria || '',
    status: rawClient.status || 'Prospect',
    priority: validatePriority(rawClient.priority || rawClient.prioridad),
    assigned_to: rawClient.assigned_to || rawClient.assignedTo || rawClient.asignado || '',
    tags: rawClient.tags || rawClient.etiquetas || '',
    comments: rawClient.comments || rawClient.comentarios || ''
  };

  return client;
}

// Validar el valor de prioridad
function validatePriority(priority: string): 'Low' | 'Medium' | 'High' {
  const normalized = priority?.toLowerCase();
  
  if (normalized === 'low' || normalized === 'baja') return 'Low';
  if (normalized === 'high' || normalized === 'alta') return 'High';
  return 'Medium'; // Valor por defecto
}