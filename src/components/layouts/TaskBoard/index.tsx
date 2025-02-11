// src/components/TaskBoard/index.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  client_id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone_number: string;
  industry: string;
}

interface Prospect {
  prospect_id: number;
  funnel_id: number;
  stage: string;
  deal_value: number;
  deal_closing_date: string;
  notes: string;
  Client: Client;
}

interface Stage {
  name: string;
  description: string;
}

interface TaskBoardProps {
  tasks: {
    prospects: Prospect[];
    stages: Stage[];
  };
  setTasks: React.Dispatch<React.SetStateAction<any>>;
}

interface TaskCardProps {
  task: Prospect;
  onDragEnd: (taskId: number, info: any) => void;
  isUpdating: boolean;
}

const TaskCard = ({ task, onDragEnd, isUpdating }: TaskCardProps) => {
    const router = useRouter();
  
    return (
      <motion.div
        className={`bg-light-bg-primary dark:bg-dark-bg-primary p-4 rounded-lg shadow-md 
                  border border-light-border-light dark:border-dark-border-light
                  ${isUpdating ? 'opacity-50' : ''}`}
        drag
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onClick={() => router.push(`/detaillead/${task.funnel_id}/${task.prospect_id}`)}
        onDragEnd={(event, info) => onDragEnd(task.prospect_id, info)}
        whileDrag={{ scale: 1.05 }}
        animate={{
          scale: isUpdating ? 0.95 : 1,
          opacity: isUpdating ? 0.7 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {task.Client.company_name}
              </h4>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {task.Client.contact_name}
              </p>
            </div>
            <span className="px-2 py-1 text-xs rounded-full bg-light-bg-input dark:bg-dark-bg-input 
                           text-light-text-secondary dark:text-dark-text-secondary">
              {task.Client.industry}
            </span>
          </div>
  
          <div className="space-y-1">
            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary flex items-center">
              <span className="mr-2">📧</span> {task.Client.email}
            </p>
            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary flex items-center">
              <span className="mr-2">📱</span> {task.Client.phone_number}
            </p>
          </div>
  
          <div className="border-t border-light-border-light dark:border-dark-border-light pt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Valor:
              </span>
              <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                ${task.deal_value}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Cierre:
              </span>
              <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {new Date(task.deal_closing_date).toLocaleDateString()}
              </span>
            </div>
          </div>
  
          {task.notes && (
            <div className="pt-2 border-t border-light-border-light dark:border-dark-border-light">
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary line-clamp-2">
                {task.notes}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

// ... imports y interfaces previas ...

export default function TaskBoard({ tasks, setTasks }: TaskBoardProps) {
    const [updatingTask, setUpdatingTask] = useState<number | null>(null);
  
    if (!tasks || !Array.isArray(tasks.stages)) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-50"></div>
        </div>
      );
    }
  
    // Ordenar los stages por stage_id
    const orderedStages = [...tasks.stages].sort((a, b) => a.stage_id - b.stage_id);
  
    if (orderedStages.length === 0) {
      return (
        <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
          No hay etapas disponibles
        </div>
      );
    }
  
    const handleDragEnd = async (taskId: number, info: any) => {
        if (updatingTask) return;
      
        const threshold = 100;
        const draggedTask = tasks.prospects.find(
          (task) => task.prospect_id === taskId
        );
      
        if (!draggedTask) return;
      
        // Encontrar el índice actual basado en stage_id
        const currentStageId = parseInt(draggedTask.stage);
        const currentIndex = orderedStages.findIndex(s => s.stage_id === currentStageId);
        let newStageId = currentStageId;
        let newStageName = '';
      
        if (info.offset.x > threshold && currentIndex < orderedStages.length - 1) {
          newStageId = orderedStages[currentIndex + 1].stage_id;
          newStageName = orderedStages[currentIndex + 1].name; // Obtener el nombre del nuevo stage
        } else if (info.offset.x < -threshold && currentIndex > 0) {
          newStageId = orderedStages[currentIndex - 1].stage_id;
          newStageName = orderedStages[currentIndex - 1].name; // Obtener el nombre del nuevo stage
        } else {
          return;
        }
      
        if (newStageId !== currentStageId) {
          await updateTaskStatus(taskId, newStageId.toString(), newStageName);
        }
      };
      
      const updateTaskStatus = async (taskId: number, newStageId: string, newStageName: string) => {
        setUpdatingTask(taskId);
        try {
          setTasks((prevTasks: any) => ({
            ...prevTasks,
            prospects: prevTasks.prospects.map((task: Prospect) =>
              task.prospect_id === taskId ? { ...task, stage: newStageId } : task
            ),
          }));
      
          const response = await fetch(`/api/prospects/${taskId}/stage`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              stage: newStageId,       // Pasar el nuevo ID del stage
              stageName: newStageName  // Pasar el nombre del stage
            }),
          });
      
          if (!response.ok) {
            throw new Error('Error al actualizar el estado');
          }
        } catch (error) {
          console.error('Error:', error);
          setTasks((prevTasks: any) => ({
            ...prevTasks,
            prospects: prevTasks.prospects.map((task: Prospect) =>
              task.prospect_id === taskId
                ? { ...task, stage: tasks.prospects.find(t => t.prospect_id === taskId)?.stage }
                : task
            ),
          }));
        } finally {
          setUpdatingTask(null);
        }
      };
      
  
    return (
        <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg-secondary">
          <div className="overflow-x-auto h-full p-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-w-fit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {orderedStages.map((stage) => (
                <motion.div
                  key={stage.stage_id}
                  className="w-80 space-y-4 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg p-4 shadow-lg 
                            border border-light-border-light dark:border-dark-border-light"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {stage.name}
                    </h3>
                    <span className="px-3 py-1 text-sm bg-light-bg-input dark:bg-dark-bg-input 
                                   text-light-text-secondary dark:text-dark-text-secondary rounded-full">
                      {tasks.prospects.filter((task) => task.stage === stage.stage_id.toString()).length}
                    </span>
                  </div>
                  <motion.div 
                    className="space-y-3"
                    layout
                  >
                    {tasks.prospects
                      .filter((task) => task.stage === stage.stage_id.toString())
                      .map((task) => (
                        <motion.div
                          key={task.prospect_id}
                          layoutId={task.prospect_id.toString()}
                        >
                          <TaskCard
                            task={task}
                            onDragEnd={handleDragEnd}
                            isUpdating={updatingTask === task.prospect_id}
                          />
                        </motion.div>
                      ))}
                    {tasks.prospects.filter((task) => task.stage === stage.stage_id.toString()).length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        className="text-center py-8 border-2 border-dashed 
                                 border-light-border-light dark:border-dark-border-light rounded-lg"
                      >
                        <p className="text-light-text-tertiary dark:text-dark-text-tertiary">
                          No hay prospectos
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      );
  }