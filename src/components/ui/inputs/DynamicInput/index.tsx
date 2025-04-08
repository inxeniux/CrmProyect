// components/ui/inputs/DynamicInput/index.tsx
"use client";

import { FaRegTrashAlt } from "react-icons/fa";

interface DynamicInputProps {
  id: number;
  name: string;
  description: string;
  position: number;
  onChange: (id: number, value: string, property: string) => void;
  onRemove: (id: number) => void;
}

export function DynamicInput({
  id,
  name,
  description,
  onChange,
  onRemove,
}: DynamicInputProps) {
  return (
    <div className="flex items-center space-x-2 mb-3">
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(id, e.target.value, "name")}
        placeholder={`Agrega el estado ${id}`}
        className="border dark:border-dark-border-medium border-light-border-medium p-2 h-10 text-sm rounded w-full 
        bg-light-bg-input dark:bg-dark-bg-input text-light-text-primary dark:text-dark-text-primary"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => onChange(id, e.target.value, "description")}
        placeholder={`Agregar descripcion ${id}`}
        className="border dark:border-dark-border-medium border-light-border-medium p-2 h-10 text-sm rounded w-full 
        bg-light-bg-input dark:bg-dark-bg-input text-light-text-primary dark:text-dark-text-primary"
      />
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="bg-red-50 dark:bg-dark-bg-secondary text-red-600 dark:text-error-dark h-10 w-10 
        flex justify-center items-center p-2 rounded hover:bg-red-100 dark:hover:bg-dark-bg-input transition-colors"
      >
        <FaRegTrashAlt />
      </button>
    </div>
  );
}
