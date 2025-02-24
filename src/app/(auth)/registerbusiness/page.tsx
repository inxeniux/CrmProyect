'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MdLogout, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from '@/providers/ThemeProvider';
import { showToast } from '@/utils/toast';

interface BusinessFormData {
  name: string;
  industry: string;
  email: string;
  phoneNumber: string;
  website: string;
  address: string;
}

interface FocusState {
  name: boolean;
  industry: boolean;
  email: boolean;
  phoneNumber: boolean;
  website: boolean;
  address: boolean;
}

export default function BusinessRegisterPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  
  const [inputValues, setInputValues] = useState<BusinessFormData>({
    name: '',
    industry: '',
    email: '',
    phoneNumber: '',
    website: '',
    address: '',
  });

  const [isFocused, setIsFocused] = useState<FocusState>({
    name: false,
    industry: false,
    email: false,
    phoneNumber: false,
    website: false,
    address: false,
  });

  const handleFocus = (field: keyof FocusState): void => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof FocusState): void => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleChange = (field: keyof BusinessFormData, value: string): void => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  const logout = (): void => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!acceptTerms) {
      showToast.error('Debe aceptar los términos y condiciones');
      return;
    }

    const loadingToast = showToast.loading('Procesando...');
    const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

    try {
      const response = await fetch('/api/auth/registration-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...inputValues,
          token

        }),
        credentials: 'include', // Para enviar las cookies
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      showToast.updateLoading(loadingToast, 'Empresa registrada exitosamente', 'success');

      if (data.token) {
        document.cookie = `auth_token=${data.token}; path=/; secure; samesite=strict`;
        router.push('/funnels');
      } else {
        showToast.updateLoading(loadingToast, 'No se recibió un token.', 'error');
      }
    } catch (error) {
      showToast.updateLoading(
        loadingToast,
        error instanceof Error ? error.message : 'Error al registrar la empresa',
        'error'
      );
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-8 relative">
        <Image
          src={theme === 'light' ? "/images/niux.png" : "/images/niuxdark.png"}
          alt="Niux Logo"
          width={100}
          height={40}
        />
        
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-gray-50 dark:bg-primary-50"
          type="button"
        >
          <MdOutlineLightMode className="text-md dark:text-white text-gray-800"/>
        </button>
      </div>

      <button
        onClick={logout}
        className="absolute top-2 right-2 bg-light-bg-primary dark:bg-dark-bg-primary 
          mb-2 flex justify-center items-center h-14 w-14 
          border border-light-border-light dark:border-red-600 
          rounded-full text-xl transition duration-200
          text-light-text-primary dark:text-red-600
          hover:border-brand-accent hover:text-brand-accent"
      >
        <MdLogout/>
      </button>

      <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
        Crear empresa
      </h2>
      <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
        Vamos a prepararte para que puedas acceder a tu cuenta personal.
      </p>

      <form onSubmit={handleVerification} className="space-y-4">
        {/* Grid para nombre y sector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre del negocio */}
          <div className="relative">
            <input
              type="text"
              value={inputValues.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
              className="w-full px-4 py-3 rounded border bg-transparent dark:text-white text-gray-900 border-gray-500 dark:border-white focus:border-gray-900 dark:focus:border-white peer transition-colors"
              required
            />
            <label
              className={`absolute left-3 transition-all pointer-events-none
                ${(isFocused.name || inputValues.name) 
                  ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                  : 'top-3'
                }
                ${isFocused.name 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-white'
                }`}
            >
              Negocio
            </label>
          </div>

          {/* Sector */}
          <div className="relative">
            <input
              type="text"
              value={inputValues.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              onFocus={() => handleFocus('industry')}
              onBlur={() => handleBlur('industry')}
              className="w-full px-4 py-3 rounded border bg-transparent dark:text-white text-gray-900 border-gray-500 dark:border-white focus:border-gray-900 dark:focus:border-white peer transition-colors"
              required
            />
            <label
              className={`absolute left-3 transition-all pointer-events-none
                ${(isFocused.industry || inputValues.industry) 
                  ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                  : 'top-3'
                }
                ${isFocused.industry 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-white'
                }`}
            >
              Sector
            </label>
          </div>
        </div>

        {/* Grid para website y teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="url"
              value={inputValues.website}
              onChange={(e) => handleChange('website', e.target.value)}
              onFocus={() => handleFocus('website')}
              onBlur={() => handleBlur('website')}
              className="w-full px-4 py-3 rounded border bg-transparent dark:text-white text-gray-900 border-gray-500 dark:border-white focus:border-gray-900 dark:focus:border-white peer transition-colors"
              required
            />
            <label
              className={`absolute left-3 transition-all pointer-events-none
                ${(isFocused.website || inputValues.website) 
                  ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                  : 'top-3'
                }
                ${isFocused.website 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-white'
                }`}
            >
              Website
            </label>
          </div>

          <div className="relative">
            <input
              type="tel"
              value={inputValues.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              onFocus={() => handleFocus('phoneNumber')}
              onBlur={() => handleBlur('phoneNumber')}
              className="w-full px-4 py-3 rounded border bg-transparent dark:text-white text-gray-900 border-gray-500 dark:border-white focus:border-gray-900 dark:focus:border-white peer transition-colors"
              required
            />
            <label
              className={`absolute left-3 transition-all pointer-events-none
                ${(isFocused.phoneNumber || inputValues.phoneNumber) 
                  ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                  : 'top-3'
                }
                ${isFocused.phoneNumber 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-white'
                }`}
            >
              Número de teléfono
            </label>
          </div>
        </div>

        {/* Dirección */}
        <div className="relative">
          <input
            type="text"
            value={inputValues.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onFocus={() => handleFocus('address')}
            onBlur={() => handleBlur('address')}
            className="w-full px-4 py-3 rounded border bg-transparent dark:text-white text-gray-900 border-gray-500 dark:border-white focus:border-gray-900 dark:focus:border-white peer transition-colors"
            required
          />
          <label
            className={`absolute left-3 transition-all pointer-events-none
              ${(isFocused.address || inputValues.address) 
                ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                : 'top-3'
              }
              ${isFocused.address 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-white'
              }`}
          >
            Dirección del negocio
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            value={inputValues.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            className="w-full px-4 py-3 rounded border bg-transparent dark:text-white text-gray-900 border-gray-500 dark:border-white focus:border-gray-900 dark:focus:border-white peer transition-colors"
            required
          />
          <label
            className={`absolute left-3 transition-all pointer-events-none
              ${(isFocused.email || inputValues.email) 
                ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                : 'top-3'
              }
              ${isFocused.email 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-white'
              }`}
          >
            Email
          </label>
        </div>

        {/* Términos y condiciones */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mr-2"
            required
          />
          <label htmlFor="terms" className="text-sm dark:text-dark-text-tertiary text-light-text-tertiary">
            Acepto todos los{' '}
            <Link href="/terms" className="text-primary-50 hover:text-primary-600">
              Términos
            </Link>
            {' '}y Políticas de{' '}
            <Link href="/privacy" className="text-primary-50 hover:text-primary-600">
              Privacidad
            </Link>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-50 text-white py-3 rounded hover:bg-primary-600 active:bg-primary-700 transition-colors"
          disabled={!acceptTerms}
        >
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-center dark:text-dark-text-tertiary text-light-text-tertiary">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="text-primary-50 hover:text-primary-600">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}