"use client";

import { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiBriefcase,
  FiImage,
  FiUser,
  FiTag,
  FiUpload,
  FiLoader,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { showToast } from "@/utils/toast";
import Cookies from "js-cookie";
import {
  validateEmail,
  validateName,
  validatePhone,
} from "@/validations/userValidations";
import Image from "next/image";

// Inicializar con valores vacíos pero definidos
const initialFormData = {
  id: "",
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  website: "",
  industry: "",
  logo: null as string | File | null,
};

interface BusinessData {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
  industry: string;
  logo: string | File | null;
}

export default function BussinessData() {
  // Usar el estado inicial definido
  const [formData, setFormData] = useState<BusinessData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDataFetched, setIsDataFetched] = useState(false);

  const authToken = Cookies.get("auth_token");

  useEffect(() => {
    if (authToken) {
      fetchBusinessData();
    }
  }, [authToken]);

  const fetchBusinessData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/business", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        if (response.status !== 404) {
          // Ignorar 404 (no data found)
          throw new Error("Error al cargar los datos del negocio");
        }
        return;
      }

      const data = await response.json();

      if (data) {
        // Asegurar que todos los campos tienen valores
        setFormData({
          id: data.id || "",
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          website: data.website || "",
          industry: data.industry || "",
          logo: data.logo || null,
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      showToast.error("Error al cargar los datos del negocio");
    } finally {
      setIsLoading(false);
      setIsDataFetched(true);
    }
  };

  // Asegurar que los inputs tienen valores definidos aunque sean vacíos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let validationError = "";
    if (name === "email") validationError = validateEmail(value);
    if (name === "name") validationError = validateName(value, "nombre");
    if (name === "phoneNumber") validationError = validatePhone(value);

    setErrors((prev) => ({ ...prev, [name]: validationError }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validación de campos obligatorios
      const newErrors: { [key: string]: string } = {
        name: validateName(formData.name.trim(), "nombre"),
        email: validateEmail(formData.email.trim()),
        phoneNumber: validatePhone(formData.phoneNumber.trim()),
      };

      // Validar que los campos obligatorios no estén vacíos
      if (!formData.name.trim()) {
        newErrors.name = "El nombre del negocio es obligatorio";
      }
      if (!formData.email.trim()) {
        newErrors.email = "El correo electrónico es obligatorio";
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "El número de teléfono es obligatorio";
      }

      // Verificar si hay errores de validación
      if (Object.values(newErrors).some((error) => error)) {
        setErrors(newErrors);
        showToast.error("Por favor, corrige los errores en el formulario");
        return;
      }

      setIsLoading(true);
      const loadingToast = showToast.loading(
        isEditing ? "Actualizando negocio..." : "Creando negocio..."
      );

      // Crear FormData y agregar todos los campos
      const formDataToSend = new FormData();

      // Limpieza de datos antes de enviar
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("phoneNumber", formData.phoneNumber.trim());
      formDataToSend.append("address", formData.address.trim());
      formDataToSend.append("website", formData.website.trim());
      formDataToSend.append("industry", formData.industry.trim());

      if (formData.id) {
        formDataToSend.append("id", formData.id);
      }

      // Solo adjuntar logo si es un archivo nuevo
      if (formData.logo instanceof File) {
        formDataToSend.append("logo", formData.logo);
      }

      const endpoint = "/api/business";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formDataToSend,
      });

      // Manejar respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al procesar la solicitud");
      }

      const data = await response.json();

      showToast.updateLoading(
        loadingToast,
        isEditing
          ? "Negocio actualizado exitosamente"
          : "Negocio creado exitosamente",
        "success"
      );
      fetchBusinessData();
      // Si se está creando un negocio, limpiar el formulario
      if (!isEditing) {
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          address: "",
          website: "",
          industry: "",
          logo: null,
        });
      } else {
        // Si estamos editando, actualizar el estado con los datos más recientes
        setFormData({
          ...data,
          logo: data.logo || null,
        });
      }
      setErrors({});
    } catch (error) {
      console.error("Error:", error);
      showToast.error(
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar condicionalmente para evitar cambios de no controlado a controlado
  if (!isDataFetched && !isEditing) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <FiLoader className="animate-spin h-8 w-8 text-primary-50" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-0"
    >
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-sm p-3 sm:p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 sm:mb-6 md:mb-8">
          <div className="p-2 sm:p-3 bg-primary-50/10 rounded-lg mb-3 sm:mb-4 md:mb-0 w-fit">
            <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-50" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              {isEditing ? "Editar Negocio" : "Crear Nuevo Negocio"}
            </h2>
            <p className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {isEditing
                ? "Edita los datos del negocio."
                : "Ingresa los datos del nuevo negocio."}
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Nombre del negocio */}
            <div className="relative flex flex-col">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>

                <input
                  type="text"
                  name="name"
                  placeholder="Nombre del negocio"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                  bg-light-bg-input dark:bg-dark-bg-input 
                  border ${
                    errors.name
                      ? "border-error-light"
                      : "border-light-border-medium dark:border-dark-border-medium"
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  focus:ring-2 focus:ring-primary-50 focus:border-transparent
                  transition-all duration-200`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-error-light mt-1 flex items-center">
                  <FiAlertCircle className="mr-1 flex-shrink-0" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative flex flex-col">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo del negocio"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                  bg-light-bg-input dark:bg-dark-bg-input 
                  border ${
                    errors.email
                      ? "border-error-light"
                      : "border-light-border-medium dark:border-dark-border-medium"
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  focus:ring-2 focus:ring-primary-50 focus:border-transparent
                  transition-all duration-200`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error-light mt-1 flex items-center">
                  <FiAlertCircle className="mr-1 flex-shrink-0" />{" "}
                  {errors.email}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="relative flex flex-col">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>

                <input
                  type="tel"
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
                  focus:ring-2 focus:ring-primary-50 focus:border-transparent
                  transition-all duration-200`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-error-light mt-1 flex items-center">
                  <FiAlertCircle className="mr-1 flex-shrink-0" />{" "}
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Dirección */}
            <div className="relative flex flex-col">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>

                <input
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  value={formData.address}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                  bg-light-bg-input dark:bg-dark-bg-input 
                  border ${
                    errors.address
                      ? "border-error-light"
                      : "border-light-border-medium dark:border-dark-border-medium"
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  focus:ring-2 focus:ring-primary-50 focus:border-transparent
                  transition-all duration-200`}
                />
              </div>
              {errors.address && (
                <p className="text-xs text-error-light mt-1 flex items-center">
                  <FiAlertCircle className="mr-1 flex-shrink-0" />{" "}
                  {errors.address}
                </p>
              )}
            </div>

            {/* Sitio Web */}
            <div className="relative flex flex-col">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>

                <input
                  type="text"
                  name="website"
                  placeholder="Sitio web"
                  value={formData.website}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                            bg-light-bg-input dark:bg-dark-bg-input 
                            border ${
                              errors.website
                                ? "border-error-light"
                                : "border-light-border-medium dark:border-dark-border-medium"
                            }
                            text-light-text-primary dark:text-dark-text-primary
                            focus:ring-2 focus:ring-primary-50 focus:border-transparent
                            transition-all duration-200`}
                />
              </div>
              {errors.website && (
                <p className="text-xs text-error-light mt-1 flex items-center">
                  <FiAlertCircle className="mr-1 flex-shrink-0" />{" "}
                  {errors.website}
                </p>
              )}
            </div>

            {/* Industria */}
            <div className="relative flex flex-col">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                  <FiTag className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </div>

                <input
                  type="text"
                  name="industry"
                  placeholder="Industria"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                  bg-light-bg-input dark:bg-dark-bg-input 
                  border ${
                    errors.industry
                      ? "border-error-light"
                      : "border-light-border-medium dark:border-dark-border-medium"
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  focus:ring-2 focus:ring-primary-50 focus:border-transparent
                  transition-all duration-200`}
                />
              </div>
              {errors.industry && (
                <p className="text-xs text-error-light mt-1 flex items-center">
                  <FiAlertCircle className="mr-1 flex-shrink-0" />{" "}
                  {errors.industry}
                </p>
              )}
            </div>

            {/* Logo */}
            <div className="relative w-full md:col-span-1">
              <label
                className="flex flex-col items-center justify-center gap-2 p-6 w-full border-2 border-dashed rounded-lg cursor-pointer
              bg-light-bg-input dark:bg-dark-bg-input border-primary-50/30 dark:border-dark-border-medium
              text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
              focus-within:ring-2 focus-within:ring-primary-50/50 focus-within:border-transparent
              transition-all duration-200"
              >
                <FiUpload className="text-primary-50 text-2xl" />
                <span className="text-sm md:text-base font-medium flex items-center gap-1">
                  <FiImage className="text-primary-50" /> Subir logo
                </span>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  PNG, JPG (max. 2MB)
                </p>
                <input
                  type="file"
                  name="logo"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {formData.logo instanceof File && (
                <div className="mt-2 flex items-center justify-center text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <FiCheck className="text-success mr-1" />
                  {formData.logo.name}
                </div>
              )}

              {errors.logo && (
                <p className="mt-1 text-xs text-error-light flex items-center justify-center">
                  <FiAlertCircle className="mr-1" /> {errors.logo}
                </p>
              )}
            </div>
          </div>

          {/* Visualización del logo actual */}
          {typeof formData.logo === "string" && formData.logo && (
            <div className="flex flex-col items-center md:col-span-1 p-4 border rounded-lg bg-light-bg-input dark:bg-dark-bg-input border-primary-50/20">
              <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2 flex items-center">
                <FiImage className="mr-1.5 text-primary-50" /> Logo actual
              </p>
              <div className="relative w-32 h-32 rounded-lg border-2 border-primary-50/30 overflow-hidden shadow-md group">
                <Image
                  src={formData.logo}
                  alt="Logo del negocio"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.png"; // Asegúrate de tener una imagen placeholder
                  }}
                />
              </div>
            </div>
          )}

          {/* Botón de enviar */}
          <motion.button
            type="button"
            onClick={handleSubmit}
            whileHover={{
              scale: 1.01,
              boxShadow: "0 4px 12px rgba(255, 87, 51, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            disabled={isLoading}
            className="w-full px-6 py-3.5 mt-4 rounded-lg bg-gradient-to-r from-primary-50 to-primary-600 text-white font-medium 
                      hover:from-primary-600 hover:to-primary-700 focus:ring-2 focus:ring-primary-50/50 focus:ring-offset-1
                      shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                      flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin h-5 w-5" />
                <span>{isEditing ? "Actualizando..." : "Creando..."}</span>
              </>
            ) : (
              <>
                <FiCheck className={isEditing ? "h-5 w-5" : "h-5 w-5 hidden"} />
                <span>
                  {isEditing ? "Actualizar Negocio" : "Crear Negocio"}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
