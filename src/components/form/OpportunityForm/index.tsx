// components/form/OpportunityForm/index.tsx
'use client';

import AutoCompleteClient from '@/components/ui/inputs/AutocompleteClient';
import { useEffect, useState } from 'react';

interface FormData {
  client_id: number;
  funnel_id: number;
  deal_value: number;
  stage: string;
  notes: string;
  deal_closing_date: string;
}

interface Select {
  stage_id: number;
  name: string;
}

interface Client {
  client_id: number;
  contact_name: string;
  email?: string;
}

interface FormProps {
  formData: FormData; 
  setFormData: (data: FormData) => void;
  id: string;
}

export default function OpportunityForm({ formData, setFormData, id }: FormProps) {
  const [data, setData] = useState<Select[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData, // Mantiene los demás valores
      [name]:
        name === "client_id" || name === "deal_value" ? Number(value) : value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFormData({
      ...formData,
      deal_closing_date: value ? new Date(value).toISOString() : ""
    });
  };

  const fetchTask = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/prospects/stages/${id}`);
      if (response.ok) {
        const fetchedData = await response.json();
        setData(fetchedData);
      } else {
        throw new Error('Error al cargar los datos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error ocurrido');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSelect = (client: Client) => {
    setFormData({
      ...formData,
      client_id: client.client_id
    });
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  return (
    <form className="rounded-md">
      <div className="mb-4">
        <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <AutoCompleteClient onSelect={handleClientSelect} />
      </div>

      <div className="mb-4">
        <label htmlFor="deal_value" className="block text-sm font-medium text-gray-700">
          Valor del prospecto
        </label>
        <input
          type="number"
          id="deal_value"
          name="deal_value"
          value={formData.deal_value}
          onChange={handleChange}
          placeholder="Ingresa el valor"
          required
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
          Estatus
        </label>
        <select
          id="stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          required
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
        >
          <option value={""}>
            Selecciona una opcion
          </option>
          {data.length > 0 && data.map((item) => (
            <option key={item.stage_id} value={item.stage_id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Nota
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter opportunity details"
          rows={4}
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="deal_closing_date" className="block text-sm font-medium text-gray-700">
          Dia de cierre
        </label>
        <input
          type="date"
          id="deal_closing_date"
          name="deal_closing_date"
          value={formData.deal_closing_date.substring(0, 10)} // Extraer solo la parte de la fecha YYYY-MM-DD
          onChange={handleDateChange}
          className="w-full p-2 mt-2 border border-gray-300 rounded-md"
        />
      </div>
    </form>
  );
}