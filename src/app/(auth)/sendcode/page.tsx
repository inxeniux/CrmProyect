'use client';

import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { MdOutlineLightMode } from 'react-icons/md';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function SendCodePage() {
  const { theme, toggleTheme } = useTheme();
  const [isFocused, setIsFocused] = useState({ email: false });
  const [inputValues, setInputValues] = useState({ email: '' });
  const router = useRouter();

  const handleContinue = () => {
    router.push('/verifycode'); // O la ruta que necesites
  };


  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleChange = (field, value) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Imagen lateral/superior con padding y bordes redondeados */}
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

      {/* Formulario de login */}
      <div className="lg:w-1/2 flex items-end lg:items-start justify-center p-6 dark:bg-dark-bg-primary bg-light-bg-primary order-2 lg:order-1 flex-1">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-8 relative">
            {theme === 'light' ? (
              <Image
                src="/images/niux.png"
                alt="Niux Logo"
                width={100}
                height={40}
              />
            ) : (
              <Image
                src="/images/niuxdark.png"
                alt="Niux Logo"
                width={100}
                height={40}
              />
            )}
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-gray-50 dark:bg-primary-50"
            >
              <MdOutlineLightMode className="text-md dark:text-white text-gray-800"/>
            </button>
          </div>
          <p className="my-6 flex cursor-pointer items-center text-sm text-left dark:text-white text-light-text-tertiary">
            <FaArrowLeft/> {''}
            <a href="#" className="dark:text-white ml-2 text-light-text-tertiary">
            Regresa al inicio de sesion
            </a>
          </p>
          <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
          ¿Olvidaste tu contraseña?
          </h2>
          <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
          No te preocupes, a todos nos pasa. Introduce tu email a continuación para recuperar tu contraseña
          </p>

          <form  className="space-y-4">
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
          className={`absolute left-3 text-sm transition-all pointer-events-none
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


    

            <button
              onClick={handleContinue}
              className="w-full bg-primary-50 text-white py-3 rounded
                hover:bg-primary-600 active:bg-primary-700
                transition-colors"
            >
             Enviar
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}