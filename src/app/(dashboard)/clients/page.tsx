// app/clients/page.tsx
'use client';

import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEllipsisVertical } from "react-icons/fa6";
import ModalClient from "@/components/layouts/modals/modalClient";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import useSWR from 'swr';

interface Client {
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

const initialForm = {
 company_name: "",
 contact_name: "",
 position: "",
 phone_number: "",
 email: "",
 website: "",
 address: "",
 city: "",
 state: "",
 postal_code: "",
 country: "",
 lead_source: "",
 industry: "",
 status: "Prospect",
 priority: "Medium",
 assigned_to: "",
 tags: "",
 comments: ""
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ClientPage() {
 const [openModal, setOpenModal] = useState(false);
 const [form, setForm] = useState(initialForm);
 const [patch, setPatch] = useState(false);

 const { data, error, isLoading, mutate } = useSWR<Client[]>('/api/clients', fetcher);

 const handleDelete = async (id: number) => {
   try {
     const response = await fetch(`/api/clients/${id}`, {
       method: 'DELETE'
     });
     
     if (response.ok) {
       alert('Cliente eliminado exitosamente!');
       mutate();
     }
   } catch (err) {
     console.error('Error al eliminar:', err);
   }
 };

 const handleEdit = (client: Client) => {
   setOpenModal(true);
   setForm(client);
   setPatch(true);
 };

 if (isLoading) return <p>Cargando...</p>;
 if (error) return <p>Error: {error.message}</p>;

 return (
   <NavbarSideComponent 
     setOpenModal={setOpenModal} 
     nameButton="agregar cliente" 
     name="Clientes"
   >
     <ModalClient 
       form={form} 
       patch={patch}
       setForm={setForm} 
       fetchData={mutate} 
       openModal={openModal} 
       setOpenModal={setOpenModal} 
     />
    
     
    <div className="relative mx-5 mt-5 overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right rounded-lg overflow-hidden
        bg-light-bg-primary dark:bg-dark-bg-primary
        shadow-md">
        <thead className="text-xs uppercase 
          bg-light-bg-secondary dark:bg-dark-bg-secondary
          text-light-text-primary dark:text-dark-text-primary">
          <tr>
            <th scope="col" className="p-4">
              <input
                type="checkbox"
                className="w-4 h-4 rounded
                  bg-light-bg-input dark:bg-dark-bg-input
                  border-light-border-medium dark:border-dark-border-medium
                  text-brand-accent focus:ring-brand-accent"
              />
            </th>
            <th scope="col" className="px-6 py-3">Nombre</th>
            <th scope="col" className="px-6 py-3">Compañia</th>
            <th scope="col" className="px-6 py-3">Telefono</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Prioridad</th>
            <th scope="col" className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((client) => (
            <tr key={client.client_id} 
              className="border-b transition-colors
                border-light-border-light dark:border-dark-border-light
                bg-light-bg-primary dark:bg-dark-bg-primary
                hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary">
              <td className="w-4 p-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded
                    bg-light-bg-input dark:bg-dark-bg-input
                    border-light-border-medium dark:border-dark-border-medium
                    text-brand-accent focus:ring-brand-accent"
                />
              </td>
              <th className="px-6 py-4 font-medium whitespace-nowrap
                text-light-text-primary dark:text-dark-text-primary">
                {client.contact_name}
              </th>
              <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                {client.company_name}
              </td>
              <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                {client.phone_number}
              </td>
              <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                {client.email}
              </td>
              <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                {client.priority}
              </td>
              <td className="px-6 flex items-center py-4">
                <button
                  onClick={() => handleDelete(client.client_id)}
                  className="font-medium p-2 mr-4 rounded-md
                    bg-error-light/10 dark:bg-error-dark/10
                    text-error-light dark:text-error-dark
                    hover:bg-error-light/20 dark:hover:bg-error-dark/20"
                >
                  <MdDelete/>
                </button>
                <button
                  onClick={() => handleEdit(client)}
                  className="font-medium p-2 rounded-md
                    text-light-text-tertiary dark:text-dark-text-tertiary
                    hover:text-light-text-primary dark:hover:text-dark-text-primary
                    hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                >
                  <FaEllipsisVertical/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   </NavbarSideComponent>
 );
}