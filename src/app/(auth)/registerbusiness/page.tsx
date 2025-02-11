'use client';

import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { MdLogout, MdOutlineLightMode } from 'react-icons/md';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showToast } from '@/utils/toast';
import { Button } from 'flowbite-react';


export default function RegisterPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isFocused, setIsFocused] = useState({
    name: '',
    industry: '',
    email: '',
    phoneNumber:'',
    website: '',
    address: '',
  });

  const [inputValues, setInputValues] = useState({
    name: '',
    industry: '',
    email: '',
    phoneNumber:'',
    website: '',
    address: '',
  });
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
  const logout = () =>{
    localStorage.removeItem('auth_token');
    router.push('/login');
  }
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();  // Evita la recarga de la página al enviar el formulario
  
    const loadingToast = showToast.loading('Procesando...');
  
    const token = localStorage.getItem("auth_token");
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
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Actualiza el toast de carga a éxito
        showToast.updateLoading(loadingToast, '¡Código verificado exitosamente!', 'success');
        console.log(data);
  
        // Verificar si la respuesta tiene un token
        if (data.token) {
          // Borrar el token anterior si existe
          localStorage.removeItem('auth_token');
  
          // Guardar el nuevo token
          localStorage.setItem('auth_token', data.token);
  
          // Redirigir a la siguiente página
          router.push('/funnels');
        } else {
          // Mostrar un mensaje de error si no se encuentra el token
          showToast.updateLoading(loadingToast, 'No se recibió un token.', 'error');
        }
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      // Actualizar el toast de carga a error
      showToast.updateLoading(loadingToast, error.message || 'Error al verificar', 'error');
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Imagen lateral */}
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

      {/* Formulario de registro */}
      <div className="lg:w-1/2 flex items-end lg:items-center justify-center p-6 dark:bg-dark-bg-primary bg-light-bg-primary order-2 lg:order-1 flex-1">
        <div className="w-full max-w-md">
          {/* Header con logo y toggle de tema */}
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
            <Button  onClick={logout}   className="bg-light-bg-primary absolute top-2 right-2 dark:bg-dark-bg-primary 
                  mb-2 flex justify-center items-center h-14 w-14 
                  border border-light-border-light dark:border-red-600 
                  rounded-full text-xl transition duration-200
                  text-light-text-primary dark:text-red-600
                  hover:border-brand-accent hover:text-brand-accent" href="/settings">
                        <MdLogout/>
                      </Button>
          
          <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
          Crear empresa
          </h2>
          <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
            Vamos a prepararte para que puedas acceder a tu cuenta personal.
          </p>

          <form onSubmit={handleVerification} className="space-y-4">
            {/* Grid para nombre y apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primer nombre */}
              <div className="relative">
                <input
                  type="text"
                  value={inputValues.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  className="w-full px-4 py-3 rounded border
                    bg-transparent
                    dark:text-white text-gray-900
                    border-gray-500 dark:border-white
                    focus:border-gray-900 dark:focus:border-white
                    peer transition-colors"
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
              {/* Apellidos */}
              <div className="relative">
                <input
                  type="text"
                  value={inputValues.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  onFocus={() => handleFocus('industry')}
                  onBlur={() => handleBlur('industry')}
                  className="w-full px-4 py-3 rounded border
                    bg-transparent
                    dark:text-white text-gray-900
                    border-gray-500 dark:border-white
                    focus:border-gray-900 dark:focus:border-white
                    peer transition-colors"
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

            {/* Grid para email y teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="relative">
                <input
                  type="text"
                  value={inputValues.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  onFocus={() => handleFocus('website')}
                  onBlur={() => handleBlur('website')}
                  className="w-full px-4 py-3 rounded border
                    bg-transparent
                    dark:text-white text-gray-900
                    border-gray-500 dark:border-white
                    focus:border-gray-900 dark:focus:border-white
                    peer transition-colors"
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
                  Numero de telefono
                </label>
              </div>
            </div>

            {/* Contraseña */}
            <div className="relative">
              <input
                type={"text"}
                value={inputValues.address}
                onChange={(e) => handleChange('address', e.target.value)}
                onFocus={() => handleFocus('address')}
                onBlur={() => handleBlur('address')}
                className="w-full px-4 py-3 rounded border
                  bg-transparent
                  dark:text-white text-gray-900
                  border-gray-500 dark:border-white
                  focus:border-gray-900 dark:focus:border-white
                  peer transition-colors"
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
                Direccion del negocio
              </label>
              
            </div>
             {/* Email */}
             <div className="relative">
              <input
                type={"email"}
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
              Crear cuenta
            </button>
          </form>

          {/* Link para iniciar sesión */}
          <p className="mt-6 text-center dark:text-dark-text-tertiary text-light-text-tertiary">
            ¿Ya tienes una cuenta?{' '}
            <Link href={"login"} className="text-primary-50 hover:text-primary-600">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}