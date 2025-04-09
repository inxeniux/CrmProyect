


interface Props {
  formData: any;
  updateField: (field: string, value: string) => void;
  onBack: () => void;
};


export default function StepCompanyInfo({ formData, updateField, onBack }: Props) {
  const handleSubmit = () => {
    console.log('Datos finales:', formData);
    // Aquí puedes hacer el fetch a tu API para crear el usuario
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">
        Datos de la Empresa
      </h2>
      <p className="text-sm mb-6 dark:text-dark-text-secondary text-light-text-secondary">
        Proporciona los datos de la empresa para personalizar tu cuenta y brindarte una mejor experiencia profesional.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Fila 1: Nombre de la empresa y Sector */}
        <input
          type="text"
          placeholder="Nombre de la empresa"
          value={formData.company}
          onChange={(e) => updateField('company', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Sector"
          value={formData.sector}
          onChange={(e) => updateField('sector', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        {/* Fila 2: Sitio web y Teléfono */}
        <input
          type="text"
          placeholder="Sitio web"
          value={formData.website}
          onChange={(e) => updateField('website', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        {/* Fila 3: Dirección (ocupa todo el ancho) */}
        <input
          type="text"
          placeholder="Dirección de la empresa"
          value={formData.address}
          onChange={(e) => updateField('address', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg col-span-1 md:col-span-2"
        />

        {/* Fila 4: Email (ocupa todo el ancho) */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg col-span-1 md:col-span-2"
        />
      </div>

      {/* Botón Verificar */}
      <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
        >
          Finalizar Registro
        </button>
    </div>
  );
};