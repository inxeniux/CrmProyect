


interface Props {
  formData: any;
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
};


export default function StepVerification({ formData, updateField, onNext, onBack }: Props) {
  const handleResendCode = () => {
    // Aquí iría la lógica real para reenviar el código, por ahora solo un console.log
    console.log(`Reenviando código a: ${formData.email}`);
    alert('El código ha sido reenviado a tu correo electrónico.');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
        Verificar código
      </h2>
      <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
        Hemos enviado un código de verificación al correo {formData.email}. Ingrésalo para validar tu identidad.
      </p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Código de verificación"
          value={formData.code}
          onChange={(e) => updateField('code', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <div className="text-sm text-gray-600 dark:text-gray-300">
          ¿No has recibido el código?
          <button
            onClick={handleResendCode}
            className="ml-1 text-blue-600 hover:underline dark:text-blue-400"
            type="button"
          >
            Reenviar
          </button>
        </div>

        {/* Botón Verificar */}
        <button
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
        >
          Verificar
        </button>
      </div>
    </div>
  );
};