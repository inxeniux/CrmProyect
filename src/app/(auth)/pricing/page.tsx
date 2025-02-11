'use client';

import { useTheme } from '@/providers/ThemeProvider';
import Image from 'next/image';
import { MdOutlineLightMode } from 'react-icons/md';

export default function PricingPlans() {
    const {toggleTheme} = useTheme();
 
  const plans = [
    {
      name: 'Pyme',
      price: '$400/MXN',
      features: [
        'Access to all modules',
        'Access to all modules',
        'Access to all modules',
      ],
      selected: false,
    },
    {
      name: 'SuperPyme',
      price: '$700/MXN',
      features: [
        'Access to all modules',
        'Access to all modules',
        'Access to all modules',
      ],
      selected: true,
    },
    {
      name: 'Start-Up',
      price: '$1500/MXN',
      features: [
        'Access to all modules',
        'Access to all modules',
        'Access to all modules',
      ],
      selected: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary p-6">
      {/* Logo */}
      <div className="absolute top-6 right-6">
        <Image
          src="/images/niux.png"
          alt="Niux Logo"
          width={100}
          height={40}
          className="dark:hidden"
        />
        <Image
          src="/images/niuxdark.png"
          alt="Niux Logo"
          width={100}
          height={40}
          className="hidden dark:block"
        />
      </div>
      <button 
                    onClick={toggleTheme} 
                    className="p-2 rounded-full bg-gray-50 dark:bg-primary-50"
                  >
                    <MdOutlineLightMode className="text-md dark:text-white text-gray-800"/>
                  </button>
      {/* Contenido principal */}
      <div className="max-w-6xl  mx-auto pt-16 lg:pt-5 ">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Planes de precios para todas
        </h1>
        <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          las necesidades
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-16">
          Ponte en marcha y lleva tus habilidades al siguiente nivel.
        </p>

        {/* Grid de planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan,) => (
            <div
              key={plan.name}
              className={`rounded-2xl cursor-pointer p-6 ${
                plan.selected
                  ? 'bg-gray-50 dark:bg-dark-bg-secondary '
                  : 'bg-gray-50 dark:bg-dark-bg-secondary'
              } transition-all duration-300 hover:shadow-xl`}
            >
              {/* Encabezado del plan */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-4 h-4 rounded-full ${
                    plan.selected ? 'bg-primary-50' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
              </div>

              {/* Precio */}
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pago mensual
                </p>
              </div>

              {/* Características */}
              <ul className="space-y-4 mt-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

       {/* Botón de continuar */}
<div className="flex justify-center lg:static fixed left-2 right-2 bottom-2">
  <button className="bg-primary-50 hover:bg-primary-600 text-white py-4 px-8 rounded-lg transition-colors w-full max-w-md">
    Continuar
  </button>
</div>

      </div>
    </div>
  );
}