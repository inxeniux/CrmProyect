
// src/app/(auth)/register/components/VerifyCode.tsx
'use client';

import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { MdOutlineLightMode } from 'react-icons/md';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface VerifyCodeProps {
  email: string;
  onVerify: (code: string) => void;
  onBack: () => void;
}

export default function VerifyCode({ email, onVerify, onBack }: VerifyCodeProps) {
  const { theme, toggleTheme } = useTheme();
  const [isFocused, setIsFocused] = useState({ code: false });
  const [code, setCode] = useState('');

  const handleFocus = () => setIsFocused({ code: true });
  const handleBlur = () => setIsFocused({ code: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(code);
  };

  const handleResendCode = async () => {
    try {
      await fetch('/api/auth/initiate-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      // Show success message
    } catch (error) {
      console.error('Error resending code:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Hero Image Section */}
      <div className="lg:w-1/2 h-[200px] lg:h-screen relative order-1 lg:order-2 dark:bg-dark-bg-primary bg-light-bg-primary p-4 lg:p-6">
        <div className="w-full h-full relative rounded-2xl overflow-hidden">
          <Image
            src="/images/hero.png"
            alt="Login illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 flex items-end lg:items-start justify-center p-6 dark:bg-dark-bg-primary bg-light-bg-primary order-2 lg:order-1 flex-1">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 relative">
            {theme === 'light' ? (
              <Image src="/images/niux.png" alt="Niux Logo" width={100} height={40} />
            ) : (
              <Image src="/images/niuxdark.png" alt="Niux Logo" width={100} height={40} />
            )}
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-gray-50 dark:bg-primary-50"
            >
              <MdOutlineLightMode className="text-md dark:text-white text-gray-800"/>
            </button>
          </div>

          <button 
            onClick={onBack}
            className="my-6 flex cursor-pointer items-center text-sm text-left dark:text-white text-light-text-tertiary"
          >
            <FaArrowLeft className="mr-2" />
            Regresar al registro
          </button>

          <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
            Verificar código
          </h2>
          <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
            Se ha enviado un código de autenticación a su correo electrónico.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full px-4 py-3 rounded border
                  bg-transparent
                  dark:text-white text-gray-900
                  border-gray-500 dark:border-white
                  focus:border-gray-900 dark:focus:border-white
                  peer transition-colors"
              />
              <label
                className={`absolute left-3 text-sm transition-all pointer-events-none
                  ${(isFocused.code || code) 
                    ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                    : 'top-3'
                  }
                  ${isFocused.code 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-white'
                  }`}
              >
                Código de verificación
              </label>
            </div>

            <p className="mt-6 text-sm text-left dark:text-dark-text-tertiary text-light-text-tertiary">
              ¿No has recibido el código?{' '}
              <button 
                type="button"
                onClick={handleResendCode}
                className="text-primary-50 hover:text-primary-600"
              >
                Reenviar
              </button>
            </p>

            <button
              type="submit"
              className="w-full bg-primary-50 text-white py-3 rounded
                hover:bg-primary-600 active:bg-primary-700
                transition-colors"
            >
              Verificar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
