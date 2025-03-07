// app/clients/page.tsx
'use client';

import { useCallback, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import ModalClient from "@/components/layouts/modals/modalClient";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import SideModal from "@/components/layouts/SideModal";

interface Client {
 client_id: number;
 company_name: string;
 contact_name: string;
 position: string;
 phone_number: string;
 email: string;
 website: string;
 address: string;
 city: string;
 state: string;
 postal_code: string;
 country: string;
 lead_source: string;
 industry: string;
 status: string;
 priority: string;
 assigned_to: string;
 tags: string;
 comments: string;
}

const initialForm = {
 client_id: 0,
 company_name: "",
 contact_name: "",
 position: "",
 phone_number: "",
 email: "",
 website: "",
 address: "",
 city: "",
 state: "",
 postal_code: "",
 country: "",
 lead_source: "",
 industry: "",
 status: "Prospect",
 priority: "Medium",
 assigned_to: "",
 tags: "",
 comments: ""
};

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ClientPage() {
 const [openModal, setOpenModal] = useState<boolean>(false);
 const onClose = () => setOpenModal(false)
 const [form, setForm] = useState(initialForm);
 const [patch, setPatch] = useState<boolean>(false);
 const [loading, setLoading] = useState<boolean>(false);
 const [isLoading, setIsLoading] = useState<boolean>(true);
 const [error, setError] = useState<string>('');
 const [data, setData] = useState<Client[]>([]);
 const [file, setFile] = useState<File | null>(null);
 const [meta, setMeta] = useState<PaginationMeta>({
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false
 });
 
 // Filtros
 const [search, setSearch] = useState('');
 const [status, setStatus] = useState('');
 const [priority, setPriority] = useState('');
 const [sortBy, setSortBy] = useState('company_name');
 const [sortOrder, setSortOrder] = useState('asc');

 const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = event.target.files?.[0] || null;
  setFile(selectedFile);
 };
// Función para obtener clientes con paginación y filtros
const fetchClients = useCallback(async () => {
  setIsLoading(true);
  try {
    // Construir URL con parámetros
    const params = new URLSearchParams({
      page: meta.page.toString(),
      pageSize: meta.pageSize.toString(),
      sortBy,
      sortOrder
    });

    // Agregar filtros opcionales
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);

    const response = await fetch(`/api/clients?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Error al cargar clientes');
    }

    const result = await response.json();
    setData(result.data);
    setMeta(result.meta);
  } catch (error) {
    console.error('Error:', error);
    setError('Error al cargar los clientes. Por favor intente nuevamente.');
  } finally {
    setIsLoading(false);
  }
}, [meta.page, meta.pageSize, search, status, priority, sortBy, sortOrder]); // Dependencias necesarias

// Cargar datos
useEffect(() => {
  fetchClients();
}, [fetchClients]); // Ahora es una dependencia estable


 // Manejadores de paginación
 const handleFirstPage = () => setMeta(prev => ({ ...prev, page: 1 }));
 const handlePrevPage = () => setMeta(prev => ({ ...prev, page: prev.page - 1 }));
 const handleNextPage = () => setMeta(prev => ({ ...prev, page: prev.page + 1 }));
 const handleLastPage = () => setMeta(prev => ({ ...prev, page: prev.totalPages }));

 

 const clearFilters = () => {
  setSearch('');
  setStatus('');
  setPriority('');
  setSortBy('company_name');
  setSortOrder('asc');
  setMeta(prev => ({ ...prev, page: 1 }));
 };

 // Manejador de cambio de tamaño de página
 const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const value = event.target.value;
  setMeta(prev => ({ ...prev, page: 1, pageSize: parseInt(value) }));
 };

 // Obtener color según prioridad
 const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'text-red-600 font-medium';
    case 'Medium':
      return 'text-amber-600 font-medium';
    case 'Low':
      return 'text-green-600 font-medium';
    default:
      return '';
  }
 };

 const handleDelete = async (id: number) => {
  try {
    const response = await fetch(`/api/clients/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('Cliente eliminado exitosamente!');
      fetchClients();
    }
  } catch (err) {
    console.error('Error al eliminar:', err);
  }
 };

 const handleEdit = (client: Client) => {
  setOpenModal(true);
  setForm(client);
  setPatch(true);
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch(patch ? `/api/clients/${form.client_id}` : '/api/clients', {
      method: patch ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert(patch ? 'Cliente Actualizado exitosamente!' : 'Cliente creado exitosamente!');
      setOpenModal(false);
      fetchClients();
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
 };

 const handleDownloadSubmit = async (e: React.FormEvent) => {
  if (!file) {
    alert("Por favor, selecciona un archivo CSV o XLSX.");
    return;
  }
  e.preventDefault();
  setLoading(true);
   
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`/api/clients/import-clients`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Clientes subidos exitosamente!');
      setOpenModal(false);
      fetchClients();
    } else {
      const result = await response.json();
      alert(`Error: ${result.error || 'No se pudieron subir los clientes'}`);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error al subir el archivo. Intente nuevamente.');
  } finally {
    setLoading(false);
  }
 };

 const handleSearchClient = (value: string) => {
  setSearch(value);
  setMeta(prev => ({ ...prev, page: 1 }));
 };

 if (isLoading && !data.length) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-50"></div>
    </div>
  );
 }

 if (error && !data.length) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-red-500 mb-4">{error}</p>
      <button
        onClick={() => fetchClients()}
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
    nameButton="agregar cliente" 
    name="Clientes"
  >
    <SideModal patch={patch} isOpen={openModal} loading={loading} onClose={onClose} title={"Crear Cliente"} onSubmit={handleSubmit}> 
      <ModalClient form={form} openModal={openModal} setOpenModal={setOpenModal} setForm={setForm} />
    </SideModal>
    
    <div className="relative mx-5 mt-5 overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between p-4 gap-4">
        {/* Búsqueda */}
        <div className="relative">
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
            value={search}
            onChange={(e) => handleSearchClient(e.target.value)}
            id="table-search"
            className="block pt-2 ps-10 text-sm w-full md:w-80 rounded-lg
              bg-light-bg-input dark:bg-dark-bg-input 
              border border-light-border-medium dark:border-dark-border-medium
              text-light-text-primary dark:text-dark-text-primary
              placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary
              focus:ring-brand-accent focus:border-brand-accent"
            placeholder="Buscar cliente"
          />
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-2">
          <select 
            value={status} 
            onChange={(e) => {
              setStatus(e.target.value);
              setMeta(prev => ({ ...prev, page: 1 }));
            }}
            className="rounded-lg text-sm p-2
              bg-light-bg-input dark:bg-dark-bg-input 
              border border-light-border-medium dark:border-dark-border-medium
              text-light-text-primary dark:text-dark-text-primary
              focus:ring-brand-accent focus:border-brand-accent"
          >
            <option value="">Todos los estados</option>
            <option value="Prospect">Prospecto</option>
            <option value="Lead">Lead</option>
            <option value="Customer">Cliente</option>
            <option value="Inactive">Inactivo</option>
          </select>
          
          <select 
            value={priority} 
            onChange={(e) => {
              setPriority(e.target.value);
              setMeta(prev => ({ ...prev, page: 1 }));
            }}
            className="rounded-lg text-sm p-2
              bg-light-bg-input dark:bg-dark-bg-input 
              border border-light-border-medium dark:border-dark-border-medium
              text-light-text-primary dark:text-dark-text-primary
              focus:ring-brand-accent focus:border-brand-accent"
          >
            <option value="">Todas las prioridades</option>
            <option value="Low">Baja</option>
            <option value="Medium">Media</option>
            <option value="High">Alta</option>
          </select>
          
          {(search || status || priority) && (
            <button
              onClick={clearFilters}
              className="text-sm p-2 rounded-lg
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                text-light-text-secondary dark:text-dark-text-secondary
                hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        
        {/* Subida de archivos */}
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <input
            type="file" 
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            className="text-sm p-1 rounded-lg
              bg-light-bg-primary dark:bg-dark-bg-primary
              border border-light-border-light dark:border-dark-border-light
              text-light-text-primary dark:text-dark-text-primary"
          />
          <button 
            onClick={handleDownloadSubmit} 
            disabled={loading || !file}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Subiendo..." : "Importar"}
          </button>
        </div>
      </div>
      
      {/* Tabla */}
      <div className="rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-sm text-left rtl:text-right
          bg-light-bg-primary dark:bg-dark-bg-primary">
          <thead className="text-xs uppercase 
            bg-light-bg-secondary dark:bg-dark-bg-secondary
            text-light-text-primary dark:text-dark-text-primary">
            <tr>
              <th scope="col" className="p-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded
                    bg-light-bg-input dark:bg-dark-bg-input
                    border-light-border-medium dark:border-dark-border-medium
                    text-brand-accent focus:ring-brand-accent"
                />
              </th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Compañía</th>
              <th scope="col" className="px-6 py-3">Teléfono</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Prioridad
                  <button 
                    onClick={() => {
                      setSortBy('priority');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="ml-1"
                  >
                    {sortBy === 'priority' && sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Estado
                  <button 
                    onClick={() => {
                      setSortBy('status');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="ml-1"
                  >
                    {sortBy === 'status' && sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-50"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-light-text-secondary dark:text-dark-text-secondary">
                  No se encontraron clientes
                </td>
              </tr>
            ) : (
              data.map((client) => (
                <tr key={client.client_id} 
                  className="border-b transition-colors
                    border-light-border-light dark:border-dark-border-light
                    bg-light-bg-primary dark:bg-dark-bg-primary
                    hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary">
                  <td className="w-4 p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded
                        bg-light-bg-input dark:bg-dark-bg-input
                        border-light-border-medium dark:border-dark-border-medium
                        text-brand-accent focus:ring-brand-accent"
                    />
                  </td>
                  <th className="px-6 py-4 font-medium whitespace-nowrap
                    text-light-text-primary dark:text-dark-text-primary">
                    {client.contact_name}
                  </th>
                  <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                    {client.company_name}
                  </td>
                  <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                    {client.phone_number}
                  </td>
                  <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                    {client.email}
                  </td>
                  <td className={`px-6 py-4 ${getPriorityColor(client.priority)}`}>
                    {client.priority}
                  </td>
                  <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                    {client.status}
                  </td>
                  <td className="px-6 flex items-center py-4">
                    <button
                      onClick={() => handleDelete(client.client_id)}
                      className="font-medium p-2 mr-4 rounded-md
                        bg-error-light/10 dark:bg-error-dark/10
                        text-error-light dark:text-error-dark
                        hover:bg-error-light/20 dark:hover:bg-error-dark/20"
                    >
                      <MdDelete/>
                    </button>
                    <button
                      onClick={() => handleEdit(client)}
                      className="font-medium p-2 rounded-md
                        text-light-text-tertiary dark:text-dark-text-tertiary
                        hover:text-light-text-primary dark:hover:text-dark-text-primary
                        hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                    >
                      <FaEllipsisVertical/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 mt-4 gap-4">
        <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Mostrando {data.length} de {meta.totalCount} resultados
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={meta.pageSize.toString()}
            onChange={handlePageSizeChange}
            className="rounded-lg text-sm p-2
              bg-light-bg-input dark:bg-dark-bg-input 
              border border-light-border-medium dark:border-dark-border-medium
              text-light-text-primary dark:text-dark-text-primary
              focus:ring-brand-accent focus:border-brand-accent"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={handleFirstPage}
              disabled={!meta.hasPrevPage}
              className="p-2 rounded-md
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                text-light-text-secondary dark:text-dark-text-secondary
                hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
                disabled:opacity-50"
            >
              
              <IoChevronBack className="h-4 w-4 -ml-3" />
            </button>
            <button
              onClick={handlePrevPage}
              disabled={!meta.hasPrevPage}
              className="p-2 rounded-md
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                text-light-text-secondary dark:text-dark-text-secondary
                hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
                disabled:opacity-50"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm mx-2 text-light-text-primary dark:text-dark-text-primary">
              Página {meta.page} de {meta.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!meta.hasNextPage}
              className="p-2 rounded-md
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                text-light-text-secondary dark:text-dark-text-secondary
                hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
                disabled:opacity-50"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleLastPage}
              disabled={!meta.hasNextPage}
              className="p-2 rounded-md
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                text-light-text-secondary dark:text-dark-text-secondary
                hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
                disabled:opacity-50"
            >
   
              <IoChevronForward className="h-4 w-4 -ml-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </NavbarSideComponent>
 );
}