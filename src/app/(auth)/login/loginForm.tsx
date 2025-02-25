'use client';

import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { MdOutlineLightMode } from 'react-icons/md';
import { FiEyeOff } from 'react-icons/fi';
import { BsEye } from 'react-icons/bs';
import { useState } from 'react';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


interface InputState {
    email: string;
    password: string;
  }
  
  interface FocusState {
    email: boolean;
    password: boolean;
  }

  interface Errors {
    email?: string;
    password?: string;
  }
  
export default function LoginForm() {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState({ email: false, password: false });
    const [inputValues, setInputValues] = useState<InputState>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({
      email: "",
      password: ""
      });
    
    const handleFocus = (field: keyof FocusState): void => {
      setIsFocused(prev => ({ ...prev, [field]: true }));
    };
  
    const handleBlur = (field: keyof FocusState): void => {
      setIsFocused(prev => ({ ...prev, [field]: false }));
    };
  
    const handleChange = (field: keyof InputState, value: string): void => {
      setInputValues(prev => ({ ...prev, [field]: value }));
    };
  
    const validarFormulario = (): boolean => {
      const errores: Errors = {};
  
      if (!inputValues.password.trim()) errores.password = "Este campo es obligatorio";
      if (!inputValues.email.trim()) {
        errores.email = "Este campo es obligatorio";
      } else if (!/^\S+@\S+\.\S+$/.test(inputValues.email)) {
        errores.email = "Correo electrónico no válido";
      }

  
      setErrors(errores);
      return Object.keys(errores).length === 0;
    };
     const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();  // Evita la recarga de la página al enviar el formulario
      
        // Primero, valida el formulario
        const isValid = validarFormulario();

        // Si el formulario no es válido, no continuamos con la solicitud
        if (!isValid) {
         return; // Aquí puedes mostrar algún mensaje o hacer algo en caso de que no sea válido
         }
              
        const loadingToast = showToast.loading('Procesando...');
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:inputValues.email,password:inputValues.password}),
          });
      
          if (response.ok) {
            const data = await response.json();
      
            // Actualiza el toast de carga a éxito
            showToast.updateLoading(loadingToast, 'Inicio de sesion  exitoso!', 'success');
            console.log(data);
      
            // Verificar si la respuesta tiene un token
            if (data.token) {
              // Guardar el nuevo token
              document.cookie = `auth_token=${data.token}; path=/; secure; samesite=strict`;
    
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
          showToast.updateLoading(
            loadingToast, 
            error instanceof Error ? error.message : 'Error al verificar', 
            'error'
          );
          console.error('Error:', error);
        }
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
  
            <form onSubmit={handleVerification} className="space-y-4">
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
          {errors.email && <p className='text-sm text-red-600 mt-1'>{errors.email}</p>}
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
          {errors.password && <p className='text-sm text-red-600 mt-1'>{errors.password}</p>}
        </div>
  
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="dark:text-dark-text-tertiary text-light-text-tertiary">
                    Recuérdame
                  </span>
                </label>
                <Link
              href="/auth/recover"
              className="text-primary-50 hover:text-primary-600"
            >
              ¿No recuerdas tu contraseña?
            </Link>
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
              <Link href="/register" className="text-primary-50 hover:text-primary-600">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }