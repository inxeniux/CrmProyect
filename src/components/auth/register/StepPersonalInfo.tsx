import Link from "next/link";


interface Props {
  formData: any;
  updateField: (field: string, value: string | boolean) => void;
  onNext: () => void;
};


export default function StepPersonalInfo({ formData, updateField, onNext }: Props) {

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
        Datos personales
      </h2>
      <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
        Completa tu información básica para crear tu cuenta personal y comenzar a disfrutar de nuestros servicios.
      </p>

      <div className="space-y-4">
        {/* Fila 1: Nombre y Apellidos */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Nombres"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            autoComplete="given-name"
            className="w-1/2 p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            autoComplete="family-name"
            className="w-1/2 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Fila 2: Correo y Teléfono */}
        <div className="flex space-x-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            autoComplete="email"
            className="w-1/2 p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            autoComplete="tel"
            className="w-1/2 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Fila 3: Contraseña */}
        <div className="w-full">
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Fila 4: Confirmar Contraseña */}
        <div className="w-full">
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Aceptar términos */}
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => updateField('acceptTerms', e.target.checked)}
            className="mr-2"
          />
          Acepto los
          <Link href="/terminos" className="underline text-blue-600 ml-1">
            Términos
          </Link>
          y
          <Link href="/privacidad" className="underline text-blue-600 ml-1">
            Políticas de Privacidad
          </Link>
        </label>

        {/* Botón Continuar */}
        <button
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
        >
          Continuar
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};