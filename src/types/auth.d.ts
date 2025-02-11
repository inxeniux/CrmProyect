// types/auth.d.ts
interface JWTPayload {
    userId: number;
    email: string;
    role: string;
    status: string;
    iat: number;
    exp: number;
  }