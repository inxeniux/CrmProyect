"use client";

import { useState, useCallback } from "react";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { validateForm, ValidationErrors } from "@/validations/userValidations";
import { showToast } from "@/utils/toast";
import UsersTable from "./UsersTable";
import Cookies from "js-cookie";
import BussinessData from "./BussinessData";

interface BusinessFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleUser: string;
  status: "active";
  createdAt: string;
  updatedAt: string;
}

const initialFormData: BusinessFormData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  roleUser: "",
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function BusinessTab() {
  const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setFormSubmitted(false);
  }, []);

  const validateFormData = useCallback(() => {
    const validationErrors = validateForm(formData);

    if (!formData.roleUser) {
      validationErrors.roleUser = "Por favor, selecciona un rol";
    }

    setErrors(validationErrors);
    return !Object.values(validationErrors).some((error) => error !== "");
  }, [formData]);

  const handleSave = async () => {
    setFormSubmitted(true);

    if (!validateFormData()) {
      showToast.error("Por favor, completa todos los campos correctamente");
      return;
    }

    setIsLoading(true);
    const loadingToast = showToast.loading("Creando usuario...");

    try {
      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("No se ha encontrado el token de autenticación");
      }

      const response = await fetch("/api/create-user-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          roleUser: formData.roleUser,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear usuario");
      }

      showToast.updateLoading(
        loadingToast,
        "Usuario creado exitosamente, se ha enviado una invitación al correo",
        "success"
      );

      resetForm();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      showToast.updateLoading(
        loadingToast,
        error instanceof Error
          ? error.message
          : "Error desconocido al crear usuario",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString(),
    }));

    // Solo limpia errores si el formulario ya ha sido enviado
    if (formSubmitted && errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getBorderClass = (fieldName: keyof ValidationErrors) => {
    return formSubmitted && errors[fieldName]
      ? "border-error-light dark:border-error-dark"
      : "border-light-border-medium dark:border-dark-border-medium";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-0"
    >
      <BussinessData />

      {/* Formulario de creación */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-md p-3 sm:p-4 md:p-8 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 sm:mb-6 md:mb-8">
          <div className="p-2 sm:p-3 bg-primary-50/10 rounded-lg mb-3 sm:mb-4 md:mb-0 w-fit">
            <FiUserPlus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-50" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Crear Nuevo Usuario
            </h2>
            <p className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Ingresa los datos del nuevo usuario para el negocio
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Email Field */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  aria-invalid={formSubmitted && Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                         bg-light-bg-input dark:bg-dark-bg-input 
                         border ${getBorderClass("email")}
                         text-light-text-primary dark:text-dark-text-primary
                         focus:ring-2 focus:ring-primary-50 focus:border-transparent
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>
              {formSubmitted && errors.email && (
                <p
                  id="email-error"
                  className="text-xs md:text-sm text-error-light dark:text-error-dark px-1"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Nombre Field */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="firstName" className="sr-only">
                Nombre
              </label>
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  aria-invalid={formSubmitted && Boolean(errors.firstName)}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                         bg-light-bg-input dark:bg-dark-bg-input 
                         border ${getBorderClass("firstName")}
                         text-light-text-primary dark:text-dark-text-primary
                         focus:ring-2 focus:ring-primary-50 focus:border-transparent
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>
              {formSubmitted && errors.firstName && (
                <p
                  id="firstName-error"
                  className="text-xs md:text-sm text-error-light dark:text-error-dark px-1"
                >
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Apellido Field */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="lastName" className="sr-only">
                Apellido
              </label>
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  aria-invalid={formSubmitted && Boolean(errors.lastName)}
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                         bg-light-bg-input dark:bg-dark-bg-input 
                         border ${getBorderClass("lastName")}
                         text-light-text-primary dark:text-dark-text-primary
                         focus:ring-2 focus:ring-primary-50 focus:border-transparent
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>
              {formSubmitted && errors.lastName && (
                <p
                  id="lastName-error"
                  className="text-xs md:text-sm text-error-light dark:text-error-dark px-1"
                >
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="phoneNumber" className="sr-only">
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="Teléfono 10 dígitos (Ej. 1234567890)"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  aria-invalid={formSubmitted && Boolean(errors.phoneNumber)}
                  aria-describedby={
                    errors.phoneNumber ? "phoneNumber-error" : undefined
                  }
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                         bg-light-bg-input dark:bg-dark-bg-input 
                         border ${getBorderClass("phoneNumber")}
                         text-light-text-primary dark:text-dark-text-primary
                         focus:ring-2 focus:ring-primary-50 focus:border-transparent
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>
              {formSubmitted && errors.phoneNumber && (
                <p
                  id="phoneNumber-error"
                  className="text-xs md:text-sm text-error-light dark:text-error-dark px-1"
                >
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Role Field */}
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="roleUser"
              className="text-sm text-light-text-primary dark:text-dark-text-primary"
            >
              Rol del Usuario
            </label>
            <select
              id="roleUser"
              name="roleUser"
              value={formData.roleUser}
              onChange={handleChange}
              disabled={isLoading}
              aria-invalid={formSubmitted && Boolean(errors.roleUser)}
              aria-describedby={errors.roleUser ? "roleUser-error" : undefined}
              className={`w-full rounded-lg text-sm md:text-base py-2 md:py-3
                       bg-light-bg-input dark:bg-dark-bg-input 
                       border ${getBorderClass("roleUser")}
                       text-light-text-primary dark:text-dark-text-primary
                       focus:ring-2 focus:ring-primary-50 focus:border-transparent
                       transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <option value="">Selecciona un rol</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
              <option value="Support">Support</option>
              <option value="Customer">Customer</option>
            </select>
            {formSubmitted && errors.roleUser && (
              <p
                id="roleUser-error"
                className="text-xs md:text-sm text-error-light dark:text-error-dark px-1"
              >
                {errors.roleUser}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-full">
            <motion.button
              type="button"
              onClick={handleSave}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              className="w-full mt-4 sm:mt-6 md:mt-8 
                       px-3 sm:px-4 md:px-6 
                       py-2 sm:py-2.5 md:py-3 
                       rounded-lg 
                       bg-primary-50 text-white 
                       text-xs sm:text-sm md:text-base 
                       font-medium
                       hover:bg-primary-600 focus:outline-none focus:ring-2 
                       focus:ring-primary-600 focus:ring-offset-2 transition-all 
                       duration-200 disabled:opacity-70 disabled:cursor-not-allowed 
                       shadow-lg shadow-primary-50/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creando usuario...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FiUserPlus className="mr-2" />
                  <span>Crear Usuario</span>
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="mt-6 sm:mt-8 md:mt-10">
        <UsersTable />
      </div>
    </motion.div>
  );
}
