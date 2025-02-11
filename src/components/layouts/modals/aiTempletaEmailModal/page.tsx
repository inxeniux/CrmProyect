"use client";


import { useState } from "react";

interface MassEmailModalProps  {
  isOpen:boolean
  onClose:(open:boolean) => void;
  setMessage: (message: string) => void;
  setSubject:(message: string) => void;
}

export default function AiEmailModal({isOpen,onClose,setMessage,setSubject}:MassEmailModalProps) {
  const [messageProps, setMessageProps] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
  
   
    try {
      const res = await fetch("/api/email-template/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({rawText:messageProps}),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log(data)
        setResponse("Plantilla Generada");
        setMessage(data.body)
        setSubject(data.subject)
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
  




  

  return (
    <div  className={`fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`} onClick={()=>onClose(false)}>
    <div        onClick={(e) => e.stopPropagation()}  className={`max-w-2xl min-w-[30%]  fixed  z-50   mx-auto p-6 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'} rounded-xl`}>
      <h2 className="text-xl font-bold mb-4">Enviar correo masivo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
           {/* Campaña */}


       

        

        {/* Propter */}
        <textarea
          placeholder="Describenos tu correo destinatario etc."
          value={messageProps}
          onChange={(e) => setMessageProps(e.target.value)}
          className="w-full p-2 border-none bg-gray-100  h-24"
          required
        ></textarea>

      
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 text-sm rounded-xl  transition"
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar correo"}
        </button>
        
        
      </form>

      {/* Respuesta */}
      {response && (
        <p className="mt-4 p-2 bg-gray-100 text-center rounded">{response}</p>
      )}
    </div>
    </div>
  );
}
