"use client";

import { useState, useCallback, useMemo, memo } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiUserPlus,
  FiUserCheck,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiLock,
  FiBriefcase,
  FiLoader,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { validateForm, ValidationErrors } from "@/validations/userValidations";
import { showToast } from "@/utils/toast";
import Cookies from "js-cookie";

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

// Custom Hook para manejar el formulario de creación de usuarios
const useUserCreationForm = (onUserCreated?: () => void) => {
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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    },
    [formSubmitted, errors]
  );

  const handleSave = useCallback(async () => {
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
      if (onUserCreated) onUserCreated();
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
  }, [formData, validateFormData, resetForm, onUserCreated]);

  return {
    formData,
    errors,
    isLoading,
    formSubmitted,
    handleChange,
    handleSave,
    resetForm,
    setFormSubmitted,
  };
};

// Componente optimizado para campos de formulario
const FormInput = memo(
  ({
    type = "text",
    name,
    label,
    placeholder,
    value,
    onChange,
    icon: Icon,
    disabled,
    error,
    formSubmitted,
    required = false,
    helpText,
    ariaLabel,
  }: {
    type?: string;
    name: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ElementType;
    disabled: boolean;
    error?: string;
    formSubmitted: boolean;
    required?: boolean;
    helpText?: string;
    ariaLabel?: string;
  }) => {
    const showError = formSubmitted && error;

    return (
      <div className="flex flex-col space-y-1">
        <label
          htmlFor={name}
          className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary flex items-center"
        >
          {label}
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
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={showError ? `${name}-error` : undefined}
            aria-label={ariaLabel || label}
            className={`pl-10 w-full rounded-lg text-sm md:text-base py-2.5 md:py-3
                     bg-light-bg-input dark:bg-dark-bg-input 
                     border ${
                       showError
                         ? "border-error-light dark:border-error-dark"
                         : value
                         ? "border-success/50 dark:border-success/30"
                         : "border-light-border-medium dark:border-dark-border-medium"
                     }
                     text-light-text-primary dark:text-dark-text-primary
                     focus:ring-2 focus:ring-primary-50 focus:border-transparent
                     transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                     hover:border-primary-50/50 dark:hover:border-primary-50/30
                     placeholder:text-light-text-tertiary/70 dark:placeholder:text-dark-text-tertiary/70`}
          />
          {value && !showError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
              <FiCheck className="h-4 w-4" />
            </div>
          )}
        </div>
        <AnimatePresence>
          {showError && (
            <motion.p
              id={`${name}-error`}
              initial={{ opacity: 0, height: 0, y: -5 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-error-light flex items-center"
            >
              <FiAlertCircle className="mr-1 flex-shrink-0" /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

// Componente de selector de rol mejorado
const RoleSelector = memo(
  ({
    value,
    onChange,
    disabled,
    error,
    formSubmitted,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled: boolean;
    error?: string;
    formSubmitted: boolean;
  }) => {
    const roles = [
      {
        id: "Admin",
        label: "Admin",
        description: "Acceso completo al sistema",
      },
      {
        id: "Manager",
        label: "Manager",
        description: "Administración de equipos y proyectos",
      },
      {
        id: "Sales",
        label: "Sales",
        description: "Gestión de ventas y clientes",
      },
      {
        id: "Support",
        label: "Support",
        description: "Soporte técnico y atención al cliente",
      },
      {
        id: "Customer",
        label: "Customer",
        description: "Usuario cliente con acceso limitado",
      },
    ];

    const showError = formSubmitted && error;

    return (
      <div className="flex flex-col space-y-1">
        <label
          htmlFor="roleUser"
          className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary flex items-center"
        >
          Rol del Usuario <span className="text-error-light ml-1">*</span>
          <div className="group relative ml-1.5">
            <FiInfo className="h-3.5 w-3.5 text-light-text-tertiary dark:text-dark-text-tertiary cursor-help" />
            <div
              className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                        absolute z-10 -left-2 bottom-full mb-2 px-3 py-2 text-xs rounded-md shadow-lg
                        bg-light-bg-tooltip dark:bg-dark-bg-tooltip text-light-text-primary dark:text-dark-text-primary
                        w-48 break-words"
            >
              Define el nivel de acceso del usuario en el sistema
            </div>
          </div>
        </label>
        <div className="relative">
          <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
            <FiBriefcase className="h-4 w-4 md:h-5 md:w-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
          </div>
          <select
            id="roleUser"
            name="roleUser"
            value={value}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={showError ? "roleUser-error" : undefined}
            className={`pl-10 w-full rounded-lg text-sm md:text-base py-2.5 md:py-3
                     appearance-none bg-light-bg-input dark:bg-dark-bg-input 
                     border ${
                       showError
                         ? "border-error-light dark:border-error-dark"
                         : value
                         ? "border-success/50 dark:border-success/30"
                         : "border-light-border-medium dark:border-dark-border-medium"
                     }
                     text-light-text-primary dark:text-dark-text-primary
                     focus:ring-2 focus:ring-primary-50 focus:border-transparent
                     transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                     hover:border-primary-50/50 dark:hover:border-primary-50/30
                     pr-10`}
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="h-4 w-4 text-light-text-tertiary dark:text-dark-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <AnimatePresence>
          {showError && (
            <motion.p
              id="roleUser-error"
              initial={{ opacity: 0, height: 0, y: -5 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-error-light flex items-center"
            >
              <FiAlertCircle className="mr-1 flex-shrink-0" /> {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Role cards for visual selection */}
        {value && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 bg-primary-50/10 dark:bg-primary-50/5 p-3 rounded-md border border-primary-50/20"
          >
            <div className="flex items-center gap-2">
              <div className="bg-primary-50 rounded-full p-1.5">
                <FiUserCheck className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-primary-50">
                  {value}
                </div>
                <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {roles.find((r) => r.id === value)?.description ||
                    "Acceso personalizado al sistema"}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }
);
RoleSelector.displayName = "RoleSelector";

// Componente para el progreso de llenado del formulario
const FormProgress = ({ formData }: { formData: BusinessFormData }) => {
  const requiredFields = [
    "email",
    "firstName",
    "lastName",
    "phoneNumber",
    "roleUser",
  ];
  const filledFields = requiredFields.filter((field) =>
    formData[field as keyof BusinessFormData]?.toString().trim()
  );

  const progress = (filledFields.length / requiredFields.length) * 100;

  return (
    <div className="flex items-center gap-2 md:ml-auto mt-3 md:mt-0">
      <div className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
        Progreso
      </div>
      <div className="h-2.5 w-24 bg-light-bg-input dark:bg-dark-bg-input rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary-50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="text-xs font-medium text-primary-50">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

// Botón de acción principal mejorado con animaciones
const ActionButton = memo(
  ({
    onClick,
    isLoading,
    children,
  }: {
    onClick: () => void;
    isLoading: boolean;
    children: React.ReactNode;
  }) => (
    <motion.button
      type="button"
      onClick={onClick}
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
          <FiLoader className="animate-spin h-5 w-5 mr-2" />
          <span>Creando usuario...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  )
);
ActionButton.displayName = "ActionButton";

export default function UserCreationForm({
  onUserCreated,
}: {
  onUserCreated?: () => void;
}) {
  const {
    formData,
    errors,
    isLoading,
    formSubmitted,
    handleChange,
    handleSave,
  } = useUserCreationForm(onUserCreated);

  // Agrupar íconos para evitar recreaciones
  const Icons = useMemo(
    () => ({
      User: FiUser,
      Email: FiMail,
      Phone: FiPhone,
      Lock: FiLock,
      UserPlus: FiUserPlus,
    }),
    []
  );

  // Animación para los elementos
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerAnimation}
      className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-md p-3 sm:p-4 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="p-2.5 sm:p-3.5 bg-primary-50/10 rounded-lg mb-3 sm:mb-4 md:mb-0 w-fit">
            <FiUserPlus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-50" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Crear Nuevo Usuario
            </h2>
            <p className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
              Ingresa los datos del nuevo usuario para el negocio
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <FormProgress formData={formData} />
      </div>

      <div className="p-4 border border-light-border-medium dark:border-dark-border-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary mb-6">
        <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-5">
          Información personal
        </h3>

        <motion.div
          variants={containerAnimation}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6"
        >
          {/* Email Field */}
          <motion.div variants={itemAnimation}>
            <FormInput
              type="email"
              name="email"
              label="Correo electrónico"
              placeholder="Ingresa el correo electrónico"
              value={formData.email}
              onChange={handleChange}
              icon={Icons.Email}
              disabled={isLoading}
              error={errors.email}
              formSubmitted={formSubmitted}
              required={true}
              helpText="Se enviará una invitación a este correo"
            />
          </motion.div>

          {/* Nombre Field */}
          <motion.div variants={itemAnimation}>
            <FormInput
              name="firstName"
              label="Nombre"
              placeholder="Ingresa el nombre"
              value={formData.firstName}
              onChange={handleChange}
              icon={Icons.User}
              disabled={isLoading}
              error={errors.firstName}
              formSubmitted={formSubmitted}
              required={true}
            />
          </motion.div>

          {/* Apellido Field */}
          <motion.div variants={itemAnimation}>
            <FormInput
              name="lastName"
              label="Apellido"
              placeholder="Ingresa el apellido"
              value={formData.lastName}
              onChange={handleChange}
              icon={Icons.User}
              disabled={isLoading}
              error={errors.lastName}
              formSubmitted={formSubmitted}
              required={true}
            />
          </motion.div>

          {/* Phone Field */}
          <motion.div variants={itemAnimation}>
            <FormInput
              type="tel"
              name="phoneNumber"
              label="Teléfono"
              placeholder="10 dígitos (Ej. 1234567890)"
              value={formData.phoneNumber}
              onChange={handleChange}
              icon={Icons.Phone}
              disabled={isLoading}
              error={errors.phoneNumber}
              formSubmitted={formSubmitted}
              required={true}
              helpText="Formato: 10 dígitos sin espacios"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="p-4 border border-light-border-medium dark:border-dark-border-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary">
        <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-5">
          Permisos y accesos
        </h3>

        {/* Role Field */}
        <motion.div variants={itemAnimation}>
          <RoleSelector
            value={formData.roleUser}
            onChange={handleChange}
            disabled={isLoading}
            error={errors.roleUser}
            formSubmitted={formSubmitted}
          />
        </motion.div>
      </div>

      {/* Información de invitación */}
      <motion.div
        variants={itemAnimation}
        className="mt-5 p-3 rounded-md bg-primary-50/10 border border-primary-50/20 text-xs text-light-text-secondary dark:text-dark-text-secondary flex items-start"
      >
        <FiInfo className="min-w-[16px] h-4 text-primary-50 mt-0.5 mr-2" />
        <p>
          Al crear un usuario, se enviará una invitación al correo electrónico
          proporcionado. El usuario deberá establecer su contraseña al aceptar
          la invitación.
        </p>
      </motion.div>

      {/* Submit Button */}
      <ActionButton onClick={handleSave} isLoading={isLoading}>
        <FiUserPlus className="h-5 w-5 mr-2" />
        <span>Crear Usuario</span>
      </ActionButton>

      {/* Mensaje de campos obligatorios */}
      <div className="text-center mt-4">
        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
          Los campos marcados con <span className="text-error-light">*</span>{" "}
          son obligatorios
        </p>
      </div>
    </motion.div>
  );
}
