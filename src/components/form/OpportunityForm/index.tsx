// components/form/OpportunityForm/index.tsx
'use client';

import AutoCompleteClient from '@/components/ui/inputs/AutocompleteClient';
import { useEffect, useState } from 'react';

interface FormProps {
 formData: {
   client_id: number;
   deal_value: number;
   stage: string;
   notes: string;
   deal_closing_date: string;
 };
 setFormData: (data: any) => void;
 id: string;
}



export default function OpportunityForm({ formData, setFormData, id }: FormProps) {
 const [data,setData] = useState([]);
 const [isLoading,setIsLoading] = useState(false);
 const [error,setError] = useState('');
 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  setFormData((prev: any) => ({
    ...prev,
    [name]: name === "client_id" || name === "deal_value" ? Number(value) : value
  }));
};

const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;

  setFormData((prev: any) => ({
    ...prev,
    deal_closing_date: value ? new Date(value).toISOString() : ""  // 🔹 Convierte solo si hay un valor
  }));
};

const fetchTask = async () => {
  
  try {
    const response = await fetch(`/api/prospects/stages/${id}`);
    const data = await response.json()
    if (response.ok) {
     setData(data)
  
    }
  } catch (err) {
    setIsLoading(false)
    setError(err instanceof Error ? err.message : 'Error ocurrido')
    console.error('Error:', err);
  }
};

const handleFunnelSelect = (client: { name: string; client_id: number }) => {
  setFormData((prevState)=>({
    ...prevState,
    client_id:client.client_id
  }))


};


useEffect(()=>{
 fetchTask();
},[])




 if (isLoading) return <p>Cargando...</p>;
 if (error) return <p>Error: {error}</p>;
 if (!data) return null;

 return (
   <form className="rounded-md">
     <div className="mb-4">
       <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
         Cliente
       </label>
        <AutoCompleteClient onSelect={handleFunnelSelect}/>
           
      
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
           <option  value={""}>
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
         value={formData.deal_closing_date}
         onChange={handleDateChange}
         className="w-full p-2 mt-2 border border-gray-300 rounded-md"
       />
     </div>
   </form>
 );
}