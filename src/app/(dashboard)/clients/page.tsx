"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { MdDelete, MdEdit, MdViewModule, MdViewList } from "react-icons/md";
import { FaEllipsisVertical, FaFilter } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight, FaFileImport } from "react-icons/fa";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import { HiOutlineSelector } from "react-icons/hi";
import ModalClient from "@/components/layouts/modals/modalClient";
import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import SideModal from "@/components/layouts/SideModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

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
  comments: "",
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
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);
  const onClose = () => setOpenModal(false);
  const [form, setForm] = useState(initialForm);
  const [patch, setPatch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<Client[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filtros
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [industry, setIndustry] = useState("");
  const [sortBy, setSortBy] = useState("company_name");
  const [sortOrder, setSortOrder] = useState("asc");

  // UI states
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [hoveredClient, setHoveredClient] = useState<number | null>(null);

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
        sortOrder,
      });

      // Agregar filtros opcionales
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (status) params.append("status", status);
      if (priority) params.append("priority", priority);
      if (industry) params.append("industry", industry);

      const response = await fetch(`/api/clients?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Error al cargar clientes");
      }

      const result = await response.json();
      setData(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar los clientes. Por favor intente nuevamente.");
      toast.error("Error al cargar los clientes");
    } finally {
      setIsLoading(false);
    }
  }, [
    meta.page,
    meta.pageSize,
    debouncedSearch,
    status,
    priority,
    industry,
    sortBy,
    sortOrder,
  ]);

  // Efecto para manejar el debounce en la búsqueda
  useEffect(() => {
    // Limpiar el timeout anterior si existe
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Crear un nuevo timeout
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
      setMeta((prev) => ({ ...prev, page: 1 }));
    }, 500); // Esperar 500ms después de que el usuario deje de escribir

    // Cleanup al desmontar
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search]);

  // Cargar datos
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Manejadores de paginación
  const handleFirstPage = () => setMeta((prev) => ({ ...prev, page: 1 }));
  const handlePrevPage = () =>
    setMeta((prev) => ({ ...prev, page: prev.page - 1 }));
  const handleNextPage = () =>
    setMeta((prev) => ({ ...prev, page: prev.page + 1 }));
  const handleLastPage = () =>
    setMeta((prev) => ({ ...prev, page: prev.totalPages }));

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setPriority("");
    setIndustry("");
    setSortBy("company_name");
    setSortOrder("asc");
    setMeta((prev) => ({ ...prev, page: 1 }));
    setOpenFilterModal(false);
    toast.success("Filtros limpiados");
  };

  // Manejador de cambio de tamaño de página
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setMeta((prev) => ({ ...prev, page: 1, pageSize: parseInt(value) }));
  };

  // Obtener color según prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Obtener color según estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Customer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Lead":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Prospect":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteConfirmation(null); // Cerrar modal de confirmación
    setLoading(true);

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Cliente eliminado exitosamente");
        fetchClients();
        setSelectedClients(
          selectedClients.filter((clientId) => clientId !== id)
        );
      } else {
        toast.error("Error al eliminar el cliente");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      toast.error("Error al eliminar el cliente");
    } finally {
      setLoading(false);
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
      const response = await fetch(
        patch ? `/api/clients/${form.client_id}` : "/api/clients",
        {
          method: patch ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (response.ok) {
        toast.success(
          patch
            ? "Cliente actualizado exitosamente"
            : "Cliente creado exitosamente"
        );
        setOpenModal(false);
        fetchClients();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al procesar la solicitud");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    if (!file) {
      toast.error("Por favor, selecciona un archivo CSV o XLSX");
      return;
    }
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/clients/import-clients`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Clientes importados exitosamente");
        setFile(null);
        fetchClients();
      } else {
        const result = await response.json();
        toast.error(
          `Error: ${result.error || "No se pudieron importar los clientes"}`
        );
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error al importar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClient = (value: string) => {
    setSearch(value);
  };

  const toggleSelectAllClients = () => {
    if (selectedClients.length === data.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(data.map((client) => client.client_id));
    }
  };

  const toggleSelectClient = (clientId: number) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter((id) => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  if (isLoading && !data.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (error && !data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchClients()}
          className="px-4 py-2 bg-brand-accent text-white rounded hover:bg-brand-accent/80 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <NavbarSideComponent
      setOpenModal={setOpenModal}
      nameButton="Agregar Cliente"
      name="Clientes"
    >
      {/* Modal de creación/edición de cliente */}
      <SideModal
        patch={patch}
        isOpen={openModal}
        loading={loading}
        onClose={onClose}
        title={patch ? "Editar Cliente" : "Crear Cliente"}
        onSubmit={handleSubmit}
      >
        <ModalClient
          form={form}
          openModal={openModal}
          setOpenModal={setOpenModal}
          setForm={setForm}
        />
      </SideModal>

      {/* Modal de confirmación de eliminación */}
      <AnimatePresence>
        {deleteConfirmation !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-dark-bg-primary rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-light-text-primary dark:text-dark-text-primary">
                Confirmar eliminación
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                ¿Estás seguro de que deseas eliminar este cliente? Esta acción
                no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 border border-light-border-medium dark:border-dark-border-medium rounded-md
                  text-light-text-secondary dark:text-dark-text-secondary
                  hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmation)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de filtros avanzados */}
      <AnimatePresence>
        {openFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white dark:bg-dark-bg-primary rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  Filtros avanzados
                </h3>
                <button
                  onClick={() => setOpenFilterModal(false)}
                  className="p-1 rounded-full hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                >
                  <IoClose className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                    Estado
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg text-sm p-2
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                    Prioridad
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg text-sm p-2
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                    Industria
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full rounded-lg text-sm p-2
                    bg-light-bg-input dark:bg-dark-bg-input 
                    border border-light-border-medium dark:border-dark-border-medium
                    text-light-text-primary dark:text-dark-text-primary
                    focus:ring-brand-accent focus:border-brand-accent"
                  >
                    <option value="">Todas las industrias</option>
                    <option value="Technology">Tecnología</option>
                    <option value="Finance">Finanzas</option>
                    <option value="Healthcare">Salud</option>
                    <option value="Education">Educación</option>
                    <option value="Manufacturing">Manufactura</option>
                    <option value="Retail">Comercio</option>
                    <option value="Other">Otra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                    Ordenar por
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 rounded-lg text-sm p-2
                      bg-light-bg-input dark:bg-dark-bg-input 
                      border border-light-border-medium dark:border-dark-border-medium
                      text-light-text-primary dark:text-dark-text-primary
                      focus:ring-brand-accent focus:border-brand-accent"
                    >
                      <option value="company_name">Nombre de compañía</option>
                      <option value="contact_name">Nombre de contacto</option>
                      <option value="priority">Prioridad</option>
                      <option value="status">Estado</option>
                      <option value="email">Email</option>
                    </select>

                    <button
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="p-2 rounded-lg border
                      bg-light-bg-secondary dark:bg-dark-bg-secondary
                      border-light-border-medium dark:border-dark-border-medium
                      text-light-text-secondary dark:text-dark-text-secondary
                      hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                    >
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg
                  bg-light-bg-secondary dark:bg-dark-bg-secondary
                  text-light-text-secondary dark:text-dark-text-secondary
                  hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                >
                  Limpiar todos
                </button>

                <button
                  onClick={() => setOpenFilterModal(false)}
                  className="px-4 py-2 rounded-lg
                  bg-brand-accent text-white
                  hover:bg-brand-accent/80"
                >
                  Aplicar filtros
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Encabezado con acciones */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          {/* Búsqueda */}
          <div className="relative w-full md:w-96">
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
              className="block pt-2 ps-10 text-sm w-full rounded-lg
              bg-light-bg-input dark:bg-dark-bg-input 
              border border-light-border-medium dark:border-dark-border-medium
              text-light-text-primary dark:text-dark-text-primary
              placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary
              focus:ring-brand-accent focus:border-brand-accent"
              placeholder="Buscar cliente por nombre, empresa, email..."
            />
            {isLoading && debouncedSearch && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-accent"></div>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filtro avanzado */}
            <button
              onClick={() => setOpenFilterModal(true)}
              className="flex items-center px-3 py-2 rounded-lg
              bg-light-bg-secondary dark:bg-dark-bg-secondary
              text-light-text-secondary dark:text-dark-text-secondary
              hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
              border border-light-border-light dark:border-dark-border-light"
            >
              <FaFilter className="w-4 h-4 mr-2" />
              Filtrar
              {(status ||
                priority ||
                industry ||
                sortBy !== "company_name" ||
                sortOrder !== "asc") && (
                <span className="ml-2 w-2 h-2 bg-brand-accent rounded-full"></span>
              )}
            </button>

            {/* Selector de vista */}
            <div className="flex rounded-lg overflow-hidden border border-light-border-light dark:border-dark-border-light">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 ${
                  viewMode === "table"
                    ? "bg-brand-accent text-white"
                    : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary"
                }`}
              >
                <MdViewList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 ${
                  viewMode === "cards"
                    ? "bg-brand-accent text-white"
                    : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary"
                }`}
              >
                <MdViewModule className="w-5 h-5" />
              </button>
            </div>

            {/* Botón de importar */}
            <div className="relative inline-block">
              <label
                className="flex items-center px-3 py-2 rounded-lg cursor-pointer
              bg-light-bg-secondary dark:bg-dark-bg-secondary
              text-light-text-secondary dark:text-dark-text-secondary
              hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
              border border-light-border-light dark:border-dark-border-light"
              >
                <FaFileImport className="w-4 h-4 mr-2" />
                {file ? file.name.substring(0, 10) + "..." : "Importar"}
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                  className="absolute opacity-0 w-0 h-0"
                />
              </label>
              {file && (
                <button
                  onClick={handleImportSubmit}
                  disabled={loading || !file}
                  className="ml-2 px-3 py-2 rounded-lg
                  bg-brand-accent text-white
                  hover:bg-brand-accent/80
                  disabled:opacity-50"
                >
                  {loading ? "Subiendo..." : "Subir archivo"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vista de tabla */}
        {viewMode === "table" && (
          <div className="relative mx-4 overflow-x-auto rounded-lg shadow-sm">
            <table
              className="w-full text-sm text-left rtl:text-right
            bg-light-bg-primary dark:bg-dark-bg-primary"
            >
              <thead
                className="text-xs uppercase 
              bg-light-bg-secondary dark:bg-dark-bg-secondary
              text-light-text-primary dark:text-dark-text-primary"
              >
                <tr>
                  <th scope="col" className="p-4">
                    <input
                      type="checkbox"
                      checked={
                        data.length > 0 &&
                        selectedClients.length === data.length
                      }
                      onChange={toggleSelectAllClients}
                      className="w-4 h-4 rounded
                      bg-light-bg-input dark:bg-dark-bg-input
                      border-light-border-medium dark:border-dark-border-medium
                      text-brand-accent focus:ring-brand-accent"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        setSortBy("contact_name");
                        setSortOrder(
                          sortBy === "contact_name" && sortOrder === "asc"
                            ? "desc"
                            : "asc"
                        );
                      }}
                    >
                      Nombre
                      {sortBy === "contact_name" && (
                        <HiOutlineSelector className="ml-1 h-4 w-4 text-light-text-tertiary" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        setSortBy("company_name");
                        setSortOrder(
                          sortBy === "company_name" && sortOrder === "asc"
                            ? "desc"
                            : "asc"
                        );
                      }}
                    >
                      Compañía
                      {sortBy === "company_name" && (
                        <HiOutlineSelector className="ml-1 h-4 w-4 text-light-text-tertiary" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Teléfono
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        setSortBy("email");
                        setSortOrder(
                          sortBy === "email" && sortOrder === "asc"
                            ? "desc"
                            : "asc"
                        );
                      }}
                    >
                      Email
                      {sortBy === "email" && (
                        <HiOutlineSelector className="ml-1 h-4 w-4 text-light-text-tertiary" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        setSortBy("priority");
                        setSortOrder(
                          sortBy === "priority" && sortOrder === "asc"
                            ? "desc"
                            : "asc"
                        );
                      }}
                    >
                      Prioridad
                      {sortBy === "priority" && (
                        <HiOutlineSelector className="ml-1 h-4 w-4 text-light-text-tertiary" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        setSortBy("status");
                        setSortOrder(
                          sortBy === "status" && sortOrder === "asc"
                            ? "desc"
                            : "asc"
                        );
                      }}
                    >
                      Estado
                      {sortBy === "status" && (
                        <HiOutlineSelector className="ml-1 h-4 w-4 text-light-text-tertiary" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-accent"></div>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-light-text-secondary dark:text-dark-text-secondary"
                    >
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  data.map((client) => (
                    <motion.tr
                      key={client.client_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`border-b transition-colors
                      border-light-border-light dark:border-dark-border-light
                      hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
                      ${
                        selectedClients.includes(client.client_id)
                          ? "bg-brand-accent/10"
                          : "bg-light-bg-primary dark:bg-dark-bg-primary"
                      }`}
                      onMouseEnter={() => setHoveredClient(client.client_id)}
                      onMouseLeave={() => setHoveredClient(null)}
                    >
                      <td className="w-4 p-4">
                        <input
                          type="checkbox"
                          checked={selectedClients.includes(client.client_id)}
                          onChange={() => toggleSelectClient(client.client_id)}
                          className="w-4 h-4 rounded
                          bg-light-bg-input dark:bg-dark-bg-input
                          border-light-border-medium dark:border-dark-border-medium
                          text-brand-accent focus:ring-brand-accent"
                        />
                      </td>
                      <th
                        className="px-6 py-4 font-medium whitespace-nowrap
                      text-light-text-primary dark:text-dark-text-primary"
                      >
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
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            client.priority
                          )}`}
                        >
                          {client.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            client.status
                          )}`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setDeleteConfirmation(client.client_id)
                          }
                          className="p-2 rounded-md transition-colors
                          bg-error-light/10 dark:bg-error-dark/10
                          text-error-light dark:text-error-dark
                          hover:bg-error-light/20 dark:hover:bg-error-dark/20"
                          aria-label="Eliminar cliente"
                        >
                          <MdDelete />
                        </button>
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-2 rounded-md transition-colors
                          bg-light-bg-secondary dark:bg-dark-bg-secondary
                          text-light-text-tertiary dark:text-dark-text-tertiary
                          hover:text-light-text-primary dark:hover:text-dark-text-primary"
                          aria-label="Editar cliente"
                        >
                          <MdEdit />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Vista de tarjetas */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-4">
            {isLoading && data.length === 0 ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
              </div>
            ) : data.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-center">
                  No se encontraron clientes que coincidan con los filtros
                </p>
                {(search || status || priority || industry) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 rounded-lg
                    bg-brand-accent text-white
                    hover:bg-brand-accent/80"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              data.map((client) => (
                <motion.div
                  key={client.client_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-lg overflow-hidden shadow-sm
                  border border-light-border-light dark:border-dark-border-light
                  ${
                    selectedClients.includes(client.client_id)
                      ? "ring-2 ring-brand-accent"
                      : ""
                  }
                  bg-light-bg-primary dark:bg-dark-bg-primary`}
                  onMouseEnter={() => setHoveredClient(client.client_id)}
                  onMouseLeave={() => setHoveredClient(null)}
                >
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.client_id)}
                      onChange={() => toggleSelectClient(client.client_id)}
                      className="w-4 h-4 rounded
                      bg-light-bg-input dark:bg-dark-bg-input
                      border-light-border-medium dark:border-dark-border-medium
                      text-brand-accent focus:ring-brand-accent"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {client.contact_name}
                        </h3>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {client.company_name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            client.priority
                          )}`}
                        >
                          {client.priority}
                        </span>
                        <span
                          className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            client.status
                          )}`}
                        >
                          {client.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <span className="font-medium">Email:</span>{" "}
                        {client.email}
                      </p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <span className="font-medium">Teléfono:</span>{" "}
                        {client.phone_number}
                      </p>
                      {client.industry && (
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          <span className="font-medium">Industria:</span>{" "}
                          {client.industry}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setDeleteConfirmation(client.client_id)}
                        className="p-2 rounded-md transition-colors
                        bg-error-light/10 dark:bg-error-dark/10
                        text-error-light dark:text-error-dark
                        hover:bg-error-light/20 dark:hover:bg-error-dark/20"
                        aria-label="Eliminar cliente"
                      >
                        <MdDelete />
                      </button>
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-2 rounded-md transition-colors
                        bg-light-bg-secondary dark:bg-dark-bg-secondary
                        text-light-text-tertiary dark:text-dark-text-tertiary
                        hover:text-light-text-primary dark:hover:text-dark-text-primary"
                        aria-label="Editar cliente"
                      >
                        <MdEdit />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Paginación */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-6 gap-4">
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
              <option value="5">5 por página</option>
              <option value="10">10 por página</option>
              <option value="20">20 por página</option>
              <option value="50">50 por página</option>
            </select>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleFirstPage}
                disabled={!meta.hasPrevPage}
                className="p-2 rounded-md
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                text-light-text-secondary dark:text-dark-text-secondary
                hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
                disabled:opacity-50 transition"
                aria-label="Primera página"
              >
                <IoChevronBack className="h-4 w-4" />
              </button>
              <button
                onClick={handlePrevPage}
                disabled={!meta.hasPrevPage}
                className="p-2 rounded-md
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                text-light-text-secondary dark:text-dark-text-secondary
                hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
                disabled:opacity-50 transition"
                aria-label="Página anterior"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
              <span
                className="text-sm px-4 py-2 rounded-md
              bg-light-bg-secondary dark:bg-dark-bg-secondary
              text-light-text-primary dark:text-dark-text-primary"
              >
                {meta.page} de {meta.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!meta.hasNextPage}
                className="p-2 rounded-md
                bg-light-bg-secondary dark:bg-dark-bg-secondary
                text-light-text-secondary dark:text-dark-text-secondary
                hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
                disabled:opacity-50 transition"
                aria-label="Página siguiente"
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
                disabled:opacity-50 transition"
                aria-label="Última página"
              >
                <IoChevronForward className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </NavbarSideComponent>
  );
}
