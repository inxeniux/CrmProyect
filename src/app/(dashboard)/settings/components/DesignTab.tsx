"use client";

import { showToast } from "@/utils/toast";
import {  validateFormDesign, ValidationErrorsDesign } from "@/validations/userValidations";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { MdDesignServices } from "react-icons/md";
import { RiColorFilterFill } from "react-icons/ri";

export default function DesignTab() {

  interface BusinessFormData {
    color1: string;
    color2: string;
    color3: string;
    createdAt: string;
    updatedAt: string;
  }

  

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

        const data: BusinessFormData = await response.json();
        setFormData({ ...data.updatedBusiness, updatedAt: new Date().toISOString() });

      } catch {
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
          color3: formData.color3
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
  return (
    <div className="border-b border-light-border-light dark:border-dark-border-light pb-12">
      {/* Formulario de creación */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-sm p-3 sm:p-4 md:p-8">
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
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            

            {/* Color Field */}
            <div className="flex flex-col space-y-1">
              
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <RiColorFilterFill className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  type="text"
                  name="color1"
                  placeholder="Color primario"
                  value={formData.color1}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                         bg-light-bg-input dark:bg-dark-bg-input 
                         border ${errors.color1 ? 'border-error-light' : 'border-light-border-medium dark:border-dark-border-medium'}
                         text-light-text-primary dark:text-dark-text-primary
                         focus:ring-2 focus:ring-primary-50 focus:border-transparent
                         transition-all duration-200"
                />
              </div>
              {errors.color1 && (
                <p className="text-xs md:text-sm text-error-light px-1">
                  {errors.color1}
                </p>
              )}
            </div>

            {/* Color Field */}
            <div className="flex flex-col space-y-1">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <RiColorFilterFill className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  type="text"
                  name="color2"
                  placeholder="Color secundario"
                  value={formData.color2}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                         bg-light-bg-input dark:bg-dark-bg-input 
                         border ${errors.color2 ? 'border-error-light' : 'border-light-border-medium dark:border-dark-border-medium'}
                         text-light-text-primary dark:text-dark-text-primary
                         focus:ring-2 focus:ring-primary-50 focus:border-transparent
                         transition-all duration-200"
                />
              </div>
              {errors.color2 && (
                <p className="text-xs md:text-sm text-error-light px-1">
                  {errors.color2}
                </p>
              )}
            </div>

            {/* Color Field */}
            <div className="flex flex-col space-y-1">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <RiColorFilterFill className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  type="tel"
                  name="color3"
                  placeholder="Color 3"
                  value={formData.color3}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                         bg-light-bg-input dark:bg-dark-bg-input 
                         border ${errors.color3 ? 'border-error-light' : 'border-light-border-medium dark:border-dark-border-medium'}
                         text-light-text-primary dark:text-dark-text-primary
                         focus:ring-2 focus:ring-primary-50 focus:border-transparent
                         transition-all duration-200"
                />
              </div>
              {errors.color3 && (
                <p className="text-xs md:text-sm text-error-light px-1">
                  {errors.color3}
                </p>
              )}
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
        </div>
      </div>

    </div>
  );
}
