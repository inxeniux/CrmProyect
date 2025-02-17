// app/clients/page.tsx
'use client';

import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEllipsisVertical } from "react-icons/fa6";
import ModalClient from "@/components/layouts/modals/modalClient";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import SideModal from "@/components/layouts/SideModal";

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
 client_id:0,
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





export default function ClientPage() {
 const [openModal, setOpenModal] = useState<boolean>(false);
 const onClose = () => setOpenModal(false)
 const [form, setForm] = useState(initialForm);
 const [patch, setPatch] = useState<boolean>(false);
 const [loading, setLoading] = useState<boolean>(false);
 const [isLoading, setIsLoading] = useState<boolean>(true);
 const [error, setError] = useState<string>('');
 const [data, setData] = useState<Client[]>([]);
 

const fetchClient = async () => {
   
  setIsLoading(true);
  try {
    const response = await fetch(`/api/clients`);
    const data = await response.json()
    if (response.ok) {
     setData(data)
     setIsLoading(false);
    }
  } catch (err) {
    setIsLoading(false)
    setError(err instanceof Error ? err.message : 'Error ocurrido')
    console.error('Error:', err);
  }
};

 const handleDelete = async (id: number) => {
   try {
     const response = await fetch(`/api/clients/${id}`, {
       method: 'DELETE'
     });
     
     if (response.ok) {
       alert('Cliente eliminado exitosamente!');
       fetchClient();
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

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  

  try {
    const response = await fetch(patch ? `/api/clients/${form.client_id}` : '/api/clients', {
      method: patch ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert(patch ? 'Cliente Actualizado exitosamente!' : 'Cliente creado exitosamente!');
      setOpenModal(false);
      fetchClient();
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
};


const handleSearchFunnel = async (name:string) =>{
    
  try {
     
      const response = await fetch(`/api/search/${name}?table=client`);
      const data = await response.json();
    
      if (response.ok) {
        setData(data);
      }
    } catch (err) {
      console.error("Error al buscar el embudo:", err);
    }
  
  };

  useEffect(()=>{
    fetchClient();
  },[])


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchClient()}
          className="px-4 py-2 bg-primary-50 text-white rounded hover:bg-primary-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

 return (
   <NavbarSideComponent 
     setOpenModal={setOpenModal} 
     nameButton="agregar cliente" 
     name="Clientes"
   >

<SideModal patch={patch} isOpen={openModal} loading={loading} onClose={onClose} title={"Crear Funnel"} onSubmit={handleSubmit}> 
        <ModalClient form={form} openModal={openModal} setOpenModal={setOpenModal} setForm={setForm}   />
      </SideModal>
     
    
     

    <div className="relative mx-5 mt-5 overflow-x-auto">
    <label htmlFor="table-search" className="sr-only">
      Buscador
    </label>
    <div className="relative my-5">
      <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="text"
        id="table-search"
        onInput={(e)=>handleSearchFunnel(e.currentTarget.value)}
        className="block pt-2 ps-10 text-sm w-80 rounded-lg
          bg-light-bg-input dark:bg-dark-bg-input 
          border border-light-border-medium dark:border-dark-border-medium
          text-light-text-primary dark:text-dark-text-primary
          placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary
          focus:ring-brand-accent focus:border-brand-accent"
        placeholder="Buscar embudo"
      />
    </div>
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