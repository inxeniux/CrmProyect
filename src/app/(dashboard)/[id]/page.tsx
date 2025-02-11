// src/app/(dashboard)/prospects/page.tsx
'use client';

import { useEffect, useState } from 'react';
import TaskBoard from '@/components/layouts/TaskBoard';
import { useParams } from 'next/navigation';
import NavbarSideComponent from '@/components/layouts/NavbarSideComponent';
import ModalGeneral from '@/components/layouts/modals/modalGeneral';

interface Stage {
  name: string;
  description: string;
}

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
  stage: string;
  deal_value: number;
  deal_closing_date: string;
  notes: string;
  Client: Client;
}

interface TasksData {
  prospects: Prospect[];
  stages: Stage[];
}

export default function ProspectsPage() {
  const params = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [tasks, setTasks] = useState<TasksData>({
    prospects: [],
    stages: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProspects();
  }, []);

 
  const fetchProspects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/prospects/funnel/${params.id}`, {
        headers: {
          'Content-Type': 'application/json',
          // Si usas autenticación, añade el header necesario
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los prospectos');
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching prospects:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          onClick={() => fetchProspects()}
          className="px-4 py-2 bg-primary-50 text-white rounded hover:bg-primary-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      

      {/* TaskBoard */}
      <NavbarSideComponent
           setOpenModal={setOpenModal} 
           nameButton="Prospectos" 
           name="Prospectos"
         >
          <ModalGeneral 
        
                 id={params.id}
                 openModal={openModal} 
                 setOpenModal={setOpenModal} 
               />
              
        <TaskBoard tasks={tasks} setTasks={setTasks} />
        </NavbarSideComponent>
    </div>
  );
}