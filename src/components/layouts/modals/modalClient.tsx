'use client';

import { Dispatch, SetStateAction } from "react";


export interface ClientForm {
  client_id: number;
  company_name: string;
  contact_name: string;
  position: string;
  phone_number: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  lead_source: string;
  industry: string;
  status: string;
  priority: string;
  assigned_to: string;
  tags: string;
  comments: string;
}


interface ModalClientProps {
  form: ClientForm;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  setForm: Dispatch<SetStateAction<ClientForm>>;
}

export default function ModalClient({  form, setForm }: ModalClientProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 
  return (
 
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-black font-semibold">Nombre de la Compañía</label>
              <input name="company_name" value={form.company_name} onChange={handleChange} className="w-full border  rounded-md mt-1 p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Nombre de Contacto</label>
              <input name="contact_name" value={form.contact_name} onChange={handleChange} className="w-full border rounded-md mt-1 p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Posición</label>
              <input name="position" value={form.position} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Número de Teléfono</label>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Sitio Web</label>
              <input name="website" value={form.website} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Dirección</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Ciudad</label>
              <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Estado</label>
              <input name="state" value={form.state} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Código Postal</label>
              <input name="postal_code" value={form.postal_code} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">País</label>
              <input name="country" value={form.country} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Fuente de Cliente</label>
              <input name="lead_source" value={form.lead_source} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Industria</label>
              <input name="industry" value={form.industry} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Estado</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border  border-gray-200 text-gray-500 rounded-md p-1">
                <option value="Prospect">Prospect</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Prioridad</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full border-gray-200 text-gray-500 rounded-md p-1">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Asignado a</label>
              <input name="assigned_to" value={form.assigned_to} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div>
              <label className="text-xs text-black font-semibold">Etiquetas</label>
              <input name="tags" value={form.tags} onChange={handleChange} className="w-full border rounded-md p-1" />
            </div>

            <div className="col-span-2">
              <label className="text-xs text-black font-semibold">Comentarios</label>
              <textarea name="comments" value={form.comments} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-1" />
            </div>
          </form>
     

  );
}