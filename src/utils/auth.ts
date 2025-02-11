// src/utils/auth.ts
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: number;
  email: string;
  status: 'PENDING_BUSINESS' | 'Active';
  iat: number;
  exp: number;
}

export const getDecodedToken = (): DecodedToken | null => {
  try {
    const token = localStorage.getItem('auth_token');
    console.log(token)
    if (!token) return null;
    
    return jwt.decode(token) as DecodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};