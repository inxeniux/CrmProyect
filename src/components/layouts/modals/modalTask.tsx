// components/form/ModalTask/index.tsx
'use client';

import { useState } from "react";
import { Button, Modal } from "flowbite-react";

interface ModalTaskProps {
 openModal: boolean;
 setOpenModal: (open: boolean) => void;
 getOpportunity: () => void;
 formData: {
   task_id?: number;
   title: string;
   description: string;
   due_date: string;
   status: string;
   priority: string;
   assigned_to: string;
   patch?: boolean;
 };
 setFormData: (data: any) => void;
}

export default function ModalTask({ openModal, setOpenModal, getOpportunity, formData, setFormData }: ModalTaskProps) {
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Asegurarnos de que la fecha esté en el formato correcto para Prisma
    const taskData = {
      title: formData.title,
      description: formData.description,
      // Convertir la fecha a formato ISO completo
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      status: formData.status,
      priority: formData.priority,
      assigned_to: formData.assigned_to
    };

    const response = await fetch(
      formData.patch ? `/api/tasks/${formData.task_id}` : '/api/tasks',
      {
        method: formData.patch ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      }
    );

    if (response.ok) {
      alert(formData.patch ? 'Tarea actualizada exitosamente!' : 'Tarea creada exitosamente!');
      setOpenModal(false);
      getOpportunity();
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Error al procesar la tarea');
    }
  } catch (err) {
    console.error('Error:', err);
    alert(err.message || 'Error al procesar la tarea');
  } finally {
    setLoading(false);
  }
};

 return (
   <Modal show={openModal} onClose={() => setOpenModal(false)}>
     <Modal.Header className="bg-dark-bg-primary">{formData.patch ? 'Editar Tarea' : 'Crear Tarea'}</Modal.Header>
     <Modal.Body className="bg-white">
       <div className="space-y-4">
         <div>
           <label className="block text-sm font-semibold text-gray-700">Título de la Tarea</label>
           <input
             type="text"
             value={formData?.title}
             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
             className="w-full p-2 border text-sm border-gray-300 mt-1 rounded-md focus:ring-orange-500 focus:border-orange-500"
             placeholder="Ingrese el título de la tarea"
           />
         </div>

         <div>
           <label className="block text-sm font-semibold text-gray-700">Descripción</label>
           <textarea
             value={formData?.description}
             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
             className="w-full p-2 border text-sm border-gray-300 mt-1 rounded-md focus:ring-orange-500 focus:border-orange-500"
             placeholder="Descripción de la tarea"
           />
         </div>

         <div>
           <label className="block text-sm font-semibold text-gray-700">Fecha de Vencimiento</label>
           <input
  type="date"
  name="due_date"
  value={formData.due_date}
  onChange={(e) => setFormData({ 
    ...formData, 
    due_date: e.target.value // Esto ya dará el formato YYYY-MM-DD
  })}
  className="w-full p-2 border mt-1 text-sm border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
/>
         </div>

         <div>
           <label className="block text-sm font-semibold text-gray-700">Estado</label>
           <select
             value={formData?.status}
             onChange={(e) => setFormData({ ...formData, status: e.target.value })}
             className="w-full p-2 mt-1 text-sm border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
           >
             <option value="Pending">Pendiente</option>
             <option value="In_Progress">En Progreso</option>
             <option value="Completed">Completada</option>
           </select>
         </div>

         <div>
           <label className="block text-sm font-semibold text-gray-700">Prioridad</label>
           <select
             value={formData?.priority}
             onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
             className="w-full p-2 mt-1 text-sm border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
           >
             <option value="Low">Baja</option>
             <option value="Medium">Media</option>
             <option value="High">Alta</option>
           </select>
         </div>

         <div>
           <label className="block text-sm font-semibold text-gray-700">Asignado A</label>
           <input
             type="text"
             value={formData?.assigned_to}
             onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
             className="w-full p-2 mt-1 text-sm border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
             placeholder="Nombre del encargado"
           />
         </div>
       </div>
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
             <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"/>
             </svg>
             Cargando...
           </div>
         ) : (
           formData.patch ? 'Actualizar' : 'Guardar'
         )}
       </Button>
       <Button color="orange" onClick={() => setOpenModal(false)}>
         Cancelar
       </Button>
     </Modal.Footer>
   </Modal>
 );
}