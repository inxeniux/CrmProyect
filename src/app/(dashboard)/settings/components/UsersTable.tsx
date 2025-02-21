"use client";

import { useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { showToast } from "@/utils/toast";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: "active" | "inactive";
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleEdit = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este usuario?"
    );

    if (confirmDelete) {
      const loadingToast = showToast.loading("Eliminando usuario...");

      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar usuario");

        setUsers(users.filter((user) => user.id !== userId));
        showToast.updateLoading(
          loadingToast,
          "Usuario eliminado exitosamente",
          "success"
        );
      } catch (error) {
        console.error(error);
        showToast.updateLoading(
          loadingToast,
          "Error al eliminar usuario",
          "error"
        );
      }
    }
  };

  const handleStatusToggle = async (
    userId: string,
    currentStatus: "active" | "inactive"
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const loadingToast = showToast.loading("Actualizando estado...");

    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Error al actualizar estado");

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      showToast.updateLoading(
        loadingToast,
        "Estado actualizado exitosamente",
        "success"
      );
    } catch (error) {
      console.error(error);
      showToast.updateLoading(
        loadingToast,
        "Error al actualizar estado",
        "error"
      );
    }
  };

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-sm">
      {/* Container con indicador de scroll */}
      <div className="relative">
        {/* Indicador de scroll */}
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-light-bg-primary dark:from-dark-bg-primary pointer-events-none md:hidden" />

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary-50 scrollbar-track-light-bg-secondary dark:scrollbar-track-dark-bg-secondary">
          <table className="min-w-full divide-y divide-light-border-primary dark:divide-dark-border-primary">
            <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary">
              <tr>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  Email
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-light-bg-primary dark:bg-dark-bg-primary divide-y divide-light-border-primary dark:divide-dark-border-primary">
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors duration-200"
                >
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                    <div className="text-xs sm:text-sm text-light-text-primary dark:text-dark-text-primary truncate max-w-[120px] sm:max-w-none">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                    <div className="text-xs sm:text-sm text-light-text-primary dark:text-dark-text-primary truncate max-w-[120px] sm:max-w-none">
                      {user.email}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                    <div className="text-xs sm:text-sm text-light-text-primary dark:text-dark-text-primary">
                      {user.phoneNumber}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-[10px] sm:text-xs leading-4 sm:leading-5 font-semibold rounded-full 
                      ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                    <div className="flex space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-1 text-primary-50 hover:text-primary-600 transition-colors duration-200"
                      >
                        <FiEdit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 text-error-light hover:text-error-dark transition-colors duration-200"
                      >
                        <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(user.id, user.status)}
                        className={`p-1 transition-colors duration-200 ${
                          user.status === "active"
                            ? "text-error-light hover:text-error-dark"
                            : "text-success-light hover:text-success-dark"
                        }`}
                      >
                        {user.status === "active" ? (
                          <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensaje de scroll en móviles */}
        <div className="text-center text-xs text-light-text-secondary dark:text-dark-text-secondary py-2 md:hidden">
          Desliza horizontalmente para ver más información
        </div>
      </div>
    </div>
  );
}
