// components/form/TaskForm/index.tsx
"use client";

// Define the TaskFormData interface to match the parent component's FormData
interface TaskFormData {
  task_id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  assigned_to: string;
  patch: boolean;
}

interface ModalTaskProps {
  formData: TaskFormData;
  setFormData: (data: TaskFormData) => void;
}

export default function TaskForm({ formData, setFormData }: ModalTaskProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mt-4 dark:text-dark-text-primary text-light-text-primary">
          Título de la Tarea
        </label>
        <input
          type="text"
          value={formData?.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border text-sm dark:border-dark-border-medium border-light-border-medium dark:bg-dark-bg-input bg-light-bg-input mt-1 rounded-md dark:text-dark-text-primary text-light-text-primary focus:ring-primary-50 focus:border-primary-50"
          placeholder="Ingrese el título de la tarea"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold dark:text-dark-text-primary text-light-text-primary">
          Descripción
        </label>
        <textarea
          value={formData?.description}
          rows={8}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 border text-sm dark:border-dark-border-medium border-light-border-medium dark:bg-dark-bg-input bg-light-bg-input mt-1 rounded-md dark:text-dark-text-primary text-light-text-primary focus:ring-primary-50 focus:border-primary-50"
          placeholder="Descripción de la tarea"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold dark:text-dark-text-primary text-light-text-primary">
          Fecha de Vencimiento
        </label>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={(e) =>
            setFormData({
              ...formData,
              due_date: e.target.value, // Esto ya dará el formato YYYY-MM-DD
            })
          }
          className="w-full p-2 border mt-1 text-sm dark:border-dark-border-medium border-light-border-medium dark:bg-dark-bg-input bg-light-bg-input rounded-md dark:text-dark-text-primary text-light-text-primary focus:ring-primary-50 focus:border-primary-50"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold dark:text-dark-text-primary text-light-text-primary">
          Estado
        </label>
        <select
          value={formData?.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 mt-1 text-sm dark:border-dark-border-medium border-light-border-medium dark:bg-dark-bg-input bg-light-bg-input rounded-md dark:text-dark-text-primary text-light-text-primary focus:ring-primary-50 focus:border-primary-50"
        >
          <option value="Pending">Pendiente</option>
          <option value="In_Progress">En Progreso</option>
          <option value="Completed">Completada</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold dark:text-dark-text-primary text-light-text-primary">
          Prioridad
        </label>
        <select
          value={formData?.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
          className="w-full p-2 mt-1 text-sm dark:border-dark-border-medium border-light-border-medium dark:bg-dark-bg-input bg-light-bg-input rounded-md dark:text-dark-text-primary text-light-text-primary focus:ring-primary-50 focus:border-primary-50"
        >
          <option value="Low">Baja</option>
          <option value="Medium">Media</option>
          <option value="High">Alta</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold dark:text-dark-text-primary text-light-text-primary">
          Asignado A
        </label>
        <input
          type="text"
          value={formData?.assigned_to}
          onChange={(e) =>
            setFormData({ ...formData, assigned_to: e.target.value })
          }
          className="w-full p-2 mt-1 text-sm dark:border-dark-border-medium border-light-border-medium dark:bg-dark-bg-input bg-light-bg-input rounded-md dark:text-dark-text-primary text-light-text-primary focus:ring-primary-50 focus:border-primary-50"
          placeholder="Nombre del encargado"
        />
      </div>
    </div>
  );
}
