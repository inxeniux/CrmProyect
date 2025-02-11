import React, { useState, useEffect } from "react";

interface Task {
  task_id: number;
  name: string;
  description: string;
  status: "Pending" | "In_Progress" | "Completed";
}

interface TaskBoardProps {
  tasks: Task[];
  updateTaskStatus: (taskId: number, newStatus: "Pending" | "In_Progress" | "Completed") => Promise<void>;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, updateTaskStatus }) => {
  const [taskData, setTaskData] = useState<Task[]>(tasks);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setTaskData(tasks);
  }, [tasks]);

  const handleStatusUpdate = async (taskId: number, newStatus: "Pending" | "In_Progress" | "Completed") => {
    setIsUpdating(true);
    const prevTasks = [...taskData];
    const updatedTasks = taskData.map((task) =>
      task.task_id === taskId ? { ...task, status: newStatus } : task
    );
    setTaskData(updatedTasks);

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
      setTaskData(prevTasks);
    }
    setIsUpdating(false);
  };

  const statusCategories = [
    { id: "Pending", name: "Pendiente" },
    { id: "In_Progress", name: "En Progreso" },
    { id: "Completed", name: "Completada" }
  ];

  return (
    <div className="flex gap-4 overflow-x-auto  grid-cols-3 p-4">
      {statusCategories.map((status) => (
        <div key={status.id} className=" bg-light-bg-primary dark:bg-dark-bg-primary p-4 rounded-lg shadow-md 
                  border border-light-border-light dark:border-dark-border-light">
          <h2 className="text-lg font-semibold mb-2">{status.name}</h2>
          <div className="space-y-2">
            {taskData
              .filter((task) => task.status === status.id)
              .map((task) => (
                <div key={task.task_id} className="bg-white p-3 rounded shadow-md">
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="mt-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusUpdate(task.task_id, e.target.value as Task["status"])}
                      disabled={isUpdating}
                      className="w-full border rounded p-1"
                    >
                      {statusCategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
