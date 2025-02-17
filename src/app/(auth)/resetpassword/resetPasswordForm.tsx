'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MdOutlineLightMode } from 'react-icons/md';
import { FiEyeOff } from 'react-icons/fi';
import { BsEye } from 'react-icons/bs';
import { useTheme } from '@/providers/ThemeProvider';
import { showToast } from '@/utils/toast';

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

interface FocusState {
  password: boolean;
  confirmPassword: boolean;
}

interface PasswordVisibility {
  password: boolean;
  confirmPassword: boolean;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  const [isPasswordVisible, setIsPasswordVisible] = useState<PasswordVisibility>({
    password: false,
    confirmPassword: false
  });

  const [isFocused, setIsFocused] = useState<FocusState>({
    password: false,
    confirmPassword: false
  });

  const [inputValues, setInputValues] = useState<PasswordFormData>({
    password: '',
    confirmPassword: ''
  });

  const handleFocus = (field: keyof FocusState): void => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof FocusState): void => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleChange = (field: keyof PasswordFormData, value: string): void => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof PasswordVisibility): void => {
    setIsPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (inputValues.password !== inputValues.confirmPassword) {
      showToast.error('Las contraseñas no coinciden');
      return;
    }

    const loadingToast = showToast.loading('Procesando...');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: inputValues.password
        }),
      });

      if (!response.ok) {
        throw new Error('Error al restablecer la contraseña');
      }

      showToast.updateLoading(loadingToast, 'Contraseña restablecida exitosamente', 'success');
      router.push('/login');
    } catch (error) {
      showToast.updateLoading(
        loadingToast,
        error instanceof Error ? error.message : 'Error al restablecer la contraseña',
        'error'
      );
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Imagen lateral/superior */}
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

      {/* Formulario */}
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
              type="button"
            >
              <MdOutlineLightMode className="text-md dark:text-white text-gray-800"/>
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
            Cambia la contraseña
          </h2>
          <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
            Tu contraseña anterior ha sido restablecida. Por favor, establece una nueva contraseña para tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contraseña */}
            <div className="relative">
              <input
                type={isPasswordVisible.password ? "text" : "password"}
                value={inputValues.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                className="w-full px-4 py-3 rounded border bg-transparent dark:text-white text-gray-900 border-gray-500 dark:border-white focus:border-gray-900 dark:focus:border-white peer transition-colors"
                required
                minLength={8}
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
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {isPasswordVisible.password ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <BsEye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirmar Contraseña */}
            <div className="relative">
              <input
                type={isPasswordVisible.confirmPassword ? "text" : "password"}
                value={inputValues.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onFocus={() => handleFocus('confirmPassword')}
                onBlur={() => handleBlur('confirmPassword')}
                className="w-full px-4 py-3 rounded border bg-transparent dark:text-white text-gray-900 border-gray-500 dark:border-white focus:border-gray-900 dark:focus:border-white peer transition-colors"
                required
                minLength={8}
              />
              <label
                className={`absolute left-3 text-sm transition-all pointer-events-none
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
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {isPasswordVisible.confirmPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <BsEye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-50 text-white py-3 mt-5 rounded hover:bg-primary-600 active:bg-primary-700 transition-colors"
            >
              Restablecer contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}