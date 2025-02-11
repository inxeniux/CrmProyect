'use client';

import { useState } from "react";
import { MdDelete, MdViewList, MdDashboard } from "react-icons/md";
import { FaEllipsisVertical } from "react-icons/fa6";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import ModalTask from "@/components/layouts/modals/modalTask";
import TaskBoard from "@/components/layouts/TasksBoard";
import useSWR from 'swr';

interface Task {
  task_id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  assigned_to: string;
}

interface FormData {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  assigned_to: string;
  patch: boolean;
}

const initialForm = {
  title: "",
  description: "",
  dueDate: "",
  status: "Pending",
  priority: "Medium",
  assigned_to: "",
  patch: false
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TasksPage() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const { data, error, isLoading, mutate } = useSWR<Task[]>('/api/tasks', fetcher);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (response.ok) {
        mutate();
        alert('Tarea eliminada exitosamente');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (task: Task) => {
    setOpenModal(true);
    setFormData({ ...task, patch: true });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <NavbarSideComponent setOpenModal={setOpenModal} nameButton="agregar tarea" name="Tareas">
      <ModalTask 
        formData={formData}
        setFormData={setFormData}
        getOpportunity={mutate}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      
      {/* Botón para cambiar de vista */}
      <div className="flex justify-end p-4">
        <button 
          onClick={() => setViewMode(viewMode === 'list' ? 'board' : 'list')}
          className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          {viewMode === 'list' ? <MdDashboard size={20} /> : <MdViewList size={20} />}
        </button>
      </div>

      {/* Renderiza la vista correspondiente */}
      {viewMode === 'list' ? (
        <div className="relative mx-5 mt-5 overflow-x-auto">
          <table className="w-full text-sm text-left rounded-lg overflow-hidden bg-light-bg-primary dark:bg-dark-bg-primary shadow-md">
            <thead className="text-xs uppercase bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary">
              <tr>
                <th className="px-6 py-3">Tareas</th>
                <th className="px-6 py-3">Prioridad</th>
                <th className="px-6 py-3">Asignada</th>
                <th className="px-6 py-3">Estatus</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((task) => (
                <tr key={task.task_id} className="border-b text-white hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary">
                  <td className="px-6 py-4">{task.title}</td>
                  <td className="px-6 py-4">{task.priority}</td>
                  <td className="px-6 py-4">{task.assigned_to}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${task.status === 'Completed' ? 'bg-success/10 text-success' : task.status === 'In Progress' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-light-text-tertiary/10 dark:bg-dark-text-tertiary/10 text-light-text-tertiary dark:text-dark-text-tertiary'}`}>{task.status}</span>
                  </td>
                  <td className="px-6 flex items-center py-4">
                    <button onClick={() => handleDelete(task.task_id)} className="p-2 mr-4 text-red-500 hover:text-red-700"><MdDelete /></button>
                    <button onClick={() => handleEdit(task)} className="p-2 text-gray-500 hover:text-gray-700"><FaEllipsisVertical /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <TaskBoard tasks={data || []} />
      )}
    </NavbarSideComponent>
  );
}
