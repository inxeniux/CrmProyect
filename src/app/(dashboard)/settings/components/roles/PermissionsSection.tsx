import React, { useState, ReactElement } from "react";
import {
  FaCheck,
  FaLock,
  FaTachometerAlt,
  FaTasks,
  FaAddressBook,
  FaCalendarAlt,
  FaUsers,
  FaRegCheckSquare,
  FaEdit,
  FaTrashAlt,
  FaFolderOpen,
  FaUserPlus,
  FaUserMinus,
  FaCalendarPlus,
  FaCalendarMinus,
  FaUserFriends,
  FaUserShield,
  FaChartBar,
  FaWhatsapp,
  FaEnvelope,
  FaMoneyBillWave,
  FaHistory,
  FaRobot,
  FaCog,
  FaPlay,
  FaUserCog,
} from "react-icons/fa";

interface Permission {
  key: string;
  label: string;
  icon: ReactElement;
}

interface PermissionCategory {
  name: string;
  icon: ReactElement;
  permissions: string[];
}

interface PermissionsSectionProps {
  permissions: Record<string, boolean>;
  handlePermissionChange: (permission: string) => void;
}

const PermissionsSection = ({
  permissions,
  handlePermissionChange,
}: PermissionsSectionProps) => {
  const [activeTab, setActiveTab] = useState("general");

  const permissionIcons: Record<string, ReactElement> = {
    dashboard: <FaTachometerAlt className="text-blue-500" />,
    crear_prospectos: <FaUserPlus className="text-green-500" />,
    ver_prospectos: <FaUserFriends className="text-blue-500" />,
    editar_prospectos: <FaEdit className="text-yellow-500" />,
    ver_clientes: <FaUsers className="text-blue-500" />,
    crear_clientes: <FaUserPlus className="text-green-500" />,
    editar_clientes: <FaEdit className="text-yellow-500" />,
    eliminar_clientes: <FaTrashAlt className="text-red-500" />,
    enviar_mensajeria_whatsapp: <FaWhatsapp className="text-green-500" />,
    enviar_mensajeria_email: <FaEnvelope className="text-blue-500" />,
    ver_tareas: <FaTasks className="text-indigo-500" />,
    asignar_tareas: <FaRegCheckSquare className="text-green-500" />,
    marcar_tarea_como_completada: <FaCheck className="text-green-500" />,
    gestionar_pasarela_pagos: <FaMoneyBillWave className="text-green-500" />,
    ver_pasarela_pagos: <FaMoneyBillWave className="text-blue-500" />,
    configurar_automatizaciones: <FaCog className="text-purple-500" />,
    ver_automatizaciones: <FaRobot className="text-blue-500" />,
    ejecutar_automatizacion: <FaPlay className="text-green-500" />,
    modificar_automatizaciones: <FaEdit className="text-yellow-500" />,
    borrar_automatizaciones: <FaTrashAlt className="text-red-500" />,
    ver_reportes: <FaChartBar className="text-purple-500" />,
    generar_reportes: <FaFolderOpen className="text-indigo-500" />,
    ver_historial_de_pagos: <FaHistory className="text-indigo-500" />,
    gestionar_integracion_whatsapp: <FaWhatsapp className="text-green-500" />,
    gestionar_integracion_email: <FaEnvelope className="text-blue-500" />,
  };

  const permissionLabels: Record<string, string> = {
    dashboard: "Acceder al dashboard",
    crear_prospectos: "Crear prospectos",
    ver_prospectos: "Ver prospectos",
    editar_prospectos: "Editar prospectos",
    ver_clientes: "Ver clientes",
    crear_clientes: "Crear clientes",
    editar_clientes: "Editar clientes",
    eliminar_clientes: "Eliminar clientes",
    enviar_mensajeria_whatsapp: "Enviar WhatsApp",
    enviar_mensajeria_email: "Enviar email",
    ver_tareas: "Ver tareas",
    asignar_tareas: "Asignar tareas",
    marcar_tarea_como_completada: "Marcar tarea como completada",
    gestionar_pasarela_pagos: "Gestionar pasarela de pagos",
    ver_pasarela_pagos: "Ver pagos",
    configurar_automatizaciones: "Configurar automatizaciones",
    ver_automatizaciones: "Ver automatizaciones",
    ejecutar_automatizacion: "Ejecutar automatizaciones",
    modificar_automatizaciones: "Modificar automatizaciones",
    borrar_automatizaciones: "Borrar automatizaciones",
    ver_reportes: "Ver reportes",
    generar_reportes: "Generar reportes",
    ver_historial_de_pagos: "Ver historial de pagos",
    gestionar_integracion_whatsapp: "Gestionar integración WhatsApp",
    gestionar_integracion_email: "Gestionar integración email",
  };

  const categories: Record<string, PermissionCategory> = {
    general: {
      name: "General",
      icon: <FaTachometerAlt />,
      permissions: ["dashboard"],
    },
    tasks: {
      name: "Tareas",
      icon: <FaTasks className="text-yellow-500" />,
      permissions: [
        "ver_tareas",
        "asignar_tareas",
        "marcar_tarea_como_completada",
      ],
    },
    directory: {
      name: "Directorio",
      icon: <FaAddressBook className="text-green-600" />,
      permissions: [
        "ver_clientes",
        "crear_clientes",
        "editar_clientes",
        "eliminar_clientes",
      ],
    },
    prospects: {
      name: "Prospectos",
      icon: <FaUserFriends className="text-blue-600" />,
      permissions: ["crear_prospectos", "ver_prospectos", "editar_prospectos"],
    },
    messages: {
      name: "Mensajes",
      icon: <FaEnvelope className="text-indigo-500" />,
      permissions: ["enviar_mensajeria_whatsapp", "enviar_mensajeria_email"],
    },
    pay: {
      name: "Pasarelas",
      icon: <FaMoneyBillWave className="text-green-700" />,
      permissions: [
        "gestionar_pasarela_pagos",
        "ver_pasarela_pagos",
        "ver_historial_de_pagos",
      ],
    },
    automatization: {
      name: "Automatización",
      icon: <FaRobot className="text-purple-600" />,
      permissions: [
        "configurar_automatizaciones",
        "ver_automatizaciones",
        "ejecutar_automatizacion",
        "modificar_automatizaciones",
        "borrar_automatizaciones",
      ],
    },
    report: {
      name: "Reportes",
      icon: <FaChartBar className="text-blue-700" />,
      permissions: ["ver_reportes", "generar_reportes"],
    },
    integrations: {
      name: "Integraciones",
      icon: <FaCog className="text-gray-700" />,
      permissions: [
        "gestionar_integracion_whatsapp",
        "gestionar_integracion_email",
      ],
    },
  };

  // Verifica si todos los permisos de una categoría están activos
  const areAllPermissionsActive = (category: string): boolean => {
    if (!categories[category]) return false;

    return categories[category].permissions.every(
      (permission) => permissions[permission]
    );
  };

  // Verifica si algunos permisos de una categoría están activos
  const areSomePermissionsActive = (category: string): boolean => {
    if (!categories[category]) return false;

    return categories[category].permissions.some(
      (permission) => permissions[permission]
    );
  };

  const renderPermissionItem = (perm: string) => {
    const icon = permissionIcons[perm] || <FaLock className="text-gray-500" />;
    const label = permissionLabels[perm] || perm;

    return (
      <div
        key={perm}
        className="flex items-center justify-between p-2 rounded-md hover:bg-light-bg-input dark:hover:bg-dark-bg-input transition-colors duration-150"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-light-text-primary dark:text-white">
            {label}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={Boolean(permissions[perm])}
            onChange={() => handlePermissionChange(perm)}
            aria-label={`Permiso para ${label}`}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold border-b border-light-border-light dark:border-dark-border-light pb-2 mb-3 flex items-center">
        <FaLock className="mr-2 text-primary-50" />
        Permisos
      </h3>

      {/* Tabs para categorías */}
      <div className="flex flex-wrap gap-1 mb-3 border-b border-light-border-light dark:border-dark-border-light">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-2 flex items-center gap-2 rounded-t-lg transition-all ${
              activeTab === key
                ? "bg-primary-600 text-white font-medium"
                : "hover:bg-light-bg-input dark:hover:bg-dark-bg-input"
            }`}
            aria-pressed={activeTab === key}
            aria-label={`Categoría de permisos: ${category.name}`}
          >
            {category.icon}
            <span>{category.name}</span>
            {areSomePermissionsActive(key) && (
              <span
                className={`w-2 h-2 rounded-full ${
                  areAllPermissionsActive(key)
                    ? "bg-green-500"
                    : "bg-yellow-400"
                }`}
              ></span>
            )}
          </button>
        ))}
      </div>

      <div className="h-[280px] overflow-y-auto pr-2 space-y-1">
        {/* Toggle All de categoría */}
        {activeTab && categories[activeTab] && (
          <div className="mb-2">
            <div className="flex items-center p-2 bg-light-bg-input dark:bg-dark-bg-input rounded-md mb-2">
              <div className="flex items-center gap-2 font-medium">
                <FaCheck className="text-green-500" />
                <span>Permisos disponibles</span>
              </div>
            </div>

            {/* Lista de permisos para la categoría seleccionada */}
            <div className="bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-light dark:border-dark-border-light rounded-md divide-y divide-light-border-light dark:divide-dark-border-light">
              {categories[activeTab].permissions.map((perm) =>
                renderPermissionItem(perm)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsSection;
