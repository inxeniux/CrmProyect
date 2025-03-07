
// app/tasks/TasksComponent.tsx
'use client';

import { useEffect, useState, useCallback } from "react";
import { MdDelete, MdViewList, MdDashboard } from "react-icons/md";
import { FaEllipsisVertical } from "react-icons/fa6";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import { TaskBoards } from "@/components/layouts/TaskBoards";
import SideModal from "@/components/layouts/SideModal";
import TaskForm from "@/components/form/TaskForm";


// types/task.ts
interface Task {
    task_id: number;
    title: string;
    description: string;
    due_date: string;
    status: 'Pending' | 'In_Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    assigned_to: string;
  }
  
  interface FormData extends Omit<Task, 'status' | 'priority'> {
    status: string;
    priority: string;
    patch: boolean;
  }
const initialForm: FormData = {
  task_id: 0,
  title: "",
  description: "",
  due_date: "",
  status: "Pending",
  priority: "Medium",
  assigned_to: "",
  patch: false
};

export default function TasksComponent() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasksData = await response.json();
      setData(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      await fetchTasks();
      alert('Tarea eliminada exitosamente');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar la tarea');
    }
  };

  const handleEdit = (task: Task) => {
    setFormData({ 
      ...task, 
      patch: true 
    });
    setOpenModal(true);
  };

  const handleSearch = async (name: string) => {
    try {
      const response = await fetch(`/api/search/${name}?table=task`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const searchResults = await response.json();
      setData(searchResults);
    } catch (err) {
      console.error("Error al buscar la tarea:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al procesar la tarea');
      }

      await fetchTasks();
      alert(formData.patch ? 'Tarea actualizada exitosamente!' : 'Tarea creada exitosamente!');
      setOpenModal(false);
      setFormData(initialForm);
    } catch (err) {
      console.error('Error:', err);
      alert(err instanceof Error ? err.message : 'Error al procesar la tarea');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchTasks}
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
      nameButton="agregar tarea" 
      name="Tareas"
    >
      <SideModal 
        patch={formData.patch}
        isOpen={openModal} 
        loading={loading} 
        onClose={() => {
          setOpenModal(false);
          setFormData(initialForm);
        }} 
        title={formData.patch ? "Editar tarea" : "Crear tarea"}
        onSubmit={handleSubmit}
      >
        <TaskForm 
          formData={formData} 
          setFormData={setFormData}
        />
      </SideModal>

      <div className="flex justify-between p-4">
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
            onChange={(e) => handleSearch(e.target.value)}
            id="table-search"
            className="block pt-2 ps-10 text-sm w-80 rounded-lg
              bg-light-bg-input dark:bg-dark-bg-input 
              border border-light-border-medium dark:border-dark-border-medium
              text-light-text-primary dark:text-dark-text-primary
              placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary
              focus:ring-brand-accent focus:border-brand-accent"
            placeholder="Buscar tarea"
          />
        </div>

        <button 
          onClick={() => setViewMode(viewMode === 'list' ? 'board' : 'list')}
          className="bg-light-bg-primary text-sm text-white dark:bg-dark-bg-primary p-2 rounded-lg shadow-md 
                    border border-light-border-light dark:border-dark-border-light"
        >
          {viewMode === 'list' ? <MdDashboard size={20} /> : <MdViewList size={20} />}
        </button>
      </div>

      {viewMode === 'list' ? (
        <TaskList 
          tasks={data} 
          onDelete={handleDelete} 
          onEdit={handleEdit} 
        />
      ) : (
        <TaskBoards task={data} />
      )}
    </NavbarSideComponent>
  );
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
}

function TaskList({ tasks, onDelete, onEdit }: TaskListProps) {
  return (
    <div className="relative mx-5 mt-5 overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right rounded-lg overflow-hidden
        bg-light-bg-primary dark:bg-dark-bg-primary shadow-md">
        <thead className="text-xs uppercase 
          bg-light-bg-secondary dark:bg-dark-bg-secondary
          text-light-text-primary dark:text-dark-text-primary">
          <tr>
            <th scope="col" className="px-6 py-3">Tareas</th>
            <th scope="col" className="px-6 py-3">Prioridad</th>
            <th scope="col" className="px-6 py-3">Asignada</th>
            <th scope="col" className="px-6 py-3">Estatus</th>
            <th scope="col" className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.task_id} 
              className="border-b transition-colors
                border-light-border-light dark:border-dark-border-light
                bg-light-bg-primary dark:bg-dark-bg-primary
                hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary">
              <th className="px-6 py-4 font-medium whitespace-nowrap
                text-light-text-primary dark:text-dark-text-primary">
                {task.title}
              </th>
              <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                {task.priority}
              </td>
              <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                {task.assigned_to}
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  task.status === 'Completed' 
                    ? 'bg-success/10 text-success' 
                    : task.status === 'In_Progress' 
                      ? 'bg-brand-accent/10 text-brand-accent' 
                      : 'bg-light-text-tertiary/10 dark:bg-dark-text-tertiary/10 text-light-text-tertiary dark:text-dark-text-tertiary'
                }`}>
                  {task.status}
                </span>
              </td>
              <td className="px-6 flex items-center py-4">
                <button 
                  onClick={() => onDelete(task.task_id)}
                  className="p-2 mr-4 text-red-500 hover:text-red-700"
                >
                  <MdDelete />
                </button>
                <button 
                  onClick={() => onEdit(task)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FaEllipsisVertical />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}