'use client';

import { Dispatch, SetStateAction, useState } from "react";
import { DynamicInput } from "@/components/ui/inputs/DynamicInput";

interface Input {
  id: number;
  name: string;
  description: string;
  position: number;
}

// Renombrado para evitar conflictos y actualizado para incluir patch
interface FunnelFormData {
  name: string;
  description: string;
  inputs?: Input[];
  patch: boolean;
}

interface FunnelFormProps {
  formData: FunnelFormData;
  setFormData: Dispatch<SetStateAction<FunnelFormData>>;
}

export function FunnelForm({ formData, setFormData }: FunnelFormProps) {
  const [inputs, setInputs] = useState<Input[]>(formData.inputs || []);
  
  const addInput = () => {
    const newInput = {
      id: Date.now(),
      name: '',
      description: '',
      position: inputs.length + 1
    };
    setInputs([...inputs, newInput]);
    updateFormInputs([...inputs, newInput]);
  };

  const removeInput = (id: number) => {
    const updatedInputs = inputs.filter(input => input.id !== id)
      .map((input, index) => ({...input, position: index + 1}));
    setInputs(updatedInputs);
    updateFormInputs(updatedInputs);
  };

  // Modificar la firma de esta función para que coincida con lo que espera DynamicInput
  const updateInputValue = (id: number, value: string, property: string) => {
    // Verificar que la propiedad sea válida antes de actualizar
    if (property === 'name' || property === 'description' || property === 'position') {
      const updatedInputs = inputs.map(input => 
        input.id === id ? {...input, [property]: value} : input
      );
      setInputs(updatedInputs);
      updateFormInputs(updatedInputs);
    }
  };

  const updateFormInputs = (newInputs: Input[]) => {
    setFormData({
      ...formData,
      inputs: newInputs,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form className="rounded-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ingresa el nombre"
          required
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Ingresa la descripción"
          required
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">Estatus</h2>
        <button
          type="button"
          onClick={addInput}
          className="bg-orange-50 text-orange-500 w-full text-sm mb-4 p-2 rounded"
        >
          + Agregar estado
        </button>
        {inputs.map((input) => (
          <DynamicInput
            key={input.id}
            id={input.id}
            name={input.name}
            description={input.description}
            position={input.position}
            onChange={updateInputValue}
            onRemove={removeInput}
          />
        ))}
      </div>
    </form>
  );
}