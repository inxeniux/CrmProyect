// components/form/ModalGeneral/index.tsx
'use client';

import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import OpportunityForm from "@/components/form/OpportunityForm";

interface ModalGeneralProps {
 openModal: boolean;
 setOpenModal: (open: boolean) => void;
 id: string;
}

interface FormData {
  client_id: number,
  deal_value: string,
  stage: string,
  notes: string,
  deal_closing_date: string,
 funnel_id: number;
}

export default function ModalGeneral({ openModal, setOpenModal, id }: ModalGeneralProps) {
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState<FormData>({
   client_id: 0,
   deal_value: '',
   stage: '',
   notes: '',
   deal_closing_date: '',
   funnel_id: parseInt(id)
 });

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setLoading(true);
   
   try {
     const response = await fetch('/api/prospects', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
     });

     if (response.ok) {
       alert('Lead creado exitosamente!');
       setOpenModal(false);
     }
   } catch (err) {
     console.error('Error:', err);
   } finally {
     setLoading(false);
   }
 };

 return (
   <Modal  show={openModal} onClose={() => setOpenModal(false)}>
     <Modal.Header className="bg-dark-bg-primary">Crear lead</Modal.Header>
     <Modal.Body className="bg-white">
       <OpportunityForm id={id} formData={formData} setFormData={setFormData}/>
     </Modal.Body>
     <Modal.Footer className="bg-white">
       <Button
       color="orange"
         className={`bg-orange-600 hover:bg-orange-500 text-white ${loading ? 'cursor-not-allowed' : ''}`}
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
               />
               <path
                 className="opacity-75"
                 fill="currentColor"
                 d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
               />
             </svg>
             Cargando...
           </div>
         ) : (
           'Guardar'
         )}
       </Button>
       <Button color="orange" onClick={() => setOpenModal(false)}>
         Decline
       </Button>
     </Modal.Footer>
   </Modal>
 );
}