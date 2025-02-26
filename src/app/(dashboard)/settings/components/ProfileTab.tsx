"use client";

import { useState, useEffect } from "react";
import { FiUser, FiPhone } from "react-icons/fi";
import { motion } from "framer-motion";
import { showToast } from "@/utils/toast";
import Cookies from "js-cookie";
import {
  validateFormProfile,
  ValidationErrorsProfile,
} from "@/validations/userValidations";

interface UserFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  updatedAt: string;
}

export default function ProfileTab() {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    updatedAt: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<ValidationErrorsProfile>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        showToast.error("Token de autenticación no encontrado");
        return;
      }

      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok)
          throw new Error("Error al obtener los datos del usuario");

        const data: UserFormData = await response.json();
        setFormData({ ...data, updatedAt: new Date().toISOString() });
      } catch {
        showToast.error("Error al obtener los datos del usuario");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const validationErrors = validateFormProfile(formData);
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );

    if (hasErrors) {
      setErrors(validationErrors);
      showToast.error("Por favor, completa todos los campos correctamente");
      return;
    }

    setIsLoading(true);
    const loadingToast = showToast.loading("Guardando cambios...");

    try {
      const authToken = Cookies.get("auth_token");
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar usuario");
      }

      showToast.updateLoading(
        loadingToast,
        "Perfil actualizado exitosamente",
        "success"
      );
    } catch {
      showToast.updateLoading(loadingToast, "error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString(),
    }));

    if (errors[name as keyof ValidationErrorsProfile]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-0"
    >
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-sm p-3 sm:p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 sm:mb-6 md:mb-8">
          <div className="p-2 sm:p-3 bg-primary-50/10 rounded-lg mb-3 sm:mb-4 md:mb-0 w-fit">
            <FiUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-50" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Editar Perfil
            </h2>
            <p className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Actualiza tu información personal
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Nombre */}
            <div className="flex flex-col space-y-1">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                    bg-light-bg-input dark:bg-dark-bg-input 
                    border ${
                      errors.firstName
                        ? "border-error-light"
                        : "border-light-border-medium dark:border-dark-border-medium"
                    }
                    text-light-text-primary dark:text-dark-text-primary
                    focus:ring-2 focus:ring-primary-50 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs md:text-sm text-error-light px-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Apellido */}
            <div className="flex flex-col space-y-1">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                    bg-light-bg-input dark:bg-dark-bg-input 
                    border ${
                      errors.lastName
                        ? "border-error-light"
                        : "border-light-border-medium dark:border-dark-border-medium"
                    }
                    text-light-text-primary dark:text-dark-text-primary
                    focus:ring-2 focus:ring-primary-50 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.lastName && (
                <p className="text-xs md:text-sm text-error-light px-1">
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="flex flex-col space-y-1">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Teléfono 10 digitos (Ej. 1234567890)"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                    bg-light-bg-input dark:bg-dark-bg-input 
                    border ${
                      errors.phoneNumber
                        ? "border-error-light"
                        : "border-light-border-medium dark:border-dark-border-medium"
                    }
                    text-light-text-primary dark:text-dark-text-primary
                    focus:ring-2 focus:ring-primary-50 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs md:text-sm text-error-light px-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Botón Guardar */}
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading}
            className="w-full bg-primary-50 text-white rounded-lg px-4 py-2 text-sm md:text-base font-medium shadow-md"
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
