import { useEffect, useState, useCallback } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";
import { showToast } from "@/utils/toast";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: string;
  role: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token") ?? "";
  const businessId = Cookies.get("businessId") ?? "";

  useEffect(() => {
    if (businessId) fetchUsers();
  }, [businessId]);

  const fetchUsers = useCallback(async () => {
    if (loading) return;
    setLoading(true);

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

      if (!response.ok) throw new Error("Error al obtener los usuarios");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
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

      if (!response.ok) throw new Error("Error al eliminar el usuario");

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
      showToast.success("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      showToast.error("Error al eliminar el usuario");
    } finally {
      closeModal();
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

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
      console.log(response);
      if (!response.ok) throw new Error("Error al actualizar el usuario");

      const updatedUser = await response.json();
      console.log(updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      showToast.success("Usuario actualizado correctamente");
      closeModal();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      showToast.error("Error al actualizar el usuario");
    }
  };

  return (
    <div className="mt-6 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-md transition-colors duration-300">
      <div className="relative">
        {loading ? (
          <p className="text-center py-6 text-light-text-secondary dark:text-dark-text-secondary">
            Cargando usuarios...
          </p>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary-50 scrollbar-track-light-bg-secondary dark:scrollbar-track-dark-bg-secondary">
            <table className="min-w-full divide-y divide-light-border-primary dark:divide-dark-border-primary">
              <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary">
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
                      className="px-6 py-3 text-left text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
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
                    <td className="px-6 py-4 text-light-text-primary dark:text-dark-text-primary">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-light-text-primary dark:text-dark-text-primary">
                      {user.email}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-light-text-primary dark:text-dark-text-primary">
                      {user.phoneNumber}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-light-text-primary dark:text-dark-text-primary">
                      {user.status}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-light-text-primary dark:text-dark-text-primary">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        className="p-1 rounded-full bg-warning-light dark:bg-warning-dark hover:bg-warning-dark dark:hover:bg-warning-light transition-colors duration-300"
                        onClick={() => openEditModal(user)}
                      >
                        <FiEdit className="w-5 h-5 text-white dark:text-gray-100" />
                      </button>
                      <button
                        className="p-1 rounded-full bg-error-light dark:bg-error-dark hover:bg-error-dark dark:hover:bg-error-light transition-colors duration-300"
                        onClick={() => confirmDeleteUser(user)}
                      >
                        <FiTrash2 className="w-5 h-5 text-white dark:text-gray-100" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-hidden={!isModalOpen}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-light-bg-primary dark:bg-dark-bg-primary p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
              ¿Eliminar usuario?
            </h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Estás a punto de eliminar a{" "}
              <b>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </b>
              . Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-md text-light-text-primary dark:text-dark-text-primary bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-border-medium dark:hover:bg-dark-border-medium transition"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-md bg-error-light dark:bg-error-dark text-white hover:bg-error-dark dark:hover:bg-error-light transition"
                onClick={deleteUser}
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {isEditModalOpen && selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-hidden={!isEditModalOpen}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-light-bg-primary dark:bg-dark-bg-primary p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
              Editar Usuario
            </h2>
            <form onSubmit={handleEditUser}>
              <div className="mt-4">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={selectedUser.phoneNumber}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  Status
                </label>
                <select
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="Active">Activo</option>
                  <option value="Inactive">Inactivo</option>
                  <option value="Suspended">Suspendido</option>
                  <option value="PENDING_BUSINESS">Pendiente de empresa</option>
                  <option value="PENDING_VERIFICATION">
                    Pendiente de verificación
                  </option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  Role
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                  <option value="Support">Support</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md text-light-text-primary dark:text-dark-text-primary bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-border-medium dark:hover:bg-dark-border-medium transition"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-primary-light dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-primary-light transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
