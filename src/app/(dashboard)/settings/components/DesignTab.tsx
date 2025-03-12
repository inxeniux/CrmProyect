"use client";

import { useState, memo, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/utils/toast";
import Cookies from "js-cookie";
import { MdDesignServices } from "react-icons/md";
import { RiColorFilterFill } from "react-icons/ri";
import { FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";
import {
  validateFormDesign,
  ValidationErrorsDesign,
} from "@/validations/userValidations";

// Define API response interface
interface BusinessColorApiResponse {
  updatedBusiness: {
    color1: string;
    color2: string;
    color3: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface BusinessFormData {
  color1: string;
  color2: string;
  color3: string;
  createdAt: string;
  updatedAt: string;
}

// Añadir variantes de animación
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

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

export default function DesignTab() {
  const [formData, setFormData] = useState<BusinessFormData>({
    color1: "",
    color2: "",
    color3: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<ValidationErrorsDesign>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        showToast.error("Token de autenticación no encontrado");
        return;
      }

      try {
        const response = await fetch("/api/business/colorupdate", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok)
          throw new Error("Error al obtener los datos del usuario");

        const data = (await response.json()) as BusinessColorApiResponse;

        if (data.updatedBusiness) {
          setFormData({
            ...data.updatedBusiness,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(error);
        showToast.error("Error al obtener los datos del usuario");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const validationErrors = validateFormDesign(formData);

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );

    if (hasErrors) {
      setErrors(validationErrors);
      showToast.error("Por favor, completa todos los campos correctamente");
      return;
    }

    setIsLoading(true);
    const loadingToast = showToast.loading("Creando usuario...");

    try {
      const token = Cookies.get("auth_token");
      const response = await fetch("/api/business/colorupdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          color1: formData.color1,
          color2: formData.color2,
          color3: formData.color3,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear usuario");
      }

      showToast.updateLoading(
        loadingToast,
        "Paleta de colores actualizada",
        "success"
      );

      // Limpiar formulario
      setErrors({});
    } catch (error) {
      console.log(error);
      showToast.updateLoading(loadingToast, String(error), "error");
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

    if (errors[name as keyof ValidationErrorsDesign]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Calcular progreso del formulario
  const formProgress = useMemo(() => {
    const fields = ["color1", "color2", "color3"];
    const filledFields = fields.filter((field) =>
      formData[field as keyof BusinessFormData]?.trim()
    );
    return (filledFields.length / fields.length) * 100;
  }, [formData]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="border-b border-light-border-light dark:border-dark-border-light pb-12"
    >
      <AnimatePresence mode="wait">
        <motion.div
          variants={itemVariants}
          className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-sm p-3 sm:p-4 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 sm:mb-6 md:mb-8">
            <div className="p-2 sm:p-3 bg-primary-50/10 rounded-lg mb-3 sm:mb-4 md:mb-0 w-fit">
              <MdDesignServices className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-50" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                Actualizar diseño
              </h2>
              <p className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Ingresa los datos de tu diseño para personalizar el crm
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
                Paleta de colores
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
                <FormInput
                  icon={RiColorFilterFill}
                  name="color1"
                  placeholder="Color primario"
                  value={formData.color1}
                  onChange={handleChange}
                  error={errors.color1}
                  required={true}
                  helpText="Código hexadecimal del color principal"
                />

                <FormInput
                  icon={RiColorFilterFill}
                  name="color2"
                  placeholder="Color secundario"
                  value={formData.color2}
                  onChange={handleChange}
                  error={errors.color2}
                  required={true}
                  helpText="Código hexadecimal del color secundario"
                />

                <FormInput
                  icon={RiColorFilterFill}
                  name="color3"
                  placeholder="Color terciario"
                  value={formData.color3}
                  onChange={handleChange}
                  error={errors.color3}
                  required={true}
                  helpText="Código hexadecimal del color terciario"
                />
              </div>
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
                        duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
                        shadow-lg shadow-primary-50/20"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    Actualizando ...
                  </span>
                ) : (
                  "Actualizar diseño"
                )}
              </motion.button>
            </div>

            {/* Mensaje de ayuda */}
            <div className="text-center">
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Los campos marcados con{" "}
                <span className="text-error-light">*</span> son obligatorios
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
