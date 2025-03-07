// src/app/(dashboard)/prospects/page.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import TaskBoard from '@/components/layouts/TaskBoard';
import { useParams } from 'next/navigation';
import NavbarSideComponent from '@/components/layouts/NavbarSideComponent';
import SideModal from '@/components/layouts/SideModal';
import OpportunityForm from '@/components/form/OpportunityForm';

interface Stage {
  name: string;
  stage_id:number;
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
  funnel_id: number; // Añadido el campo faltante
  Client: Client;
}

interface TasksData {
  prospects: Prospect[];
  stages: Stage[];
}


interface FormData {
  client_id: number,
  deal_value: number,
  stage: string,
  notes: string,
  deal_closing_date: string,
  funnel_id: number;
}



export default function ProspectsPage() {
  const {id} = useParams();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const onClose = () => setOpenModal(false);
  const [formData, setFormData] = useState<FormData>({
    client_id: 0,
    deal_value: 0,
    stage: '',
    notes: '',
    deal_closing_date: '',
    funnel_id: 0
  });
  const [tasks, setTasks] = useState<TasksData>({
    prospects: [],
    stages: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingOportunity, setLoadingOportunity] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchProspects = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
  
      console.log(token);
      setLoading(true);
  
      const response = await fetch(`/api/prospects/funnel/${id}`, {
        headers: {
          'Content-Type': 'application/json',
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
  }, [id]); // id como dependencia porque se usa en la URL
  

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

 
  

 
  
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoadingOportunity(true);
     setFormData((prevState) => ({
      ...prevState,
      funnel_id: id 
        ? parseInt(Array.isArray(id) ? id[0] : id)
        : 0, // Asigna 0 en caso de que id sea undefined
    }))
     try {
       const response = await fetch('/api/prospects/stages', {
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
      setLoadingOportunity(false);
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
            <SideModal patch={false} isOpen={openModal} loading={loadingOportunity} onClose={onClose} title={"Crear Funnel"} onSubmit={handleSubmit}> 
            {typeof id === 'string' && (
  <OpportunityForm
    id={id}
    formData={formData}
    setFormData={setFormData}
  />
)}
      </SideModal>
          {/*<ModalGeneral 
        
                 id={params.id}
                 openModal={openModal} 
                 setOpenModal={setOpenModal} 
               />*/}
              
        <TaskBoard tasks={tasks} setTasks={setTasks} />
        </NavbarSideComponent>
    </div>
  );
}