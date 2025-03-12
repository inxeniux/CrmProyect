"use client";

import { useState, useEffect, memo, useMemo } from "react";
import {
  FiUser,
  FiPhone,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
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

// Componente de campo de entrada memoizado
const FormInput = memo(
  ({
    icon: Icon,
    name,
    placeholder,
    value,
    onChange,
    error,
    type = "text",
    required = false,
    helpText,
  }: {
    icon: React.ElementType;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    required?: boolean;
    helpText?: string;
  }) => {
    return (
      <div className="flex flex-col space-y-1">
        <label
          htmlFor={name}
          className="text-xs font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary flex items-center"
        >
          {placeholder}
          {required && <span className="text-error-light ml-1">*</span>}
          {helpText && (
            <div className="group relative ml-1.5">
              <FiInfo className="h-3.5 w-3.5 text-light-text-tertiary dark:text-dark-text-tertiary cursor-help" />
              <div
                className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                        absolute z-10 -left-2 bottom-full mb-2 px-3 py-2 text-xs rounded-md shadow-lg
                        bg-light-bg-tooltip dark:bg-dark-bg-tooltip text-light-text-primary dark:text-dark-text-primary
                        w-48 break-words"
              >
                {helpText}
              </div>
            </div>
          )}
        </label>
        <div className="relative">
          <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
          </div>
          <input
            id={name}
            type={type}
            name={name}
            placeholder={`Ingresa ${placeholder.toLowerCase()}`}
            value={value}
            onChange={onChange}
            className={`pl-10 w-full rounded-lg text-sm md:text-base py-2.5 md:py-3
            bg-light-bg-input dark:bg-dark-bg-input 
            border ${
              error
                ? "border-error-light"
                : value
                ? "border-success/50 dark:border-success/30"
                : "border-light-border-medium dark:border-dark-border-medium"
            }
            text-light-text-primary dark:text-dark-text-primary
            focus:ring-2 focus:ring-primary-50 focus:border-transparent
            transition-all duration-200 hover:border-primary-50/50`}
          />
          {value && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
              <FiCheck className="h-4 w-4" />
            </div>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-error-light flex items-center"
            >
              <FiAlertCircle className="mr-1.5 flex-shrink-0" /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export default function ProfileForm() {
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

  // Calcular progreso del formulario
  const formProgress = useMemo(() => {
    const requiredFields = ["firstName", "lastName", "phoneNumber"];
    const filledFields = requiredFields.filter((field) =>
      formData[field as keyof UserFormData]?.trim()
    );
    return (filledFields.length / requiredFields.length) * 100;
  }, [formData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-sm p-3 sm:p-4 md:p-8 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 sm:mb-6 md:mb-8">
        <div className="p-2.5 sm:p-3.5 bg-primary-50/10 rounded-lg mb-3 sm:mb-4 md:mb-0 w-fit">
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

        {/* Indicador de progreso */}
        <div className="md:ml-auto mt-3 md:mt-0">
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-light-text-secondary">
              Progreso
            </div>
            <div className="h-2.5 w-24 bg-light-bg-input dark:bg-dark-bg-input rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-50"
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-xs font-medium text-primary-50">
              {Math.round(formProgress)}%
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6 md:space-y-8">
        <div className="p-4 border border-light-border-medium dark:border-dark-border-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary">
          <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
            Información personal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <FormInput
              icon={FiUser}
              name="firstName"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required={true}
            />

            <FormInput
              icon={FiUser}
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required={true}
            />

            <FormInput
              icon={FiPhone}
              name="phoneNumber"
              placeholder="Teléfono"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              required={true}
              helpText="Formato: 10 dígitos (Ej. 1234567890)"
            />
          </div>
        </div>

        {/* Botón Guardar */}
        <motion.button
          onClick={handleSave}
          whileHover={{
            scale: 1.01,
            boxShadow: "0 4px 12px rgba(255, 87, 51, 0.2)",
          }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className="w-full px-6 py-3.5 rounded-lg bg-gradient-to-r from-primary-50 to-primary-600 
                    text-white font-medium shadow-sm hover:shadow-md transition-all duration-300
                    disabled:opacity-70 disabled:cursor-not-allowed
                    flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin h-5 w-5" />
              <span>Guardando cambios...</span>
            </>
          ) : (
            <>
              <FiCheck className="h-5 w-5" />
              <span>Guardar Cambios</span>
            </>
          )}
        </motion.button>

        {/* Mensaje de ayuda */}
        <div className="text-center">
          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            Los campos marcados con <span className="text-error-light">*</span>{" "}
            son obligatorios
          </p>
        </div>
      </div>
    </motion.div>
  );
}
