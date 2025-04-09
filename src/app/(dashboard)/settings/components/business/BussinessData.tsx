"use client";

import { useState, useEffect, useCallback, memo, useMemo } from "react";
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
  FiInfo,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
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

// Hook personalizado para manejar el formulario y validaciones
function useBusinessForm() {
  const [formData, setFormData] = useState<BusinessData>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState(false);

  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case "name":
        return validateName(value, "nombre");
      case "email":
        return validateEmail(value);
      case "phoneNumber":
        return validatePhone(value);
      default:
        return "";
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value || "" }));

      const validationError = validateField(name, value || "");
      setErrors((prev) => ({ ...prev, [name]: validationError }));
    },
    [validateField]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFormData((prev) => ({ ...prev, logo: e.target.files![0] }));
      }
    },
    []
  );

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {
      name: validateName(formData.name.trim(), "nombre"),
      email: validateEmail(formData.email.trim()),
      phoneNumber: validatePhone(formData.phoneNumber.trim()),
    };

    // Validar campos obligatorios vacíos
    if (!formData.name.trim())
      newErrors.name = "El nombre del negocio es obligatorio";
    if (!formData.email.trim())
      newErrors.email = "El correo electrónico es obligatorio";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "El número de teléfono es obligatorio";

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  }, [formData]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isEditing,
    setIsEditing,
    handleChange,
    handleFileChange,
    validateForm,
  };
}

// Hook personalizado para manejar las operaciones de API
function useBusinessApi(
  formData: BusinessData,
  setFormData: React.Dispatch<React.SetStateAction<BusinessData>>,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  validateForm: () => boolean,
  isEditing: boolean,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const authToken = Cookies.get("auth_token");

  const fetchBusinessData = useCallback(async () => {
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
          throw new Error("Error al cargar los datos del negocio");
        }
        return;
      }

      const data = await response.json();

      if (data) {
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
  }, [authToken, setFormData, setIsEditing]);

  useEffect(() => {
    if (authToken) {
      fetchBusinessData();
    }
  }, [authToken, fetchBusinessData]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!validateForm()) {
        showToast.error("Por favor, corrige los errores en el formulario");
        return;
      }

      setIsLoading(true);
      const loadingToast = showToast.loading(
        isEditing ? "Actualizando negocio..." : "Creando negocio..."
      );

      const formDataToSend = new FormData();

      // Limpieza y agregado de datos
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("phoneNumber", formData.phoneNumber.trim());
      formDataToSend.append("address", formData.address.trim());
      formDataToSend.append("website", formData.website.trim());
      formDataToSend.append("industry", formData.industry.trim());

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

      if (!isEditing) {
        setFormData(initialFormData);
      } else {
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
  }, [
    formData,
    isEditing,
    validateForm,
    authToken,
    setFormData,
    setErrors,
    fetchBusinessData,
  ]);

  return {
    isLoading,
    isDataFetched,
    handleSubmit,
    fetchBusinessData,
  };
}

