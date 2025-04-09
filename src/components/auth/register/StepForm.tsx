'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { MdOutlineLightMode } from 'react-icons/md';
import StepPersonalInfo from './StepPersonalInfo';
import StepVerification from './StepVerification';
import StepCompanyInfo from './StepCompanyInfo';


interface FormData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  code: string;
  company: string;
  position: string;
};


export default function StepForm() {
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    code: '',
    company: '',
    position: '',
  });

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-md space-y-6">
      {/* Barra de progreso */}
      <div className="w-full relative mb-6">
        {/* Línea base */}
        <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded-full" />

        {/* Línea de progreso activa */}
        <div
          className={`absolute top-4 left-0 h-1 bg-blue-500 rounded-full transition-all duration-300 ${step === 1 ? 'w-0' : ''} ${step === 2 ? 'w-1/2' : ''} ${step === 3 ? 'w-full' : ''}`}
        />

        {/* Pasos */}
        <div className="relative flex justify-between items-center">
          {[{ label: 'Cuenta', stepNum: 1 }, { label: 'Verificación', stepNum: 2 }, { label: 'Empresa', stepNum: 3 }]
            .map(({ label, stepNum }) => {
              const isActive = step >= stepNum;
              return (
                <div key={label} className="flex flex-col items-center z-10 w-1/9">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                ${isActive
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-400 border-gray-300'}
              `}
                  >
                    {stepNum}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* <div className="flex justify-between items-center mb-8 relative">
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
          </div> */}


      {/* Contenido de los pasos */}
      {step === 1 && (
        <StepPersonalInfo
          formData={formData}
          updateField={updateField}
          onNext={next}
        />
      )}
      {step === 2 && (
        <StepVerification
          formData={formData}
          updateField={updateField}
          onNext={next}
          onBack={prev}
        />
      )}
      {step === 3 && (
        <StepCompanyInfo
          formData={formData}
          updateField={updateField}
          onBack={prev}
        />
      )}
    </div>
  );
};