"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  FiTrash2,
  FiEdit,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiX,
  FiMail,
  FiPhone,
  FiAlertCircle,
  FiUser,
  FiUsers,
  FiInbox,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { showToast } from "@/utils/toast";
import Cookies from "js-cookie";
import UserModals from "./UserModals";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: string;
  role: string;
}

const PAGE_SIZE = 10; // Número de usuarios por página

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Para la paginación
  const [totalUsers, setTotalUsers] = useState(0);

  const token = Cookies.get("auth_token") ?? "";
  const businessId = Cookies.get("businessId") ?? "";

  // Lista de estados y roles disponibles
  const availableStatuses = useMemo(() => {
    const statuses = new Set<string>();
    users.forEach((user) => statuses.add(user.status));
    return Array.from(statuses);
  }, [users]);

  const availableRoles = useMemo(() => {
    const roles = new Set<string>();
    users.forEach((user) => roles.add(user.role));
    return Array.from(roles);
  }, [users]);

  // Usuarios filtrados
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filtro por búsqueda en nombre o email
      const searchMatch =
        searchQuery === "" ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por estado
      const statusMatch = statusFilter === "" || user.status === statusFilter;

      // Filtro por rol
      const roleMatch = roleFilter === "" || user.role === roleFilter;

      return searchMatch && statusMatch && roleMatch;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  // Total de páginas basado en usuarios filtrados
  const totalPages = useMemo(
    () => Math.ceil(filteredUsers.length / PAGE_SIZE),
    [filteredUsers.length]
  );

  // Usuarios paginados después de filtrar
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, roleFilter]);

  useEffect(() => {
    if (businessId) fetchUsers();
  }, [businessId]);

  const fetchUsers = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/create-user-invitation/${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
      setTotalUsers(Array.isArray(data) ? data.length : 0);

      // Reset filters and pagination
      setSearchQuery("");
      setStatusFilter("");
      setRoleFilter("");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al cargar usuarios"
      );
      showToast.error("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }, [businessId, token, loading]);

  const confirmDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const deleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    try {
      const response = await fetch(
        `/api/create-user-invitation/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
      setTotalUsers((prev) => prev - 1);
      showToast.success("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      showToast.error(
        error instanceof Error ? error.message : "Error al eliminar el usuario"
      );
    } finally {
      setActionLoading(false);
      closeModal();
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser({ ...user }); // Clonar el usuario para evitar modificación directa del estado
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    // Validar que sean exactamente 10 dígitos y solo números
    return /^[0-9]{10}$/.test(phoneNumber);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Validación del teléfono: obligatorio y formato correcto
    if (!selectedUser.phoneNumber || selectedUser.phoneNumber.trim() === "") {
      showToast.error("El número de teléfono es obligatorio");
      return;
    }

    if (!validatePhoneNumber(selectedUser.phoneNumber)) {
      showToast.error(
        "El número de teléfono debe contener exactamente 10 dígitos numéricos"
      );
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(
        `/api/create-user-invitation/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: selectedUser.id,
            phoneNumber: selectedUser.phoneNumber,
            status: selectedUser.status,
            role: selectedUser.role,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      const updatedUser = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      showToast.success("Usuario actualizado correctamente");
      closeModal();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      showToast.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar el usuario"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!selectedUser) return;

    const { name, value } = e.target;
    setSelectedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="mt-6 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-md transition-colors duration-300 overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-light-border-light dark:border-dark-border-light">
        <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary flex items-center">
          <span className="mr-2">Usuarios del sistema</span>
          {loading && (
            <span className="inline-block h-4 w-4">
              <span className="animate-ping absolute h-4 w-4 rounded-full bg-primary-50 opacity-75"></span>
            </span>
          )}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFilterPanel}
            className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
              isFilterOpen || statusFilter || roleFilter
                ? "bg-primary-50 text-white"
                : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary"
            } hover:bg-primary-600 hover:text-white transition-all duration-200`}
            aria-label={isFilterOpen ? "Cerrar filtros" : "Abrir filtros"}
          >
            <FiFilter className="w-4 h-4 mr-1.5" />
            Filtros
            {(statusFilter || roleFilter) && (
              <span className="ml-1.5 flex items-center justify-center h-5 w-5 text-xs rounded-full bg-white text-primary-50 font-bold">
                {(statusFilter ? 1 : 0) + (roleFilter ? 1 : 0)}
              </span>
            )}
          </button>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center px-3 py-1.5 text-sm rounded-md bg-primary-50 text-white hover:bg-primary-600 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
            aria-label="Actualizar lista de usuarios"
          >
            <FiRefreshCw
              className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </button>
        </div>
      </div>

      {/* Panel de filtros */}
      <motion.div
        initial={false}
        animate={{
          height: isFilterOpen ? "auto" : 0,
          opacity: isFilterOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 border-b border-light-border-light dark:border-dark-border-light"
      >
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda por nombre o email */}
          <div className="relative">
            <label
              htmlFor="search-query"
              className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1"
            >
              Buscar por nombre o email
            </label>
            <div className="relative">
              <input
                type="text"
                id="search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar usuarios..."
                className="pl-9 pr-3 py-2 w-full rounded-md bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-medium dark:border-dark-border-medium text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:ring-2 focus:ring-primary-50/50 focus:border-primary-50 transition-all outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                  aria-label="Limpiar búsqueda"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro por estado */}
          <div>
            <label
              htmlFor="status-filter"
              className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1"
            >
              Filtrar por estado
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2 w-full rounded-md bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-medium dark:border-dark-border-medium text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-50/50 focus:border-primary-50 transition-all outline-none appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="">Todos los estados</option>
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por rol */}
          <div>
            <label
              htmlFor="role-filter"
              className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1"
            >
              Filtrar por rol
            </label>
            <select
              id="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-3 pr-8 py-2 w-full rounded-md bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-medium dark:border-dark-border-medium text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-50/50 focus:border-primary-50 transition-all outline-none appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="">Todos los roles</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Botón para limpiar filtros */}
          {(searchQuery || statusFilter || roleFilter) && (
            <div className="md:col-span-3 flex justify-end mt-1">
              <button
                onClick={clearFilters}
                className="flex items-center text-xs px-3 py-1.5 text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-50 transition-all"
              >
                <FiX className="w-3.5 h-3.5 mr-1" />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-primary-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-light-bg-primary dark:bg-dark-bg-primary"></div>
              </div>
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-4 animate-pulse">
              Cargando usuarios...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-10 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-light/20 dark:bg-error-dark/20 mb-4">
              <FiAlertCircle className="h-8 w-8 text-error-light dark:text-error-dark" />
            </div>
            <p className="text-error-light dark:text-error-dark mb-4 font-medium">
              {error}
            </p>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-primary-50 text-white rounded-md hover:bg-primary-600 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-50 focus:ring-opacity-50"
            >
              Reintentar
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary mb-4">
              <FiUsers className="h-8 w-8 text-light-text-secondary dark:text-dark-text-secondary" />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg font-medium">
              No hay usuarios disponibles
            </p>
            <p className="mt-2 text-light-text-tertiary dark:text-dark-text-tertiary max-w-md mx-auto">
              No se encontraron usuarios en el sistema. Intenta actualizar la
              lista o añadir un nuevo usuario.
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary mb-4">
              <FiInbox className="h-8 w-8 text-light-text-secondary dark:text-dark-text-secondary" />
            </div>
            <p className="text-light-text-primary dark:text-dark-text-primary text-lg font-medium">
              No se encontraron usuarios con estos filtros
            </p>
            <p className="mt-2 text-light-text-tertiary dark:text-dark-text-tertiary max-w-md mx-auto">
              Intenta con otros criterios de búsqueda o limpia los filtros para
              ver todos los usuarios.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-primary-50 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary-50 scrollbar-track-light-bg-secondary dark:scrollbar-track-dark-bg-secondary">
            {/* Conteo de resultados filtrados */}
            {(searchQuery || statusFilter || roleFilter) && (
              <div className="bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 px-6 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                  {filteredUsers.length}
                </span>{" "}
                de{" "}
                <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                  {users.length}
                </span>{" "}
                usuarios encontrados
              </div>
            )}

            <table className="min-w-full divide-y divide-light-border-light dark:divide-dark-border-light">
              <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary sticky top-0 z-10">
                <tr>
                  {[
                    "Nombre",
                    "Email",
                    "Teléfono",
                    "Status",
                    "Role",
                    "Acciones",
                  ].map((heading, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-light-bg-primary dark:bg-dark-bg-primary divide-y divide-light-border-light dark:divide-dark-border-light">
                {paginatedUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="hover:bg-light-bg-secondary/50 dark:hover:bg-dark-bg-secondary/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-light-text-primary dark:text-dark-text-primary font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-50/10 dark:bg-primary-50/20 flex items-center justify-center mr-2">
                          <FiUser className="w-4 h-4 text-primary-50" />
                        </div>
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-primary dark:text-dark-text-primary">
                      <span className="flex items-center">
                        <FiMail className="h-4 w-4 mr-2 text-light-text-secondary dark:text-dark-text-secondary" />
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-primary dark:text-dark-text-primary">
                      <span className="flex items-center">
                        <FiPhone className="h-4 w-4 mr-2 text-light-text-secondary dark:text-dark-text-secondary" />
                        {user.phoneNumber || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                            : user.status === "Inactive"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                            : user.status === "Suspended"
                            ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 mr-1.5 rounded-full ${
                            user.status === "Active"
                              ? "bg-green-500"
                              : user.status === "Inactive"
                              ? "bg-gray-500"
                              : user.status === "Suspended"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 flex">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 rounded-full bg-warning-light/90 dark:bg-warning-dark/90 hover:bg-warning-dark dark:hover:bg-warning-light transition-colors duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-warning-light/50 dark:focus:ring-warning-dark/50"
                        onClick={() => openEditModal(user)}
                        aria-label={`Editar usuario ${user.firstName}`}
                        title="Editar usuario"
                      >
                        <FiEdit className="w-4 h-4 text-white dark:text-gray-100" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 rounded-full bg-error-light/90 dark:bg-error-dark/90 hover:bg-error-dark dark:hover:bg-error-light transition-colors duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-error-light/50 dark:focus:ring-error-dark/50"
                        onClick={() => confirmDeleteUser(user)}
                        aria-label={`Eliminar usuario ${user.firstName}`}
                        title="Eliminar usuario"
                      >
                        <FiTrash2 className="w-4 h-4 text-white dark:text-gray-100" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-light-border-light dark:border-dark-border-light gap-3">
                <span className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Mostrando{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * PAGE_SIZE + 1}
                  </span>{" "}
                  a{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * PAGE_SIZE, totalUsers)}
                  </span>{" "}
                  de <span className="font-medium">{totalUsers}</span> usuarios
                </span>
                <div className="flex space-x-2 justify-center sm:justify-end">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-2.5 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary border border-transparent hover:border-light-border-primary dark:hover:border-dark-border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-50/50"
                    aria-label="Página anterior"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Números de página */}
                  <div className="hidden sm:flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        if (index > 0 && page - array[index - 1] > 1) {
                          return (
                            <React.Fragment key={`ellipsis-${page}`}>
                              <span className="px-2 py-1.5 text-light-text-secondary dark:text-dark-text-secondary flex items-center">
                                ...
                              </span>
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[2.5rem] px-3 py-1.5 rounded-md transition-all duration-200 ${
                                  currentPage === page
                                    ? "bg-primary-50 text-white font-medium shadow-sm"
                                    : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                                }`}
                                aria-label={`Ir a página ${page}`}
                                aria-current={
                                  currentPage === page ? "page" : undefined
                                }
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          );
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[2.5rem] px-3 py-1.5 rounded-md transition-all duration-200 ${
                              currentPage === page
                                ? "bg-primary-50 text-white font-medium shadow-sm"
                                : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                            }`}
                            aria-label={`Ir a página ${page}`}
                            aria-current={
                              currentPage === page ? "page" : undefined
                            }
                          >
                            {page}
                          </button>
                        );
                      })}
                  </div>

                  {/* Paginación móvil simplificada */}
                  <div className="flex sm:hidden items-center">
                    <span className="text-sm font-medium px-2">
                      {currentPage} / {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary border border-transparent hover:border-light-border-primary dark:hover:border-dark-border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-50/50"
                    aria-label="Página siguiente"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Usar el componente de modales */}
      <UserModals
        selectedUser={selectedUser}
        isModalOpen={isModalOpen}
        isEditModalOpen={isEditModalOpen}
        actionLoading={actionLoading}
        closeModal={closeModal}
        deleteUser={deleteUser}
        handleEditUser={handleEditUser}
        handleInputChange={handleInputChange}
        validatePhoneNumber={validatePhoneNumber}
      />
    </div>
  );
}
