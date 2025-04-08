import {
  FaTachometerAlt,
  FaRegCheckSquare,
  FaEdit,
  FaTrashAlt,
  FaChartBar,
  FaFolderOpen,
  FaAddressBook,
  FaUserPlus,
  FaUserMinus,
  FaCalendarAlt,
  FaCalendarPlus,
  FaCalendarMinus,
  FaUserFriends,
  FaUserShield,
  FaUsers,
  FaComments,
  FaWhatsapp,
  FaEnvelope,
  FaCreditCard,
  FaHistory,
  FaRobot,
  FaCogs,
  FaEye,
  FaPlus,
  FaFileAlt,
  FaArrowRight,
  FaPencilAlt,
  FaTimes,
  FaCheck,
  FaPhone,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface PermissionIconProps {
  permission: string;
  className?: string;
}

const PermissionIcon = ({
  permission,
  className = "",
}: PermissionIconProps) => {
  const iconMap: Record<string, IconType> = {
    // Dashboard
    dashboard: FaTachometerAlt,

    // Prospectos
    crear_prospectos: FaPlus,
    ver_prospectos: FaEye,
    editar_prospectos: FaPencilAlt,
    eliminar_prospectos: FaTimes,

    // Clientes
    ver_clientes: FaUserFriends,
    crear_clientes: FaUserPlus,
    editar_clientes: FaEdit,
    eliminar_clientes: FaUserMinus,

    // Mensajería
    enviar_mensajeria_whatsapp: FaWhatsapp,
    enviar_mensajeria_email: FaEnvelope,

    // Tareas
    ver_tareas: FaEye,
    asignar_tareas: FaArrowRight,
    marcar_tarea_como_completada: FaCheck,

    // Pasarela de pagos
    gestionar_pasarela_pagos: FaCreditCard,
    ver_pasarela_pagos: FaEye,
    ver_historial_de_pagos: FaHistory,

    // Automatizaciones
    configurar_automatizaciones: FaCogs,
    ver_automatizaciones: FaEye,
    ejecutar_automatizacion: FaRobot,
    modificar_automatizaciones: FaEdit,
    borrar_automatizaciones: FaTrashAlt,

    // Reportes
    ver_reportes: FaFileAlt,
    generar_reportes: FaChartBar,

    // Integraciones
    gestionar_integracion_whatsapp: FaWhatsapp,
    gestionar_integracion_email: FaEnvelope,
  };

  const Icon = iconMap[permission] || FaCogs;

  // Color por categoría
  const colorMap: Record<string, string> = {
    dashboard: "text-blue-500",
    crear_prospectos: "text-green-500",
    ver_prospectos: "text-blue-400",
    editar_prospectos: "text-yellow-500",
    eliminar_prospectos: "text-red-500",
    ver_clientes: "text-purple-500",
    crear_clientes: "text-green-500",
    editar_clientes: "text-yellow-500",
    eliminar_clientes: "text-red-500",
    enviar_mensajeria_whatsapp: "text-green-600",
    enviar_mensajeria_email: "text-blue-600",
    ver_tareas: "text-blue-400",
    asignar_tareas: "text-purple-500",
    marcar_tarea_como_completada: "text-green-500",
    gestionar_pasarela_pagos: "text-indigo-500",
    ver_pasarela_pagos: "text-blue-500",
    ver_historial_de_pagos: "text-gray-600",
    configurar_automatizaciones: "text-orange-500",
    ver_automatizaciones: "text-blue-400",
    ejecutar_automatizacion: "text-green-600",
    modificar_automatizaciones: "text-yellow-500",
    borrar_automatizaciones: "text-red-500",
    ver_reportes: "text-blue-500",
    generar_reportes: "text-purple-500",
    gestionar_integracion_whatsapp: "text-green-600",
    gestionar_integracion_email: "text-blue-600",
  };

  const colorClass = colorMap[permission] || "text-gray-500";

  return <Icon className={`${colorClass} ${className}`} />;
};

export default PermissionIcon;
