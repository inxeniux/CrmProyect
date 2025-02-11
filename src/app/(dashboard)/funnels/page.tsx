// app/funnels/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from "react-icons/ri";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import ModalFunnel from "@/components/layouts/modals/index";
import useSWR, { mutate } from 'swr';

interface Funnel {
  funnel_id: number;
  name: string;
  description: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function FunnelsPage() {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
 
  const { data, error, isLoading } = useSWR<Funnel[]>('/api/funnels', fetcher);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/funnels/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Embudo eliminado exitosamente!');
        mutate('/api/funnels'); // Revalidate data
      
      }
    } catch (err) {
      console.error('Error al eliminar el embudo:', err);
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <NavbarSideComponent 
      setOpenModal={setOpenModal} 
      nameButton="agregar funnel" 
      name="Embudos"
    >
      <ModalFunnel openModal={openModal} setOpenModal={setOpenModal} />
      
      <div className="relative mx-5 mt-5 overflow-x-auto">
  {/* Search Section */}
  <div className="pb-4">
    <label htmlFor="table-search" className="sr-only">
      Buscador
    </label>
    <div className="relative mt-1">
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
        className="block pt-2 ps-10 text-sm w-80 rounded-lg
          bg-light-bg-input dark:bg-dark-bg-input 
          border border-light-border-medium dark:border-dark-border-medium
          text-light-text-primary dark:text-dark-text-primary
          placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary
          focus:ring-brand-accent focus:border-brand-accent"
        placeholder="Buscar embudo"
      />
    </div>
  </div>

  {/* Funnel Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.isArray(data) && data?.map((funnel) => (
      <div
        key={funnel.funnel_id}
        onClick={() => router.push(`/${funnel.funnel_id}`)}
        className="relative cursor-pointer text-left rounded-lg shadow-md p-6
          bg-light-bg-primary dark:bg-dark-bg-primary
          border border-light-border-light dark:border-dark-border-light
          hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(funnel.funnel_id);
          }}
          className="absolute right-3 top-3 p-2 rounded-full
            bg-error-light/10 dark:bg-error-dark/10
            text-error-light dark:text-error-dark
            hover:bg-error-light/20 dark:hover:bg-error-dark/20"
        >
          <RiDeleteBin6Line />
        </button>

        <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
          {funnel.name}
        </h3>
        <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
          {funnel.description}
        </p>
      </div>
    ))}
  </div>
</div>
    </NavbarSideComponent>
  );
}