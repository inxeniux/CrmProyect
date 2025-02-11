
// src/app/(auth)/register/components/RegisterForm.tsx
'use client';

import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { MdOutlineLightMode } from 'react-icons/md';
import Link from 'next/link';

export default function RegisterForm() {
  const { theme, toggleTheme } = useTheme();
  
 

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
            Tu cuenta ha sido registrada con exito
          </h2>
          <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
            Vamos a prepararte para que puedas acceder a tu cuenta personal creando tu negocio.
          </p>
           {/* Botón de registro */}
          <Link href="/registerbusiness" className="text-primary-50 hover:text-primary-600">   
           <button
            className="w-full bg-green-600 text-white py-3 rounded mt-4
              hover:bg-green-600 active:bg-green-700
              transition-colors"
          >
            Crear negocio
          </button>
          </Link>

         
        </div>
      </div>
    </div>
  );
}
