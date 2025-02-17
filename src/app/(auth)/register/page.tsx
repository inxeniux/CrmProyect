
// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import RegisterForm from '@/components/form/RegisterForm';
import VerifyCode from '@/components/form/VerifyCode';
import SuccessForm from '@/components/form/SuccessForm';
import { showToast } from '@/utils/toast';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  code?: string;
}

export default function RegisterPage() {
  const [step, setStep] = useState<number>(0);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleInitialRegistration = async (data: RegistrationData): Promise<void> => {
    const loadingToast = showToast.loading('Procesando...');
    
    try {
      const response = await fetch('/api/auth/initiate-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        showToast.updateLoading(loadingToast, '¡Código enviado exitosamente!', 'success');
        setRegistrationData(data);
        setStep(1);
      } else {
        throw new Error('Error en el registro inicial');
      }
    } catch (error) {
      showToast.updateLoading(
        loadingToast, 
        error instanceof Error ? error.message : 'Error al iniciar registro', 
        'error'
      );
      console.error('Error:', error);
    }
  };

  const handleVerification = async (code: string): Promise<void> => {
    const loadingToast = showToast.loading('Verificando código...');
    
    try {
      const response = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...registrationData,
          code
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la verificación');
      }

      const data = await response.json();
      
      if (data.token) {
        document.cookie = `auth_token=${data.token}; path=/; secure; samesite=strict`;
      }
      
      showToast.updateLoading(loadingToast, '¡Registro completado exitosamente!', 'success');
      setStep(2);
    } catch (error) {
      showToast.updateLoading(
        loadingToast,
        error instanceof Error ? error.message : 'Error en la verificación',
        'error'
      );
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {step === 0 ? (
        <RegisterForm 
          initialData={registrationData}
          onSubmit={handleInitialRegistration}
        />
      ) : step === 1 ? (
        <VerifyCode
          email={registrationData.email}
          onVerify={handleVerification}
          onBack={() => setStep(0)}
        />
      ):(
        <SuccessForm></SuccessForm>
      )}
    </div>
  );
}
