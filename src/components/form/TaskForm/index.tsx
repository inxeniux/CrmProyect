// components/form/ModalTask/index.tsx
'use client';


interface ModalTaskProps {
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

export default function TaskForm({  formData, setFormData }: ModalTaskProps) {
 

 return (
 
       <div className="space-y-4">
         <div>
           <label className="block text-sm font-semibold mt-4 text-gray-700">Título de la Tarea</label>
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
             rows={8}
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
 );
}