// app/funnels/FunnelsComponent.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import useSWR from "swr";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import SideModal from "@/components/layouts/SideModal";
import { FunnelForm } from "@/components/form/FunnelForm";

interface Funnel {
  funnel_id: number;
  name: string;
  description: string;
}

// Renombrado para coincidir con FunnelForm
interface FunnelFormData {
  name: string;
  description: string;
  inputs?: {
    id: number;
    name: string;
    description: string;
    position: number;
  }[];
  patch: boolean;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export default function FunnelsPage() {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<FunnelFormData>({
    name: "",
    description: "",
    inputs: [],
    patch: false,
  });
  const [loading, setLoading] = useState(false);

  const {
    data: funnels,
    error,
    isLoading,
    mutate,
  } = useSWR<Funnel[]>("/api/funnels", fetcher);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/funnels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create funnel");
      }

      await mutate();
      alert("Embudo creado exitosamente!");
      setOpenModal(false);
      setFormData({ name: "", description: "", inputs: [], patch: false });
    } catch (err) {
      console.error("Error al crear el embudo:", err);
      alert("Error al crear el embudo");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await fetch(`/api/funnels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete funnel");
      }

      await mutate();
      alert("Embudo eliminado exitosamente!");
    } catch (err) {
      console.error("Error al eliminar el embudo:", err);
      alert("Error al eliminar el embudo");
    }
  };

  const handleSearchFunnel = async (name: string) => {
    try {
      const response = await fetch(`/api/search/${name}?table=funnel`);
      if (!response.ok) {
        throw new Error("Search failed");
      }

      const searchResults = await response.json();
      await mutate(searchResults, false);
    } catch (err) {
      console.error("Error al buscar el embudo:", err);
    }
  };

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
        <p className="text-red-500 mb-4">{error.message}</p>
        <button
          onClick={() => mutate()}
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
      nameButton="agregar funnel"
      name="Embudos"
    >
      <SideModal
        patch={formData.patch}
        isOpen={openModal}
        loading={loading}
        onClose={() => setOpenModal(false)}
        title="Crear Funnel"
        onSubmit={handleSubmit}
      >
        <FunnelForm formData={formData} setFormData={setFormData} />
      </SideModal>

      <div className="relative mx-5 mt-5 overflow-x-auto">
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
              onChange={(e) => handleSearchFunnel(e.target.value)}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {funnels?.map((funnel) => (
            <div
              key={funnel.funnel_id}
              onClick={() => router.push(`/${funnel.funnel_id}`)}
              className="relative cursor-pointer text-left rounded-lg shadow-md p-6
                bg-light-bg-primary dark:bg-dark-bg-primary
                border border-light-border-light dark:border-dark-border-light
                hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
            >
              <button
                onClick={(e) => handleDelete(funnel.funnel_id, e)}
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
