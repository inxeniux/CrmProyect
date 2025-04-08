"use client";

import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { FunnelForm } from "@/components/form/FunnelForm";
import { FaPlus } from "react-icons/fa";

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

export default function ModalFunnel({
  openModal,
  setOpenModal,
}: ModalFunnelProps) {
  const [formData, setFormData] = useState<FunnelFormData>({
    name: "",
    description: "",
    inputs: [],
    patch: false,
  });

  const [loading, setLoading] = useState(false);

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

      if (response.ok) {
        alert("Embudo creado exitosamente!");
        setOpenModal(false);
      }
    } catch (err) {
      console.error("Error al crear el embudo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={
          openModal
            ? "fixed inset-0 z-40 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
            : "hidden"
        }
      />
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="lg"
        className="z-50"
        dismissible
      >
        <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-t-lg">
          <Modal.Header className="border-b border-light-border-light dark:border-dark-border-light bg-light-bg-secondary dark:bg-dark-bg-secondary">
            <div className="flex items-center gap-2 text-light-text-primary dark:text-dark-text-primary">
              <FaPlus className="text-primary-50" />
              <span>Crear Nuevo Embudo</span>
            </div>
          </Modal.Header>
          <Modal.Body className="bg-light-bg-primary dark:bg-dark-bg-primary">
            <FunnelForm formData={formData} setFormData={setFormData} />
          </Modal.Body>
          <Modal.Footer className="border-t border-light-border-light dark:border-dark-border-light bg-light-bg-secondary dark:bg-dark-bg-secondary">
            <div className="flex gap-3 w-full justify-end">
              <Button
                onClick={() => setOpenModal(false)}
                className="px-5 bg-light-bg-input dark:bg-dark-bg-input text-light-text-primary dark:text-dark-text-primary hover:bg-light-border-medium dark:hover:bg-dark-border-medium border border-light-border-light dark:border-dark-border-light"
              >
                Cancelar
              </Button>
              <Button
                className={`px-5 bg-primary-50 hover:bg-primary-600 focus:ring-4 focus:ring-primary-50 focus:ring-opacity-50 text-white ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
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
                    <span>Guardando...</span>
                  </div>
                ) : (
                  "Guardar Embudo"
                )}
              </Button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}
