import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { FaPlus, FaUserTag, FaSpinner } from "react-icons/fa";
import { showToast } from "@/utils/toast";

interface RoleFormProps {
  newRole: string;
  setNewRole: (role: string) => void;
  handleAddRole: () => void;
}

const RoleForm = ({ newRole, setNewRole, handleAddRole }: RoleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validar y manejar la adición de rol
  const validateAndAddRole = async () => {
    const trimmedRole = newRole.trim();

    if (trimmedRole === "") {
      setError("El nombre del rol no puede estar vacío");
      showToast.error("El nombre del rol no puede estar vacío");
      return;
    }

    if (trimmedRole.length > 30) {
      setError("El nombre del rol no puede exceder 30 caracteres");
      showToast.error("El nombre del rol no puede exceder 30 caracteres");
      return;
    }

    // Validar caracteres especiales no permitidos
    const invalidCharsRegex = /[<>{}[\]\\\/|:;=+*?#@&%^$!~`"']/;
    if (invalidCharsRegex.test(trimmedRole)) {
      setError("El nombre contiene caracteres no permitidos");
      showToast.error("El nombre contiene caracteres no permitidos");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await handleAddRole();
      setNewRole(""); // Limpiar el campo después de añadir exitosamente
      // Enfocar el input después de añadir un rol
      if (inputRef.current) {
        inputRef.current.focus();
      }
      showToast.success(`Rol "${trimmedRole}" añadido correctamente`);
    } catch (error: any) {
      console.error("Error al añadir rol:", error);
      setError(error.message || "Error al añadir el rol. Intente nuevamente.");
      showToast.error(
        error.message || "Error al añadir el rol. Intente nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar el envío con la tecla Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      validateAndAddRole();
    }
  };

  // Limpiar error cuando el usuario empieza a escribir
  useEffect(() => {
    if (error && newRole !== "") {
      setError(null);
    }
  }, [newRole, error]);

  return (
    <div className="mb-6">
      <h3 className="font-semibold border-b border-light-border-light dark:border-dark-border-light pb-2 mb-3 flex items-center">
        <FaUserTag className="mr-2 text-primary-50" />
        Crear un nuevo rol
      </h3>

      <div className="space-y-2 mt-2">
        <label htmlFor="roleName" className="text-sm font-medium block">
          Nombre del rol
        </label>

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              id="roleName"
              ref={inputRef}
              type="text"
              className={`p-2 rounded w-full bg-light-bg-input dark:bg-dark-bg-input 
                text-light-text-primary dark:text-white border 
                ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-light-border-medium dark:border-dark-border-medium focus:ring-blue-500"
                } 
                focus:outline-none focus:ring-2 transition-all`}
              placeholder="Ej: Ventas, Marketing, Soporte"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "role-error" : "role-help"}
              maxLength={30}
              autoComplete="off"
            />
            {error ? (
              <p id="role-error" className="text-red-500 text-xs mt-1">
                {error}
              </p>
            ) : (
              <p
                id="role-help"
                className="text-xs text-gray-500 dark:text-gray-400 mt-1"
              >
                Use un nombre descriptivo sin caracteres especiales
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {newRole.length}/30 caracteres
            </p>
          </div>

          <button
            onClick={validateAndAddRole}
            className={`${
              isSubmitting
                ? "bg-blue-400 dark:bg-blue-600 cursor-not-allowed opacity-80"
                : "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 active:scale-[0.98]"
            } px-4 h-[42px] self-start rounded-md text-white flex items-center justify-center min-w-[110px] 
            transition-all duration-200 ease-in-out shadow-sm hover:shadow 
            font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            aria-label="Añadir nuevo rol"
            type="button"
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin mr-2 text-sm" />
            ) : (
              <FaPlus className="mr-2 text-sm" />
            )}
            <span>{isSubmitting ? "Añadiendo..." : "Añadir"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleForm;
