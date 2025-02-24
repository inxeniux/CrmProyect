import jwt from 'jsonwebtoken';

// Middleware para validar el token y extraer businessId
export async function validateToken(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) throw new Error('No token provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new Error('Invalid token format');

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as { businessId: number; role: string,userId:number };
  } catch (error) {
   
    throw new Error(error instanceof Error ? error.message : 'Error desconocido');
  }
}
