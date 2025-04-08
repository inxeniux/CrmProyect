"use client";
import { useEffect, useState } from "react";
import { FaUsersCog } from "react-icons/fa";
import { showToast } from "@/utils/toast";

// Importar componentes nuevos
import RoleForm from "./roles/RoleForm";
import PermissionsSection from "./roles/PermissionsSection";
import RolesList from "./roles/RolesList";
import DeleteConfirmModal from "./roles/DeleteConfirmModal";
import { Role } from "./roles/types";

const RolesTab = () => {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "Administradores", permissions: ["Todos los permisos"] },
    {
      id: 2,
      name: "Cobranza",
      permissions: ["Acceder a reportes", "Generar reportes"],
    },
  ]);
  const [newRole, setNewRole] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );
  const [viewingRole, setViewingRole] = useState<string | null>(null);

  // Estado de permisos
  const [permissions, setPermissions] = useState({
    dashboard: false,
    crear_prospectos: false,
    ver_prospectos: false,
    editar_prospectos: false,
    ver_clientes: false,
    crear_clientes: false,
    editar_clientes: false,
    eliminar_clientes: false,
    enviar_mensajeria_whatsapp: false,
    enviar_mensajeria_email: false,
    ver_tareas: false,
    asignar_tareas: false,
    marcar_tarea_como_completada: false,
    gestionar_pasarela_pagos: false,
    ver_pasarela_pagos: false,
    configurar_automatizaciones: false,
    ver_automatizaciones: false,
    ejecutar_automatizacion: false,
    modificar_automatizaciones: false,
    borrar_automatizaciones: false,
    ver_reportes: false,
    generar_reportes: false,
    ver_historial_de_pagos: false,
    gestionar_integracion_whatsapp: false,
    gestionar_integracion_email: false,
  });

  const fetchPermissions = async () => {
    try {
      const response = await fetch("/api/createroles", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los roles");
      }

      const data = await response.json();

      // Definir interfaces para la estructura de la respuesta de la API
      interface Permission {
        name: string;
      }

      interface RolePermission {
        permissions: Permission;
      }

      interface RoleData {
        id: number;
        name: string;
        role_permissions: RolePermission[];
      }

      // Formatear los datos con tipado adecuado
      const formattedRoles: Role[] = (data as RoleData[]).map(
        (role: RoleData) => ({
          id: role.id,
          name: role.name,
          permissions: role.role_permissions.map(
            (permission) => permission.permissions.name
          ),
        })
      );

      setRoles(formattedRoles);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleAddRole = async () => {
    if (newRole.trim() !== "") {
      // Convertir los permisos activos a un array
      const activePermissions = Object.entries(permissions)
        .filter(([, isActive]) => isActive)
        .map(([name]) => {
          const permissionLabels = {
            dashboard: "Acceder al dashboard",
            crear_prospectos: "Crear prospectos",
            ver_prospectos: "Ver prospectos",
            editar_prospectos: "Editar prospectos",
            ver_clientes: "Ver clientes",
            crear_clientes: "Crear clientes",
            editar_clientes: "Editar clientes",
            eliminar_clientes: "Eliminar clientes",
            enviar_mensajeria_whatsapp: "Enviar whatsapp",
            enviar_mensajeria_email: "Enviar email",
            ver_tareas: "Ver tareas",
            asignar_tareas: "Asignar tareas",
            marcar_tarea_como_completada: "Tarea como completada",
            gestionar_pasarela_pagos: "Gestion pasarela",
            ver_pasarela_pagos: "Ver pagos",
            configurar_automatizaciones: "Automatizaiones",
            ver_automatizaciones: "Ver automataciones",
            ejecutar_automatizacion: "Ejecutar automatizaciones",
            modificar_automatizaciones: "Editar automatizacion",
            borrar_automatizaciones: "Borrar automatizacion",
            ver_reportes: "Gestión de usuarios",
            generar_reportes: "Gestión de usuarios",
            ver_historial_de_pagos: "Historial de pagos",
            gestionar_integracion_whatsapp: "Integracion con whatsapp",
            gestionar_integracion_email: "Gestión de email",
          };
          return permissionLabels[name as keyof typeof permissionLabels];
        });

      const permissionList = [
        { id: 1, name: "ver_prospectos" },
        { id: 2, name: "crear_prospectos" },
        { id: 3, name: "editar_prospectos" },
        { id: 4, name: "eliminar_prospectos" },
        { id: 5, name: "ver_clientes" },
        { id: 6, name: "crear_clientes" },
        { id: 7, name: "editar_clientes" },
        { id: 8, name: "eliminar_clientes" },
        { id: 9, name: "enviar_mensajeria_whatsapp" },
        { id: 10, name: "enviar_mensajeria_email" },
        { id: 11, name: "ver_tareas" },
        { id: 12, name: "asignar_tareas" },
        { id: 13, name: "marcar_tarea_como_completada" },
        { id: 14, name: "gestionar_pasarela_pagos" },
        { id: 15, name: "ver_pasarela_pagos" },
        { id: 16, name: "configurar_automatizaciones" },
        { id: 17, name: "ver_automatizaciones" },
        { id: 18, name: "ejecutar_automatizacion" },
        { id: 19, name: "modificar_automatizaciones" },
        { id: 20, name: "borrar_automatizaciones" },
        { id: 21, name: "ver_reportes" },
        { id: 22, name: "generar_reportes" },
        { id: 23, name: "ver_historial_de_pagos" },
        { id: 24, name: "gestionar_integracion_whatsapp" },
        { id: 25, name: "gestionar_integracion_email" },
      ];

      // Filtrar los permisos activos y obtener sus IDs
      const activePermissionIds = permissionList
        .filter(({ name }) => permissions[name as keyof typeof permissions])
        .map(({ id }) => id);

      try {
        const response = await fetch("/api/createroles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newRole,
            permissions: activePermissionIds,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al crear el rol");
        }
        await response.json();

        fetchPermissions();
        setNewRole("");
      } catch (error) {
        console.error("Error al enviar los datos:", error);
        showToast.error("Error al crear el rol");
      }
      setRoles([
        ...roles,
        {
          id: roles.length + 1,
          name: newRole,
          permissions: activePermissions.length > 0 ? activePermissions : [],
        },
      ]);
      setNewRole("");
    }
  };

  const handlePermissionChange = (permission: string) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission as keyof typeof permissions],
    });
  };

  const handleRemoveRole = (roleId: number) => {
    const roleToDelete = roles.find((r) => r.id === roleId);

    setRoles(roles.filter((role) => role.id !== roleId));
    setShowDeleteConfirm(null);

    showToast.success(
      `El rol "${roleToDelete?.name}" ha sido eliminado correctamente.`
    );
  };

  const toggleRoleDetails = (roleName: string) => {
    if (viewingRole === roleName) {
      setViewingRole(null);
    } else {
      setViewingRole(roleName);
    }
  };

  const handleShowDeleteConfirm = (roleId: number) => {
    setShowDeleteConfirm(roleId);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-white rounded-lg">
      <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
        <FaUsersCog className="mr-2 text-primary-50" />
        Configuración de Roles y Usuarios
      </h2>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Card izquierda */}
        <div className="w-full lg:w-1/2 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-3 sm:p-4 shadow-md">
          {/* Componente de formulario de rol */}
          <RoleForm
            newRole={newRole}
            setNewRole={setNewRole}
            handleAddRole={handleAddRole}
          />

          {/* Componente de sección de permisos */}
          <PermissionsSection
            permissions={permissions}
            handlePermissionChange={handlePermissionChange}
          />
        </div>

        {/* Card derecha */}
        <div className="w-full lg:w-1/2 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-3 sm:p-4 shadow-md">
          {/* Componente de lista de roles */}
          <RolesList
            roles={roles}
            viewingRole={viewingRole}
            toggleRoleDetails={toggleRoleDetails}
            onDeleteRole={handleShowDeleteConfirm}
          />
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm !== null && (
        <DeleteConfirmModal
          roleName={roles.find((r) => r.id === showDeleteConfirm)?.name || ""}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => handleRemoveRole(showDeleteConfirm)}
        />
      )}
    </div>
  );
};

export default RolesTab;
