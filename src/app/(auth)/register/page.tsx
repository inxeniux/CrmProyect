
// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import RegisterForm from '@/components/form/RegisterForm';
import VerifyCode from '@/components/form/VerifyCode';
import SuccessForm from '@/components/form/SuccessForm';
import { showToast } from '@/utils/toast';

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    code: ''
  });

  const handleInitialRegistration = async (data) => {
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
     
        showToast.updateLoading(loadingToast, '¡Código verificado exitosamente!', 'success');
       
        setRegistrationData(data);
        setStep(1);
      }
    } catch (error) {
      
       // Actualizar toast de carga a error
    showToast.updateLoading(loadingToast, error.message || 'Error al verificar', 'error');
      console.error('Error:', error);
    }
  };

  const handleVerification = async (code) => {
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

      if (response.ok) {
        const data = await response.json();
        // Si hay token, guardarlo
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        // Redirect to dashboard or next step
        setStep(2);
      }
    } catch (error) {
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
