'use client';

import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { MdOutlineLightMode } from 'react-icons/md';
import { FiEyeOff } from 'react-icons/fi';
import { BsEye } from 'react-icons/bs';
import { useState } from 'react';

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [inputValues, setInputValues] = useState({ email: '', password: '' });

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
      <div className="lg:w-1/2 flex items-end lg:items-center justify-center p-6 dark:bg-dark-bg-primary bg-light-bg-primary order-2 lg:order-1 flex-1">
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

          <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
            Iniciar sesión
          </h2>
          <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
            Inicie sesión para acceder a su cuenta de niux
          </p>

          <form className="space-y-4">
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
          className={`absolute left-3 text-sm transition-all pointer-events-none
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="dark:text-dark-text-tertiary text-light-text-tertiary">
                  Recuérdame
                </span>
              </label>
              <a
                href="#"
                className="text-primary-50 hover:text-primary-600"
              >
                ¿No recuerdas tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-50 text-white py-3 rounded
                hover:bg-primary-600 active:bg-primary-700
                transition-colors"
            >
              Iniciar sesion
            </button>
          </form>

          <p className="mt-6 text-center dark:text-dark-text-tertiary text-light-text-tertiary">
            ¿No tienes cuenta?{' '}
            <a href="#" className="text-primary-50 hover:text-primary-600">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}