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
  const [formData, setFormData] = useState<BusinessData>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    website: "",
    industry: "",
    logo: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const authToken = Cookies.get("auth_token");

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await fetch("/api/business", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();

        if (response.ok && data) {
          setFormData({
            ...data,
            logo: data.logo || null,
          });
          setIsEditing(true);
        }
      } catch (error) {
        console.error(error);
        showToast.error("Error al cargar los datos del negocio");
      }
    };

    fetchBusinessData();
  }, [authToken]);

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
    const newErrors: { [key: string]: string } = {
      name: validateName(formData.name, "nombre"),
      email: validateEmail(formData.email),
      phoneNumber: validatePhone(formData.phoneNumber),
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      showToast.error("Por favor, corrige los errores en el formulario");
      return;
    }

    setIsLoading(true);
    const loadingToast = showToast.loading(
      isEditing ? "Actualizando negocio..." : "Creando negocio..."
    );

    try {
      const formDataToSend = new FormData();

      // Agregar todos los campos al FormData
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("industry", formData.industry);

      if (formData.id) {
        formDataToSend.append("id", formData.id);
      }

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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al procesar la solicitud");
      }

      showToast.updateLoading(
        loadingToast,
        isEditing
          ? "Negocio actualizado exitosamente"
          : "Negocio creado exitosamente",
        "success"
      );

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
      }
      setErrors({});
    } catch (error) {
      showToast.error(String(error));
      console.log("error", error);
      showToast.updateLoading(
        loadingToast,
        isEditing ? "Error al actualizar negocio" : "Error al crear negocio",
        "error"
      );
    } finally {
      setIsLoading(false);
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
                className="pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                bg-light-bg-input dark:bg-dark-bg-input 
                border ${errors.phoneNumber ? 'border-error-light' : 'border-light-border-medium dark:border-dark-border-medium'}
                text-light-text-primary dark:text-dark-text-primary
                focus:ring-2 focus:ring-primary-50 focus:border-transparent
                transition-all duration-200"
              />
              {errors.name && (
                <p className="text-xs text-error-light">{errors.name}</p>
              )}
            </div>

            {/* Email */}
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
                className="pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                bg-light-bg-input dark:bg-dark-bg-input 
                border ${errors.phoneNumber ? 'border-error-light' : 'border-light-border-medium dark:border-dark-border-medium'}
                text-light-text-primary dark:text-dark-text-primary
                focus:ring-2 focus:ring-primary-50 focus:border-transparent
                transition-all duration-200"
              />
              {errors.email && (
                <p className="text-xs text-error-light">{errors.email}</p>
              )}
            </div>

            {/* Teléfono */}
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
                className="pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                bg-light-bg-input dark:bg-dark-bg-input 
                border ${errors.phoneNumber ? 'border-error-light' : 'border-light-border-medium dark:border-dark-border-medium'}
                text-light-text-primary dark:text-dark-text-primary
                focus:ring-2 focus:ring-primary-50 focus:border-transparent
                transition-all duration-200"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-error-light">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Dirección */}
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
                className="pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                bg-light-bg-input dark:bg-dark-bg-input 
                border ${errors.phoneNumber ? 'border-error-light' : 'border-light-border-medium dark:border-dark-border-medium'}
                text-light-text-primary dark:text-dark-text-primary
                focus:ring-2 focus:ring-primary-50 focus:border-transparent
                transition-all duration-200"
              />
              {errors.address && (
                <p className="text-xs text-error-light">{errors.address}</p>
              )}
            </div>

            {/* Sitio Web */}
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
                className="pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                         bg-light-bg-input dark:bg-dark-bg-input 
                         border ${errors.phoneNumber ? 'border-error-light' : 'border-light-border-medium dark:border-dark-border-medium'}
                         text-light-text-primary dark:text-dark-text-primary
                         focus:ring-2 focus:ring-primary-50 focus:border-transparent
                         transition-all duration-200"
              />
              {errors.website && (
                <p className="text-xs text-error-light">{errors.website}</p>
              )}
            </div>

            {/* Industria */}
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
                className="pl-10 w-full rounded-lg text-sm md:text-base py-2 md:py-3
                bg-light-bg-input dark:bg-dark-bg-input 
                border ${errors.phoneNumber ? 'border-error-light' : 'border-light-border-medium dark:border-dark-border-medium'}
                text-light-text-primary dark:text-dark-text-primary
                focus:ring-2 focus:ring-primary-50 focus:border-transparent
                transition-all duration-200"
              />
              {errors.industry && (
                <p className="text-xs text-error-light">{errors.industry}</p>
              )}
            </div>

            {/* Logo */}
            <div className="relative w-full">
              <label
                className="flex flex-col items-center justify-center gap-2 p-4 w-full border-2 border-dashed rounded-lg cursor-pointer
               bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600
               text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
               focus-within:ring-2 focus-within:ring-primary-50 focus-within:border-transparent
               transition-all duration-200"
              >
                <FiImage className="text-gray-400 text-3xl" />
                <span className="text-sm md:text-base font-medium">
                  Subir imagen
                </span>
                <input
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {formData.logo && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {formData.logo instanceof File ? formData.logo.name : ""}
                </p>
              )}

              {errors.logo && (
                <p className="mt-1 text-xs text-red-500 text-center">
                  {errors.logo}
                </p>
              )}
            </div>

            {typeof formData.logo === "string" && formData.logo && (
              <div className=" relative w-24 h-24 rounded-lg border overflow-hidden">
                <Image
                  src={formData.logo}
                  alt="Logo del negocio"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Botón de enviar */}
          <motion.button
            type="button"
            onClick={handleSubmit}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-lg bg-primary-50 text-white font-medium hover:bg-primary-600 focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? isEditing
                ? "Actualizando negocio..."
                : "Creando negocio..."
              : isEditing
              ? "Actualizar Negocio"
              : "Crear Negocio"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
