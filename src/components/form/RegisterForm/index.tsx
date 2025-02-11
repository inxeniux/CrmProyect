
// src/app/(auth)/register/components/RegisterForm.tsx
'use client';

import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { MdOutlineLightMode } from 'react-icons/md';
import { FiEyeOff } from 'react-icons/fi';
import { BsEye } from 'react-icons/bs';
import { useState } from 'react';
import Link from 'next/link';

interface RegisterFormProps {
  initialData: any;
  onSubmit: (data: any) => void;
}

export default function RegisterForm({ initialData, onSubmit }: RegisterFormProps) {
  const { theme, toggleTheme } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
  });
  const [inputValues, setInputValues] = useState(initialData);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleChange = (field, value) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValues);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Hero Image Section */}
      <div className="lg:w-1/2 h-[200px] lg:h-screen relative order-2 lg:order-1 dark:bg-dark-bg-primary bg-light-bg-primary p-4 lg:p-6">
        <div className="w-full h-full relative rounded-2xl overflow-hidden">
          <Image
            src="/images/hero.png"
            alt="Register illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 flex items-end lg:items-center justify-center p-6 dark:bg-dark-bg-primary bg-light-bg-primary order-2 lg:order-1 flex-1">
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

          <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
            Registrate aquí
          </h2>
          <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
            Vamos a prepararte para que puedas acceder a tu cuenta personal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid para nombre y apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primer nombre */}
              <div className="relative">
                <input
                  type="text"
                  value={inputValues.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onFocus={() => handleFocus('firstName')}
                  onBlur={() => handleBlur('firstName')}
                  className="w-full px-4 py-3 rounded border
                    bg-transparent
                    dark:text-white text-gray-900
                    border-gray-500 dark:border-white
                    focus:border-gray-900 dark:focus:border-white
                    peer transition-colors"
                />
                <label
                  className={`absolute left-3 transition-all pointer-events-none
                    ${(isFocused.firstName || inputValues.firstName) 
                      ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                      : 'top-3'
                    }
                    ${isFocused.firstName 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-white'
                    }`}
                >
                  Nombres
                </label>
              </div>

              {/* Apellidos */}
              <div className="relative">
                <input
                  type="text"
                  value={inputValues.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onFocus={() => handleFocus('lastName')}
                  onBlur={() => handleBlur('lastName')}
                  className="w-full px-4 py-3 rounded border
                    bg-transparent
                    dark:text-white text-gray-900
                    border-gray-500 dark:border-white
                    focus:border-gray-900 dark:focus:border-white
                    peer transition-colors"
                />
                <label
                  className={`absolute left-3 transition-all pointer-events-none
                    ${(isFocused.lastName || inputValues.lastName) 
                      ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                      : 'top-3'
                    }
                    ${isFocused.lastName 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-white'
                    }`}
                >
                  Apellidos
                </label>
              </div>
            </div>

            {/* Grid para email y teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  value={inputValues.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  className="w-full px-4 py-3 rounded border
                    bg-transparent
                    dark:text-white text-gray-900
                    border-gray-500 dark:border-white
                    focus:border-gray-900 dark:focus:border-white
                    peer transition-colors"
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

              {/* Teléfono */}
              <div className="relative">
                <input
                  type="tel"
                  value={inputValues.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  onFocus={() => handleFocus('phoneNumber')}
                  onBlur={() => handleBlur('phoneNumber')}
                  className="w-full px-4 py-3 rounded border
                    bg-transparent
                    dark:text-white text-gray-900
                    border-gray-500 dark:border-white
                    focus:border-gray-900 dark:focus:border-white
                    peer transition-colors"
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
                  N.Celular
                </label>
              </div>
            </div>

            {/* Contraseña */}
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={inputValues.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                className="w-full px-4 py-3 rounded border
                  bg-transparent
                  dark:text-white text-gray-900
                  border-gray-500 dark:border-white
                  focus:border-gray-900 dark:focus:border-white
                  peer transition-colors"
              />
              <label
                className={`absolute left-3 transition-all pointer-events-none
                  ${(isFocused.password || inputValues.password) 
                    ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                    : 'top-3'
                  }
                  ${isFocused.password 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-white'
                  }`}
              >
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 
                  dark:hover:text-gray-300 transition-colors"
              >
                {isPasswordVisible ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <BsEye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirmar Contraseña */}
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                value={inputValues.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onFocus={() => handleFocus('confirmPassword')}
                onBlur={() => handleBlur('confirmPassword')}
                className="w-full px-4 py-3 rounded border
                  bg-transparent
                  dark:text-white text-gray-900
                  border-gray-500 dark:border-white
                  focus:border-gray-900 dark:focus:border-white
                  peer transition-colors"
              />
              <label
                className={`absolute left-3 transition-all pointer-events-none
                  ${(isFocused.confirmPassword || inputValues.confirmPassword) 
                    ? '-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1' 
                    : 'top-3'
                  }
                  ${isFocused.confirmPassword 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-white'
                  }`}
              >
                Confirmar contraseña
              </label>
              <button
                type="button"
                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 
                  dark:hover:text-gray-300 transition-colors"
              >
                {isConfirmPasswordVisible ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <BsEye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm dark:text-dark-text-tertiary text-light-text-tertiary">
                Acepto todos los{' '}
                <Link href="#" className="text-primary-50 hover:text-primary-600">
                  Términos
                </Link>
                {' '}y Políticas de{' '}
                <Link href="#" className="text-primary-50 hover:text-primary-600">
                  Privacidad
                </Link>
              </label>
            </div>

            {/* Botón de registro */}
            <button
            
              type="submit"
              className="w-full bg-primary-50 text-white py-3 rounded
                hover:bg-primary-600 active:bg-primary-700
                transition-colors"
            >
              Continuar
            </button>
          </form>

          <p className="mt-6 text-center dark:text-dark-text-tertiary text-light-text-tertiary">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-primary-50 hover:text-primary-600">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
