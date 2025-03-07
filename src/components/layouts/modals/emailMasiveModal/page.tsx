"use client";

import AutoComplete from "@/components/ui/inputs/Autocomplete";
import React, { useState } from "react";
import { BsStars } from "react-icons/bs";
import AiEmailModal from "../aiTempletaEmailModal/page";

interface MassEmailModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

// Definir interfaz para los estados
interface StageItem {
  stage_id: number;
  name: string;
}

export default function MassEmailModal({ isOpen, onClose }: MassEmailModalProps) {
  // Corregir tipo de campaign para permitir string | number | null
  const [campaign, setCampaign] = useState<string | number | null>(null);
  const [status, setStatus] = useState<StageItem[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [funnel, setFunnel] = useState<number | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [openModalEmailAi, setOpenModalEmailAi] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
  
    const payload = { 
      funnel_id: funnel, 
      stage: campaign, 
      subject, 
      message 
    };
  
    console.log("Enviando datos:", payload);
  
    try {
      const res = await fetch("/api/sendemails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setResponse(`Correos enviados exitosamente (${data.results.length})`);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      console.log("Error en la solicitud:", error);
      setResponse("Error al enviar correos");
    } finally {
      setLoading(false);
    }
  };
  
  const handleStagesFunnel = async (funnelId: number) => {
    try {
      const response = await fetch(`/api/search/stages/${funnelId}`);
      const data = await response.json();

      if (response.ok) {
        setStatus(data);
      }
    } catch (err) {
      console.error("Error al buscar el embudo:", err);
    }
  };
  
  const handleFunnelSelect = (funnel: { name: string; funnel_id: number }) => {
    setFunnel(funnel.funnel_id);
    handleStagesFunnel(funnel.funnel_id);
  };

  return (
    <React.Fragment>
      <AiEmailModal 
        setMessage={setMessage} 
        setSubject={setSubject} 
        onClose={setOpenModalEmailAi} 
        isOpen={openModalEmailAi}
      />
      <div  
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-end transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => onClose(false)}
      >
        <div 
          onClick={(e) => e.stopPropagation()}  
          className={`w-1/2 fixed right-5 z-50 bottom-5 mx-auto p-6 bg-white shadow-lg transform transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          } rounded-xl`}
        >
          <h2 className="text-xl font-bold mb-4">Enviar correo masivo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AutoComplete onSelect={handleFunnelSelect}/>
        
            {status.length !== 0 && (
              <select
                value={campaign as string}
                onChange={(e) => setCampaign(e.target.value)}
                className="w-full p-2 border-none bg-gray-100 rounded"
              >
                <option value="">Selecciona un estado</option>
                {status.map((item) => (
                  <option key={item.stage_id} value={item.stage_id}>
                    {item.name}
                  </option>
                ))}
              </select>
            )}

            {/* Asunto */}
            <input
              type="text"
              placeholder="Asunto del correo"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border-none bg-gray-100 rounded"
              required
            />

            {/* Mensaje */}
            <textarea
              placeholder="Mensaje del correo"
              value={message}
              rows={10}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border-none bg-gray-100"
              required
            ></textarea>

            <div className="flex items-center">
              {/* Botón de envío */}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 text-sm rounded-xl transition"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Correos"}
              </button>
              <button 
                type="button"
                onClick={() => setOpenModalEmailAi(true)} 
                className="bg-black ml-2 text-white rounded-full p-3"
              >
                <BsStars/>
              </button>
            </div>
          </form>

          {/* Respuesta */}
          {response && (
            <p className="mt-4 p-2 bg-gray-100 text-center rounded">{response}</p>
          )}
        </div>
      </div>
    </React.Fragment>
  ); 
}