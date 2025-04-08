import {
  FaEye,
  FaTrash,
  FaUsersCog,
  FaUserTag,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

interface RolesListProps {
  roles: Role[];
  viewingRole: string | null;
  toggleRoleDetails: (roleName: string) => void;
  onDeleteRole: (roleId: number) => void;
}

// Componente para mostrar un permiso individual con animación y mejor visualización
const PermissionBadge = ({ permission }: { permission: string }) => {
  // Determinar el color según el tipo de permiso
  const getPermissionStyle = () => {
    if (permission.includes("crear") || permission.includes("añadir"))
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (permission.includes("eliminar") || permission.includes("borrar"))
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    if (permission.includes("editar") || permission.includes("modificar"))
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    if (permission.includes("ver") || permission.includes("leer"))
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getPermissionStyle()}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.15 }}
    >
      <FaShieldAlt className="mr-1 text-xs" />
      {permission}
    </motion.span>
  );
};

// Componente para el botón de acción
const ActionButton = ({
  onClick,
  title,
  icon,
  className = "",
}: {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  icon: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`p-1 hover:bg-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 ${className}`}
    title={title}
    aria-label={title}
  >
    {icon}
  </button>
);

const RoleCard = ({
  role,
  isViewing,
  toggleRoleDetails,
  onDeleteRole,
}: {
  role: Role;
  isViewing: boolean;
  toggleRoleDetails: (roleName: string) => void;
  onDeleteRole: (roleId: number) => void;
}) => {
  const isAdmin = role.name === "Administradores";
  const contentRef = useRef<HTMLDivElement>(null);

  // Agrupar permisos por categorías para mejor organización
  const categorizePermissions = () => {
    const categories: Record<string, string[]> = {
      Usuarios: [],
      Clientes: [],
      Proyectos: [],
      Reportes: [],
      Configuración: [],
      Otros: [],
    };

    role.permissions.forEach((perm) => {
      if (perm.toLowerCase().includes("usuario"))
        categories["Usuarios"].push(perm);
      else if (perm.toLowerCase().includes("cliente"))
        categories["Clientes"].push(perm);
      else if (perm.toLowerCase().includes("proyecto"))
        categories["Proyectos"].push(perm);
      else if (
        perm.toLowerCase().includes("reporte") ||
        perm.toLowerCase().includes("informe")
      )
        categories["Reportes"].push(perm);
      else if (
        perm.toLowerCase().includes("config") ||
        perm.toLowerCase().includes("ajuste")
      )
        categories["Configuración"].push(perm);
      else categories["Otros"].push(perm);
    });

    return Object.entries(categories).filter(([_, perms]) => perms.length > 0);
  };

  const cardVariants = {
    expanded: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    collapsed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className="border border-light-border-medium dark:border-dark-border-medium rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ transition: "all 0.2s ease" }}
    >
      <div
        className={`p-3 flex justify-between items-center cursor-pointer transition-colors duration-200 ${
          isAdmin
            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
            : "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
        }`}
        onClick={() => toggleRoleDetails(role.name)}
        role="button"
        aria-expanded={isViewing}
        aria-controls={`role-details-${role.id}`}
      >
        <div className="flex items-center gap-2">
          <FaUserTag className="text-current" />
          <span className="font-medium">{role.name}</span>
          <span className="text-xs opacity-70">
            ({role.permissions.length} permisos)
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isViewing ? (
            <FaChevronUp className="text-sm transition-transform duration-200" />
          ) : (
            <FaChevronDown className="text-sm transition-transform duration-200" />
          )}
          {!isAdmin && (
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRole(role.id);
              }}
              title="Eliminar rol"
              icon={<FaTrash />}
              className="text-red-600 dark:text-red-300 ml-2"
            />
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isViewing && (
          <motion.div
            key={`content-${role.id}`}
            variants={cardVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="bg-light-bg-input dark:bg-dark-bg-input overflow-hidden"
          >
            <div ref={contentRef} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm text-light-text-secondary dark:text-gray-300 flex items-center">
                  <FaShieldAlt className="mr-2 text-primary-50" />
                  Permisos del rol
                </h4>
                <div className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                  Total: {role.permissions.length}
                </div>
              </div>

              <AnimatePresence>
                {role.permissions.length > 0 ? (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {categorizePermissions().map(([category, perms], index) => (
                      <motion.div
                        key={category}
                        className="border-t border-gray-200 dark:border-gray-700 pt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                      >
                        <h5 className="text-xs uppercase font-semibold mb-2 text-gray-500 dark:text-gray-400">
                          {category} ({perms.length})
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {perms.map((perm, idx) => (
                            <PermissionBadge key={idx} permission={perm} />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <FaTimes className="mx-auto text-red-500 mb-2" size={20} />
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Este rol no tiene permisos asignados.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {isAdmin && (
                <motion.div
                  className="mt-3 text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <FaCheck className="inline-block mr-1" />
                  Los administradores tienen acceso completo al sistema.
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RolesList = ({
  roles,
  viewingRole,
  toggleRoleDetails,
  onDeleteRole,
}: RolesListProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="font-semibold border-b border-light-border-light dark:border-dark-border-light pb-2 mb-3 flex items-center">
        <FaUsersCog className="mr-2 text-primary-50" />
        Roles disponibles
      </h3>

      {roles.length > 0 ? (
        <motion.div
          className="mt-3 grid grid-cols-1 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isViewing={viewingRole === role.name}
              toggleRoleDetails={toggleRoleDetails}
              onDeleteRole={onDeleteRole}
            />
          ))}
        </motion.div>
      ) : (
        <div className="p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-gray-500 dark:text-gray-400">
            No hay roles disponibles en este momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default RolesList;