// Componente de campo de entrada memoizado con soporte para animaciones y mejor feedback
const FormInput = memo(
  ({
    icon: Icon,
    name,
    placeholder,
    value = "", // Valor por defecto para asegurar que nunca sea undefined
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
      <div className="relative flex flex-col space-y-1">
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
            value={value || ""} // Asegurar que nunca sea undefined
            onChange={onChange}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${name}-error` : undefined}
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
            transition-all duration-200 hover:border-primary-50/50 dark:hover:border-primary-50/30
            placeholder:text-light-text-tertiary/70 dark:placeholder:text-dark-text-tertiary/70`}
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
              id={`${name}-error`}
              initial={{ opacity: 0, height: 0, y: -5 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-error-light flex items-start"
            >
              <FiAlertCircle className="mr-1 flex-shrink-0 mt-0.5" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

// Componente para visualizar el logo actual con soporte para zoom y eliminación
const LogoPreview = ({
  logo,
  onRemove,
}: {
  logo: string;
  onRemove: () => void;
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Verificar que logo no sea undefined
  if (!logo) return null;

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-light-bg-input dark:bg-dark-bg-input border-primary-50/20">
      <div className="w-full flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary flex items-center">
          <FiImage className="mr-1.5 text-primary-50" /> Logo actual
        </p>
        <button
          onClick={onRemove}
          aria-label="Eliminar logo"
          className="text-light-text-tertiary hover:text-error-light dark:text-dark-text-tertiary dark:hover:text-error-light
                    transition-colors duration-200 p-1 rounded-full hover:bg-error-light/10"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        <motion.div
          className="relative w-32 h-32 rounded-lg border-2 border-primary-50/30 overflow-hidden shadow-md cursor-pointer"
          onClick={() => setIsZoomed(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Image
            src={logo}
            alt="Logo del negocio"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.png";
            }}
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
            <FiImage className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200 h-6 w-6" />
          </div>
        </motion.div>

        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-2xl max-h-[80vh] rounded-lg overflow-hidden"
              >
                <Image
                  src={logo}
                  alt="Logo del negocio"
                  width={500}
                  height={500}
                  className="object-contain max-h-[80vh]"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.png";
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(false);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Componente para cargar logo con vista previa
const LogoUploader = ({
  logo,
  onChange,
  error,
}: {
  logo: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!logo) {
      setPreview(null);
      return;
    }

    if (logo instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(logo);
    }
  }, [logo]);

  return (
    <div className="relative w-full md:col-span-1">
      <label
        className={`flex flex-col items-center justify-center gap-2 p-6 w-full border-2 border-dashed rounded-lg cursor-pointer
        ${
          preview ? "border-primary-50/50" : "border-primary-50/30"
        } dark:border-dark-border-medium
        bg-light-bg-input dark:bg-dark-bg-input
        text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
        focus-within:ring-2 focus-within:ring-primary-50/50 focus-within:border-transparent
        transition-all duration-200 relative`}
      >
        {preview ? (
          <div className="relative w-full h-32 mb-2">
            <Image
              src={preview}
              alt="Vista previa del logo"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <>
            <FiUpload className="text-primary-50 text-2xl" />
            <span className="text-sm md:text-base font-medium flex items-center gap-1">
              <FiImage className="text-primary-50" /> Subir logo
            </span>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              PNG, JPG (max. 2MB)
            </p>
          </>
        )}

        <input
          type="file"
          name="logo"
          accept="image/png, image/jpeg"
          onChange={onChange}
          className="hidden"
        />
      </label>

      <AnimatePresence>
        {logo instanceof File && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 flex items-center justify-center text-xs text-light-text-secondary dark:text-dark-text-secondary bg-success/10 py-1.5 px-3 rounded-md"
          >
            <FiCheck className="text-success mr-1.5" />
            {logo.name}
          </motion.div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 text-xs text-error-light flex items-center justify-center bg-error-light/10 py-1.5 px-3 rounded-md"
          >
            <FiAlertCircle className="mr-1.5" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente principal optimizado
export default function BussinessData() {
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    isEditing,
    setIsEditing,
    handleChange,
    handleFileChange,
    validateForm,
  } = useBusinessForm();

  const { isLoading, isDataFetched, handleSubmit } = useBusinessApi(
    formData,
    setFormData,
    setErrors,
    validateForm,
    isEditing,
    setIsEditing
  );

  // Función para eliminar el logo actual
  const handleRemoveLogo = useCallback(() => {
    setFormData((prev) => ({ ...prev, logo: null }));
  }, [setFormData]);

  // Estado para seguimiento de progreso de llenado del formulario
  const formProgress = useMemo(() => {
    const requiredFields = ["name", "email", "phoneNumber"];
    const filledFields = requiredFields.filter((field) =>
      formData[field as keyof BusinessData]?.toString().trim()
    );
    return (filledFields.length / requiredFields.length) * 100;
  }, [formData]);

  // Renderizado condicional para el loader
  if (!isDataFetched && !isEditing) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <FiLoader className="h-8 w-8 text-primary-50" />
        </motion.div>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary animate-pulse">
          Cargando datos del negocio...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-0"
    >
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-sm p-3 sm:p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 sm:mb-6 md:mb-8">
          <div className="p-2.5 sm:p-3.5 bg-primary-50/10 rounded-lg mb-3 sm:mb-4 md:mb-0 w-fit">
            <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-50" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              {isEditing ? "Editar Negocio" : "Crear Nuevo Negocio"}
            </h2>
            <p className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
              {isEditing
                ? "Edita los datos del negocio."
                : "Ingresa los datos del nuevo negocio."}
            </p>
          </div>

          {/* Indicador de progreso del formulario */}
          <div className="md:ml-auto mt-3 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
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

        {/* Secciones en pestañas */}
        <div className="border-b border-light-border-medium dark:border-dark-border-medium mb-6">
          <nav className="flex space-x-4">
            <button className="px-3 py-2 border-b-2 border-primary-50 text-primary-50 font-medium text-sm">
              Información General
            </button>
          </nav>
        </div>

        <div className="space-y-5 sm:space-y-6 md:space-y-8">
          {/* Información principal */}
          <div className="p-4 border border-light-border-medium dark:border-dark-border-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary">
            <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
              Información de contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {/* Nombre del negocio */}
              <FormInput
                icon={FiUser}
                name="name"
                placeholder="Nombre del negocio"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required={true}
              />

              {/* Email */}
              <FormInput
                icon={FiMail}
                name="email"
                placeholder="Correo del negocio"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                type="email"
                required={true}
                helpText="Utilizaremos este correo para comunicaciones importantes."
              />

              {/* Teléfono */}
              <FormInput
                icon={FiPhone}
                name="phoneNumber"
                placeholder="Teléfono"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                type="tel"
                required={true}
                helpText="Formato: 10 dígitos (Ej. 1234567890)"
              />

              {/* Dirección */}
              <FormInput
                icon={FiMapPin}
                name="address"
                placeholder="Dirección"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="p-4 border border-light-border-medium dark:border-dark-border-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary">
            <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
              Información adicional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {/* Sitio Web */}
              <FormInput
                icon={FiGlobe}
                name="website"
                placeholder="Sitio web"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
                helpText="Incluye http:// o https:// al inicio"
              />

              {/* Industria */}
              <FormInput
                icon={FiTag}
                name="industry"
                placeholder="Industria"
                value={formData.industry}
                onChange={handleChange}
                error={errors.industry}
              />
            </div>
          </div>

          {/* Sección de logotipo */}
          <div className="p-4 border border-light-border-medium dark:border-dark-border-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary">
            <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
              Logotipo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo uploader */}
              <LogoUploader
                logo={formData.logo instanceof File ? formData.logo : null}
                onChange={handleFileChange}
                error={errors.logo}
              />

              {/* Visualización del logo actual */}
              {typeof formData.logo === "string" && formData.logo && (
                <LogoPreview logo={formData.logo} onRemove={handleRemoveLogo} />
              )}
            </div>
          </div>

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
            className="w-full px-6 py-3.5 mt-6 rounded-lg bg-gradient-to-r from-primary-50 to-primary-600 text-white font-medium 
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
                <FiCheck className="h-5 w-5 mr-1" />
                <span>
                  {isEditing ? "Actualizar Negocio" : "Crear Negocio"}
                </span>
              </>
            )}
          </motion.button>

          {/* Mensaje de ayuda */}
          <div className="text-center mt-4">
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              Los campos marcados con{" "}
              <span className="text-error-light">*</span> son obligatorios
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
