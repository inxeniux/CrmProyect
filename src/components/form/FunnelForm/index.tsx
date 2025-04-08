"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { DynamicInput } from "@/components/ui/inputs/DynamicInput";
import { FaPlusCircle } from "react-icons/fa";

interface Input {
  id: number;
  name: string;
  description: string;
  position: number;
}

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
      name: "",
      description: "",
      position: inputs.length + 1,
    };
    setInputs([...inputs, newInput]);
    updateFormInputs([...inputs, newInput]);
  };

  const removeInput = (id: number) => {
    const updatedInputs = inputs
      .filter((input) => input.id !== id)
      .map((input, index) => ({ ...input, position: index + 1 }));
    setInputs(updatedInputs);
    updateFormInputs(updatedInputs);
  };

  const updateInputValue = (id: number, value: string, property: string) => {
    if (
      property === "name" ||
      property === "description" ||
      property === "position"
    ) {
      const updatedInputs = inputs.map((input) =>
        input.id === id ? { ...input, [property]: value } : input
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form className="rounded-md space-y-6 text-light-text-primary dark:text-dark-text-primary">
      <div className="grid gap-6 md:grid-cols-1">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
          >
            Nombre del embudo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Proceso de ventas"
            required
            className="bg-light-bg-input dark:bg-dark-bg-input border border-light-border-medium dark:border-dark-border-light text-light-text-primary dark:text-dark-text-primary text-sm rounded-lg focus:ring-2 focus:ring-primary-50 focus:border-primary-50 block w-full p-2.5"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe el propósito de este embudo..."
            required
            className="bg-light-bg-input dark:bg-dark-bg-input border border-light-border-medium dark:border-dark-border-light text-light-text-primary dark:text-dark-text-primary text-sm rounded-lg focus:ring-2 focus:ring-primary-50 focus:border-primary-50 block w-full p-2.5"
          />
        </div>
      </div>

      <div className="pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">
            Estados del embudo
          </h2>
          <span className="text-xs py-1 px-2 rounded-full bg-light-bg-input dark:bg-dark-bg-input text-light-text-tertiary dark:text-dark-text-tertiary">
            {inputs.length} {inputs.length === 1 ? "estado" : "estados"}
          </span>
        </div>

        <button
          type="button"
          onClick={addInput}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 mb-5 bg-light-bg-input dark:bg-dark-bg-input hover:bg-light-border-light dark:hover:bg-dark-border-light border border-dashed border-light-border-medium dark:border-dark-border-medium rounded-lg text-sm text-primary-50 hover:text-primary-600"
        >
          <FaPlusCircle className="text-primary-50" />
          <span>Agregar nuevo estado</span>
        </button>

        <div className="space-y-4">
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

        {inputs.length === 0 && (
          <div className="text-center py-8 px-4 rounded-lg border border-dashed border-light-border-light dark:border-dark-border-light bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-tertiary dark:text-dark-text-tertiary">
            <p>
              No hay estados definidos. Agrega al menos un estado para
              continuar.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
