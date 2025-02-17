import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type Task = {
  task_id: number;
  title: string;
  status: "Pending" | "In_Progress" | "Completed";
  due_date: string;
  priority: string;
};

type TaskBoardsProps = {
  task: Task[];
};

const statuses: Task["status"][] = ["Pending", "In_Progress", "Completed"];

export function TaskBoards({ task }: TaskBoardsProps) {
  const [tasks, setTasks] = useState<Task[]>(task);

  const groupedTasks = statuses.map((status) => ({
    id: status,
    title: status.replace("_", " "),
    tasks: tasks.filter((t) => t.status === status),
  }));

  const onDragEnd = async (result: { source: { droppableId: string; index: number }; destination: { droppableId: string; index: number } | null; draggableId: string }) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;
    if (sourceStatus === destinationStatus && source.index === destination.index) return;

    const updatedTasks = [...tasks];
    const movedTaskIndex = updatedTasks.findIndex((t) => t.task_id.toString() === draggableId);

    updatedTasks[movedTaskIndex].status = destinationStatus as Task["status"];
    setTasks(updatedTasks);
    
    await updateTaskStatus(updatedTasks[movedTaskIndex].task_id, updatedTasks[movedTaskIndex].status);
  };

  const updateTaskStatus = async (taskId: number, newStageName: Task["status"]): Promise<void> => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"

        },
        body: JSON.stringify({ status: newStageName }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-5">
        {groupedTasks.map((group) => (
          <Droppable key={group.id} droppableId={group.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-light-bg-primary dark:bg-dark-bg-primary p-4 rounded-lg shadow-md border border-light-border-light dark:border-dark-border-light"
              >
                <h2 className="text-xl text-white mb-5">{group.title}</h2>
                <div className="space-y-3">
                  {group.tasks.map((task, index) => (
                    <Draggable key={task.task_id.toString()} draggableId={task.task_id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-light-bg-primary text-white dark:bg-dark-bg-primary p-4 rounded-lg shadow-md border border-light-border-light dark:border-dark-border-light"
                        >
                          <h1>{task.title}</h1>
                          <div className="flex justify-between">
                            <span className="bg-gray-600 mt-4 rounded-full py-1 px-2 text-xs">
                              {task.due_date.split("T")[0]}
                            </span>
                            <span className="bg-red-200 text-red-700 mt-4 rounded-full py-1 px-2 text-xs">
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
