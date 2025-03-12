"use client";

import { useState, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/utils/toast";
import Cookies from "js-cookie";
import { RiLockPasswordFill } from "react-icons/ri";
import { FiLoader, FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";
import {
  validateFormPassword,
  ValidationErrorsPassword,
} from "@/validations/userValidations";

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

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

export default function PasswordForm() {
  const [formDataPassword, setFormDataPassword] = useState<PasswordFormData>({
    password: "",
    confirmPassword: "",
  });

  const [errorsPassword, setErrorsPassword] =
    useState<ValidationErrorsPassword>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSavePassword = async () => {
    const validationErrors = validateFormPassword(formDataPassword);
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );

    if (hasErrors) {
      setErrorsPassword(validationErrors);
      showToast.error("Por favor, completa todos los campos correctamente");
      return;
    }

    setIsLoading(true);
    const loadingToast = showToast.loading("Guardando cambios...");

    try {
      const authToken = Cookies.get("auth_token");
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          password: formDataPassword.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar usuario");
      }

      showToast.updateLoading(
        loadingToast,
        "Contraseña actualizada exitosamente",
        "success"
      );
    } catch {
      showToast.updateLoading(loadingToast, "error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataPassword((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorsPassword[name as keyof ValidationErrorsPassword]) {
      setErrorsPassword((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Calcular progreso del formulario
  const formProgress = useMemo(() => {
    const fields = ["password", "confirmPassword"];
    const filledFields = fields.filter((field) =>
      formDataPassword[field as keyof PasswordFormData]?.trim()
    );
    return (filledFields.length / fields.length) * 100;
  }, [formDataPassword]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-sm p-3 sm:p-4 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 sm:mb-6 md:mb-8">
        <div className="p-2.5 sm:p-3.5 bg-primary-50/10 rounded-lg mb-3 sm:mb-4 md:mb-0 w-fit">
          <RiLockPasswordFill className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-50" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Actualizar Contraseña
          </h2>
          <p className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Puedes cambiar la contraseña de tu usuario
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
            Nueva contraseña
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
            <FormInput
              icon={RiLockPasswordFill}
              name="password"
              placeholder="Contraseña"
              value={formDataPassword.password}
              onChange={handleChangePassword}
              error={errorsPassword.password}
              type="password"
              required={true}
              helpText="Mínimo 8 caracteres, una mayúscula, una minúscula y un número"
            />

            <FormInput
              icon={RiLockPasswordFill}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formDataPassword.confirmPassword}
              onChange={handleChangePassword}
              error={errorsPassword.confirmPassword}
              type="password"
              required={true}
              helpText="Debe coincidir con la contraseña ingresada"
            />
          </div>
        </div>

        {/* Botón Actualizar */}
        <motion.button
          onClick={handleSavePassword}
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
              <span>Actualizando contraseña...</span>
            </>
          ) : (
            <>
              <FiCheck className="h-5 w-5" />
              <span>Actualizar contraseña</span>
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
