import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiEdit } from "react-icons/fi";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: string;
  role: string;
}

interface UserModalsProps {
  selectedUser: User | null;
  isModalOpen: boolean;
  isEditModalOpen: boolean;
  actionLoading: boolean;
  closeModal: () => void;
  deleteUser: () => void;
  handleEditUser: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  validatePhoneNumber: (phoneNumber: string) => boolean;
}

export default function UserModals({
  selectedUser,
  isModalOpen,
  isEditModalOpen,
  actionLoading,
  closeModal,
  deleteUser,
  handleEditUser,
  handleInputChange,
  validatePhoneNumber,
}: UserModalsProps) {
  return (
    <>
      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={actionLoading ? undefined : closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-light-bg-primary dark:bg-dark-bg-primary p-6 rounded-xl shadow-xl w-full max-w-md mx-4 border border-light-border-light dark:border-dark-border-light"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4 text-error-light dark:text-error-dark">
                <div className="bg-error-light bg-opacity-10 dark:bg-error-dark dark:bg-opacity-10 p-3 rounded-full mr-3">
                  <FiTrash2 className="w-6 h-6" />
                </div>
                <h2
                  id="delete-modal-title"
                  className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary"
                >
                  ¿Eliminar usuario?
                </h2>
              </div>

              <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-4 rounded-lg mb-5">
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  Estás a punto de eliminar al usuario:
                </p>
                <div className="flex items-center">
                  <div className="bg-primary-50 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                    {selectedUser?.firstName.charAt(0)}
                    {selectedUser?.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                      {selectedUser?.firstName} {selectedUser?.lastName}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {selectedUser?.email}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-6 bg-error-light bg-opacity-5 dark:bg-error-dark dark:bg-opacity-5 p-3 rounded-lg border-l-4 border-error-light dark:border-error-dark">
                Esta acción eliminará permanentemente al usuario del sistema y
                no podrá ser recuperado.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-light-text-primary dark:text-dark-text-primary bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-border-medium dark:hover:bg-dark-border-medium transition-all duration-200 flex items-center font-medium"
                  onClick={closeModal}
                  disabled={actionLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-error-light dark:bg-error-dark text-white hover:bg-opacity-90 transition-all duration-200 flex items-center font-medium"
                  onClick={deleteUser}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE EDICIÓN */}
      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={actionLoading ? undefined : closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-light-bg-primary dark:bg-dark-bg-primary p-0 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden flex flex-col border border-light-border-light dark:border-dark-border-light"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-light-border-light dark:border-dark-border-light">
                <div className="flex items-center">
                  <div className="bg-primary-50 bg-opacity-10 dark:bg-opacity-20 p-3 rounded-full mr-3">
                    <FiEdit className="w-6 h-6 text-primary-50 dark:text-primary-600" />
                  </div>
                  <h2
                    id="edit-modal-title"
                    className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary"
                  >
                    Editar Usuario
                  </h2>
                </div>

                <div className="mt-4 flex items-center">
                  <div className="bg-primary-50 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0 text-lg font-medium">
                    {selectedUser?.firstName.charAt(0)}
                    {selectedUser?.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-lg text-light-text-primary dark:text-dark-text-primary">
                      {selectedUser?.firstName} {selectedUser?.lastName}
                    </p>
                    <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                      {selectedUser?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleEditUser} className="space-y-5">
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1"
                    >
                      Teléfono <span className="text-error-light">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-light-text-tertiary dark:text-dark-text-tertiary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </span>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        inputMode="numeric"
                        required
                        value={selectedUser.phoneNumber}
                        onChange={(e) => {
                          // Solo permitir dígitos en el input
                          const value = e.target.value.replace(/\D/g, "");
                          handleInputChange({
                            ...e,
                            target: {
                              ...e.target,
                              name: "phoneNumber",
                              value,
                            },
                          });
                        }}
                        className={`pl-10 mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-light-text-primary dark:text-dark-text-primary bg-light-bg-primary dark:bg-dark-bg-primary
                        ${
                          !selectedUser.phoneNumber ||
                          validatePhoneNumber(selectedUser.phoneNumber)
                            ? "border-light-border-primary dark:border-dark-border-primary focus:ring-primary-50 focus:border-primary-50"
                            : "border-error-light dark:border-error-dark focus:ring-error-light focus:border-error-light"
                        }`}
                        placeholder="Ej: 5512345678"
                      />
                      {selectedUser.phoneNumber &&
                        !validatePhoneNumber(selectedUser.phoneNumber) && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-error-light"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      Debe contener exactamente 10 dígitos numéricos, sin
                      espacios ni caracteres especiales.
                    </p>
                    {selectedUser.phoneNumber &&
                      !validatePhoneNumber(selectedUser.phoneNumber) && (
                        <p className="mt-1 text-xs text-error-light dark:text-error-dark">
                          Formato incorrecto. Ingresa exactamente 10 dígitos.
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1"
                    >
                      Estado del usuario
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-light-text-tertiary dark:text-dark-text-tertiary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                      <select
                        id="status"
                        name="status"
                        value={selectedUser.status}
                        onChange={handleInputChange}
                        className="pl-10 mt-1 block w-full px-3 py-3 border border-light-border-primary dark:border-dark-border-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 text-light-text-primary dark:text-dark-text-primary bg-light-bg-primary dark:bg-dark-bg-primary appearance-none"
                      >
                        <option value="Active">Activo</option>
                        <option value="Inactive">Inactivo</option>
                        <option value="Suspended">Suspendido</option>
                        <option value="PENDING_BUSINESS">
                          Pendiente de empresa
                        </option>
                        <option value="PENDING_VERIFICATION">
                          Pendiente de verificación
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-light-text-tertiary dark:text-dark-text-tertiary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1"
                    >
                      Rol del usuario
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-light-text-tertiary dark:text-dark-text-tertiary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </span>
                      <select
                        id="role"
                        name="role"
                        value={selectedUser.role}
                        onChange={handleInputChange}
                        className="pl-10 mt-1 block w-full px-3 py-3 border border-light-border-primary dark:border-dark-border-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 text-light-text-primary dark:text-dark-text-primary bg-light-bg-primary dark:bg-dark-bg-primary appearance-none"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                        <option value="Support">Support</option>
                        <option value="Customer">Customer</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-light-text-tertiary dark:text-dark-text-tertiary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      El rol determina los permisos y capacidades del usuario en
                      el sistema.
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-4 border-t border-light-border-light dark:border-dark-border-light bg-light-bg-secondary dark:bg-dark-bg-secondary flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-light-text-primary dark:text-dark-text-primary bg-light-bg-primary dark:bg-dark-bg-primary hover:bg-light-border-light dark:hover:bg-dark-border-light transition-all duration-200 flex items-center font-medium"
                  onClick={closeModal}
                  disabled={actionLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleEditUser}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-50 text-white hover:bg-primary-600 dark:hover:bg-primary-600 transition-all duration-200 flex items-center font-medium"
                >
                  {actionLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
