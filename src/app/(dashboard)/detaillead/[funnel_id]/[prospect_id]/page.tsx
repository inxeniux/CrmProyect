'use client';

import { useState } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import PaymentLink from "@/components/ui/stripepayment";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Task {
  prospect_id: string;
  client: {
    contact_name: string;
    email: string;
    phone_number: string;
    address: string;
    website: string;
  };
  stage: string;
  deal_closing_date: string;
  deal_value: string;
  notes: string;
}

interface FormActivity {
  notes: string;
  activity_date: string;
}

interface Activity {
  id: string;
  notes: string;
  activity_date: string;
}
interface Payment {
  email: string;

}

export default function DetailComponent() {
  const params = useParams();
  const funnel_id = params.funnel_id;
  const prospect_id = params.prospect_id;

  const [formActivity, setFormActivity] = useState<FormActivity>({
    notes: "",
    activity_date: "",
  });

  const { data: task, error: taskError, isLoading: taskLoading } = useSWR<Task>(
    funnel_id ? `/api/prospects/funnel/${funnel_id}/${prospect_id}` : null,
    fetcher
  );

  const { data: activities, error: activitiesError, mutate: mutateActivities } = useSWR<Activity[]>(
    prospect_id ? `/api/activity/prospects/${prospect_id}` : null,
    fetcher
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formActivity.notes || !formActivity.activity_date || !prospect_id) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const activityDate = new Date(formActivity.activity_date).toISOString();

    try {
      const newActivity = {
        ...formActivity,
        activity_date: activityDate,
        prospect_id: parseInt(prospect_id, 10),
        activity_type: "1",
      };

      const response = await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newActivity),
      });

      if (!response.ok) {
        throw new Error("Error al crear la actividad");
      }

      mutateActivities();
      setFormActivity({ notes: "", activity_date: "" });
      alert("Actividad registrada exitosamente!");
    } catch (err) {
      console.error("Error al registrar la actividad:", err);
      alert("Error al registrar la actividad");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormActivity({ ...formActivity, [e.target.name]: e.target.value });
  };

  if (taskLoading) return <div className="text-light-text-primary dark:text-dark-text-primary">Cargando datos del prospecto...</div>;
  if (taskError || activitiesError) return <div className="text-error-light dark:text-error-dark">Error al cargar los datos.</div>;

  return (
   <NavbarSideComponent
   setOpenModal={false} 
     nameButton="agregar cliente" 
     name="Detalles"
   >
   <div className="flex min-h-screen bg-light-bg-secondary dark:bg-dark-bg-secondary p-10">
      {/* Sección del perfil */}
      <div className="w-3/4 bg-light-bg-primary dark:bg-dark-bg-primary shadow-lg rounded-lg p-6 mr-6">
        <ProfileSection task={task?.prospect} />
      </div>

      {/* Sección de actividades */}
      <div className="w-1/4 space-y-6">
        <ActivitySection
          handleChange={handleChange}
          formActivity={formActivity}
          handleSubmit={handleSubmit}
        />
         <PayActivityLog payment={task?.prospect.Client} />
        <ActivityLog activities={activities || []} />
      </div>
    </div>
    </NavbarSideComponent>
  );
}

function ProfileSection({ task }: { task: Task }) {
  return (
    <div className="flex">
      <div className="w-1/2 pr-4">
        <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary text-start">
          {task.Client.contact_name}
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-start">{task.Client.email}</p>
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-start">{task.Client.phone_number}</p>

        <div className="grid grid-cols-2 gap-4 my-6">
          <ProfileDetail label="Progreso" value={task.stage} />
          <ProfileDetail label="Día de cierre" value={task.deal_closing_date} />
          <ProfileDetail label="Valor del prospecto" value={task.deal_value} />
          <ProfileDetail label="Dirección" value={task.Client.address} />
          <ProfileDetail label="Sitio web" value={task.Client.website} />
        </div>

        <div className="mt-6">
          <h3 className="text-light-text-primary dark:text-dark-text-primary font-semibold text-start">Notas</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-start">{task.notes}</p>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <img
          src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          alt="Profile"
          className="w-2/3 rounded-lg object-cover"
        />
      </div>
    </div>
  );
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-sm">{label}</p>
      <p className="font-medium text-light-text-primary dark:text-dark-text-primary">{value}</p>
    </div>
  );
}

function ActivitySection({ handleChange, formActivity, handleSubmit }: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formActivity: FormActivity;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary shadow-lg rounded-lg p-6">
      <h3 className="text-lg mb-2 font-semibold text-light-text-primary dark:text-dark-text-primary">
        Registrar Actividad
      </h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="notes"
          value={formActivity.notes}
          onChange={handleChange}
          placeholder="Notas"
          className="w-full px-4 py-2 bg-light-bg-input dark:bg-dark-bg-input border border-light-border-medium dark:border-dark-border-medium rounded-md mb-4 text-light-text-primary dark:text-dark-text-primary"
        />
        <input
          type="datetime-local"
          name="activity_date"
          value={formActivity.activity_date}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-light-bg-input dark:bg-dark-bg-input border border-light-border-medium dark:border-dark-border-medium rounded-md mb-4 text-light-text-primary dark:text-dark-text-primary"
        />
        <button 
          type="submit" 
          className="w-full bg-primary-50 hover:bg-primary-600 active:bg-primary-700 text-white py-2 rounded-md"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

function PayActivityLog({ payment }: { payment: Payment }) {
  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
        Pagos links
      </h3>
     <PaymentLink customerEmail={payment.email} />
    </div>
  );
}

function ActivityLog({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
        Historial de Actividades
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-b border-light-border-light dark:border-dark-border-light py-2">
            <p className="text-light-text-primary dark:text-dark-text-primary">{activity.notes}</p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-sm">
              {activity.activity_date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}