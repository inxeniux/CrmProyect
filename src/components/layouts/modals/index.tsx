'use client';

import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { FunnelForm } from "@/components/form/FunnelForm";

interface ModalFunnelProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  getOpportunity?: () => void;
}

// Actualizar la interfaz FormData para que coincida con lo que espera FunnelForm
interface FunnelFormData {
  name: string;
  description: string;
  inputs?: Array<{
    id: number;
    name: string;
    description: string;
    position: number;
  }>;
  patch: boolean;
}

export default function ModalFunnel({ openModal, setOpenModal }: ModalFunnelProps) {
  const [formData, setFormData] = useState<FunnelFormData>({
    name: "",
    description: "",
    inputs: [],
    patch: false // Añadir la propiedad patch requerida
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/funnels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Embudo creado exitosamente!');
        setOpenModal(false);
      }
    } catch (err) {
      console.error('Error al crear el embudo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header className="bg-dark-bg-primary">Crear Funnel</Modal.Header>
      <Modal.Body className="bg-white">
        <FunnelForm formData={formData} setFormData={setFormData}/>
      </Modal.Body>
      <Modal.Footer className="bg-white">
        <Button
          color="orange"
          className={`bg-orange-600 text-white hover:bg-orange-500 ${loading ? 'cursor-not-allowed' : ''}`}
          onClick={!loading ? handleSubmit : undefined}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                ></path>
              </svg>
              Cargando...
            </div>
          ) : (
            'Guardar'
          )}
        </Button>
        <Button color="orange" onClick={() => setOpenModal(false)}>
          Denegar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}