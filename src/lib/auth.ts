// src/lib/auth.ts
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const AUTH_COOKIE_NAME = 'auth_token';
export const getAuthToken = () => Cookies.get(AUTH_COOKIE_NAME);

export const setAuthToken = (token: string) => {
  // Set cookie with secure flag and expires in 7 days
  Cookies.set(AUTH_COOKIE_NAME, token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

//hola

export const removeAuthToken = () => {
  Cookies.remove(AUTH_COOKIE_NAME);
};

export const decodeToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    removeAuthToken();
    return null;
  }
};