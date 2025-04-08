"use client";

import Image from "next/image";
import { useTheme } from "@/providers/ThemeProvider";
import { MdOutlineLightMode } from "react-icons/md";
import { FiEyeOff } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";
import { showToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface InputState {
  email: string;
  password: string;
}

interface FocusState {
  email: boolean;
  password: boolean;
}

interface Errors {
  email?: string;
  password?: string;
}

const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

export default function LoginForm() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState<FocusState>({
    email: false,
    password: false,
  });
  const [inputValues, setInputValues] = useState<InputState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setInputValues((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleFocus = useCallback((field: keyof FocusState): void => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleBlur = useCallback((field: keyof FocusState): void => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  }, []);

  const handleChange = useCallback(
    (field: keyof InputState, value: string): void => {
      setInputValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  const toggleRememberMe = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Errors = {};
    const { email, password } = inputValues;

    if (!password.trim()) {
      newErrors.password = "Este campo es obligatorio";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!email.trim()) {
      newErrors.email = "Este campo es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Correo electrónico no válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [inputValues]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const loadingToast = showToast.loading("Iniciando sesión...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputValues.email,
          password: inputValues.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error en la respuesta del servidor"
        );
      }

      const data = await response.json();

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", inputValues.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      showToast.updateLoading(
        loadingToast,
        "Inicio de sesión exitoso!",
        "success"
      );

      if (data.token) {
        setCookies({
          auth_token: data.token,
          businessId: data.user.businessId,
          role: data.user.role,
        });

        router.push("/funnels");
      } else {
        showToast.updateLoading(
          loadingToast,
          "No se recibió un token.",
          "error"
        );
      }
    } catch (error) {
      showToast.updateLoading(
        loadingToast,
        error instanceof Error ? error.message : "Error al iniciar sesión",
        "error"
      );
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCookies = (cookies: Record<string, string>) => {
    Object.entries(cookies).forEach(([key, value]) => {
      document.cookie = `${key}=${value}; path=/; secure; samesite=strict`;
    });
  };

  const InputField = ({
    type,
    field,
    placeholder,
  }: {
    type: string;
    field: keyof InputState;
    placeholder: string;
  }) => (
    <div className="relative group">
      <input
        type={
          field === "password"
            ? isPasswordVisible
              ? "text"
              : "password"
            : type
        }
        value={inputValues[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        onFocus={() => handleFocus(field as keyof FocusState)}
        onBlur={() => handleBlur(field as keyof FocusState)}
        className={`w-full px-4 py-3.5 rounded-lg border-2
          bg-transparent
          dark:text-white text-gray-900
          ${
            errors[field]
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
          }
          focus:border-primary-50 dark:focus:border-primary-50 outline-none
          transition-all duration-200`}
        aria-invalid={!!errors[field]}
        disabled={isLoading}
      />
      <label
        className={`absolute left-3 text-sm transition-all duration-200 pointer-events-none
          ${
            isFocused[field as keyof FocusState] || inputValues[field]
              ? "-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1"
              : "top-3.5"
          }
          ${
            isFocused[field as keyof FocusState]
              ? "text-primary-50"
              : "text-gray-500 dark:text-gray-400"
          }
          ${errors[field] ? "text-red-500" : ""}`}
      >
        {placeholder}
      </label>

      {field === "password" && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-3.5 text-gray-500 hover:text-primary-50
              dark:hover:text-primary-50 transition-colors"
          aria-label={
            isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
          }
          disabled={isLoading}
        >
          {isPasswordVisible ? (
            <FiEyeOff className="w-5 h-5" />
          ) : (
            <BsEye className="w-5 h-5" />
          )}
        </motion.button>
      )}

      {errors[field] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-1 flex items-center"
        >
          <span className="mr-1">⚠️</span> {errors[field]}
        </motion.p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-1/2 h-[200px] lg:h-screen relative order-1 lg:order-2 dark:bg-dark-bg-primary bg-light-bg-primary p-4 lg:p-6"
      >
        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/images/hero.png"
            alt="Login illustration"
            fill
            className="object-cover transform hover:scale-105 transition-all duration-700"
            priority
          />
        </div>
      </motion.div>

      <motion.div
        {...fadeInAnimation}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:w-1/2 flex items-end lg:items-center justify-center p-6 dark:bg-dark-bg-primary bg-light-bg-primary order-2 lg:order-1 flex-1"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center mb-8 relative"
          >
            <Image
              src={
                theme === "light" ? "/images/niux.png" : "/images/niuxdark.png"
              }
              alt="Niux Logo"
              width={100}
              height={40}
              className="hover:opacity-80 transition-opacity"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-50 dark:bg-primary-50 shadow-md hover:shadow-lg transition-shadow"
              aria-label="Cambiar tema"
            >
              <MdOutlineLightMode className="text-md dark:text-white text-gray-800" />
            </motion.button>
          </motion.div>

          <motion.h2
            {...fadeInAnimation}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-3xl font-bold mb-2 dark:text-white text-gray-900 tracking-tight"
          >
            Bienvenido de nuevo
          </motion.h2>
          <motion.p
            {...fadeInAnimation}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-sm mb-8 dark:text-dark-text-secondary text-light-text-secondary"
          >
            Inicie sesión para acceder a su cuenta de niux
          </motion.p>

          <motion.form
            {...fadeInAnimation}
            transition={{ delay: 0.5, duration: 0.3 }}
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div className="relative group">
              <input
                type="email"
                value={inputValues.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3.5 rounded-lg border-2
                  bg-transparent
                  dark:text-white text-gray-900
                  ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                  }
                  focus:border-primary-50 dark:focus:border-primary-50 outline-none
                  transition-all duration-200`}
                aria-invalid={!!errors.email}
                disabled={isLoading}
              />
              <label
                className={`absolute left-3 text-sm transition-all duration-200 pointer-events-none
                  ${
                    isFocused.email || inputValues.email
                      ? "-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1"
                      : "top-3.5"
                  }
                  ${
                    isFocused.email
                      ? "text-primary-50"
                      : "text-gray-500 dark:text-gray-400"
                  }
                  ${errors.email ? "text-red-500" : ""}`}
              >
                Email
              </label>

              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-1 flex items-center"
                >
                  <span className="mr-1">⚠️</span> {errors.email}
                </motion.p>
              )}
            </div>

            <div className="relative group">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={inputValues.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                className={`w-full px-4 py-3.5 rounded-lg border-2
                  bg-transparent
                  dark:text-white text-gray-900
                  ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                  }
                  focus:border-primary-50 dark:focus:border-primary-50 outline-none
                  transition-all duration-200`}
                aria-invalid={!!errors.password}
                disabled={isLoading}
              />
              <label
                className={`absolute left-3 text-sm transition-all duration-200 pointer-events-none
                  ${
                    isFocused.password || inputValues.password
                      ? "-top-2 text-xs bg-white dark:bg-dark-bg-primary px-1"
                      : "top-3.5"
                  }
                  ${
                    isFocused.password
                      ? "text-primary-50"
                      : "text-gray-500 dark:text-gray-400"
                  }
                  ${errors.password ? "text-red-500" : ""}`}
              >
                Contraseña
              </label>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-primary-50
                    dark:hover:text-primary-50 transition-colors"
                aria-label={
                  isPasswordVisible
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                disabled={isLoading}
              >
                {isPasswordVisible ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <BsEye className="w-5 h-5" />
                )}
              </motion.button>

              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-1 flex items-center"
                >
                  <span className="mr-1">⚠️</span> {errors.password}
                </motion.p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm mt-4">
              <label className="flex items-center cursor-pointer group">
                <div className="relative w-4 h-4 mr-2 flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="absolute opacity-0 w-0 h-0 peer"
                    checked={rememberMe}
                    onChange={toggleRememberMe}
                    disabled={isLoading}
                  />
                  <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-600 rounded-sm peer-checked:border-primary-50 peer-checked:bg-primary-50 transition-all"></div>
                  {rememberMe && (
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  )}
                </div>
                <span className="dark:text-dark-text-tertiary text-light-text-tertiary group-hover:text-primary-50 transition-colors">
                  Recuérdame
                </span>
              </label>
              <Link
                href="/auth/recover"
                className="text-primary-50 hover:text-primary-600 hover:underline transition-all"
              >
                ¿No recuerdas tu contraseña?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full bg-primary-50 text-white py-3.5 rounded-lg font-medium 
                  hover:bg-primary-600 active:bg-primary-700 shadow-md hover:shadow-lg
                  transition-all duration-200 mt-6 flex items-center justify-center
                  ${isLoading ? "opacity-90" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Iniciando
                  sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </motion.button>
          </motion.form>

          <motion.p
            {...fadeInAnimation}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="mt-8 text-center dark:text-dark-text-tertiary text-light-text-tertiary"
          >
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-primary-50 hover:text-primary-600 font-medium hover:underline transition-all"
            >
              Regístrate ahora
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
