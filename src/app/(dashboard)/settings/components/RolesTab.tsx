import { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaUserPlus,
  FaUsersCog,
  FaUserTag,
  FaClipboardList,
  FaPaperPlane,
  FaSave,
  FaLock,
  FaTasks,
  FaChartBar,
  FaAddressBook,
  FaCalendarAlt,
  FaUsers,
  FaTachometerAlt,
  FaRegCheckSquare,
  FaEdit,
  FaTrashAlt,
  FaFolderOpen,
  FaUserPlus as FaAddUser,
  FaUserMinus,
  FaCalendarPlus,
  FaCalendarMinus,
  FaUserFriends,
  FaUserShield,
  FaCheck,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaTimes,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";

const RolesTab = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: "Administradores", permissions: ["Todos los permisos"] },
    {
      id: 2,
      name: "Cobranza",
      permissions: ["Acceder a reportes", "Generar reportes"],
    },
  ]);
  const [newRole, setNewRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("Administradores");
  const [invitedUsers, setInvitedUsers] = useState([
    {
      email: "emilia.flores@niux.com",
      role: "Administradores",
      status: "Activo",
    },
    {
      email: "emilio.guzman@niux.com",
      role: "Administradores",
      status: "Pendiente",
    },
    { email: "roberto.arcos@niux.com", role: "Cobranza", status: "Activo" },
  ]);
  const [email, setEmail] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );
  const [messageVisible, setMessageVisible] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [viewingRole, setViewingRole] = useState<string | null>(null);

  // Nuevos permisos disponibles
  const [permissions, setPermissions] = useState({
    dashboard: true,
    createTasks: false,
    editTasks: false,
    deleteTasks: false,
    accessReports: false,
    generateReports: false,
    accessDirectory: false,
    addContacts: false,
    deleteContacts: false,
    accessCalendar: false,
    createEvents: false,
    deleteEvents: false,
    accessUsersList: false,
    manageUserRoles: false,
    manageUsers: false,
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleAddRole = () => {
    if (newRole.trim() !== "") {
      // Convertir los permisos activos a un array
      const activePermissions = Object.entries(permissions)
        .filter(([, isActive]) => isActive)
        .map(([name]) => {
          const permissionLabels = {
            dashboard: "Acceder al dashboard",
            createTasks: "Crear tareas",
            editTasks: "Editar tareas",
            deleteTasks: "Eliminar tareas",
            accessReports: "Acceder a reportes",
            generateReports: "Generar reportes",
            accessDirectory: "Acceder al directorio",
            addContacts: "Agregar contactos",
            deleteContacts: "Eliminar contactos",
            accessCalendar: "Acceder al calendario",
            createEvents: "Crear eventos de calendario",
            deleteEvents: "Eliminar eventos de calendario",
            accessUsersList: "Acceder a la lista de usuarios",
            manageUserRoles: "Gestión de roles de usuario",
            manageUsers: "Gestión de usuarios",
          };
          return permissionLabels[name as keyof typeof permissionLabels];
        });

      setRoles([
        ...roles,
        {
          id: roles.length + 1,
          name: newRole,
          permissions: activePermissions.length > 0 ? activePermissions : [],
        },
      ]);
      setNewRole("");

      // Resetear permisos
      setPermissions({
        dashboard: true,
        createTasks: false,
        editTasks: false,
        deleteTasks: false,
        accessReports: false,
        generateReports: false,
        accessDirectory: false,
        addContacts: false,
        deleteContacts: false,
        accessCalendar: false,
        createEvents: false,
        deleteEvents: false,
        accessUsersList: false,
        manageUserRoles: false,
        manageUsers: false,
      });
    }
  };

  const handleInviteUser = () => {
    if (email.trim() !== "") {
      // Verificar si el correo ya existe
      if (invitedUsers.some((user) => user.email === email.trim())) {
        setMessage({
          text: "Este correo ya ha sido invitado anteriormente.",
          type: "error",
        });
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 5000);
        return;
      }

      setInvitedUsers([
        ...invitedUsers,
        { email, role: selectedRole, status: "Pendiente" },
      ]);
      setEmail("");

      setMessage({
        text: "Invitación enviada correctamente.",
        type: "success",
      });
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 3000);
    }
  };

  const handlePermissionChange = (permission: keyof typeof permissions) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission],
    });
  };

  // Función para seleccionar/deseleccionar todos los permisos de una categoría
  const toggleCategoryPermissions = (category: string, value: boolean) => {
    const categoryPermissions: Record<string, string[]> = {
      general: ["dashboard"],
      tasks: ["createTasks", "editTasks", "deleteTasks"],
      reports: ["accessReports", "generateReports"],
      directory: ["accessDirectory", "addContacts", "deleteContacts"],
      calendar: ["accessCalendar", "createEvents", "deleteEvents"],
      users: ["accessUsersList", "manageUserRoles", "manageUsers"],
    };

    const permKeys = categoryPermissions[category];
    const newPermissions = { ...permissions };

    permKeys.forEach((key) => {
      newPermissions[key as keyof typeof permissions] = value;
    });

    setPermissions(newPermissions);
  };

  const handleRemoveRole = (roleId: number) => {
    const roleToDelete = roles.find((r) => r.id === roleId);

    // Verificar si hay usuarios con este rol
    const usersWithRole = invitedUsers.filter(
      (user) => user.role === roleToDelete?.name
    );

    if (usersWithRole.length > 0) {
      setMessage({
        text: `No se puede eliminar el rol "${roleToDelete?.name}" porque tiene usuarios asignados.`,
        type: "error",
      });
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 5000);
      return;
    }

    setRoles(roles.filter((role) => role.id !== roleId));
    setShowDeleteConfirm(null);

    setMessage({
      text: `El rol "${roleToDelete?.name}" ha sido eliminado correctamente.`,
      type: "success",
    });
    setMessageVisible(true);
    setTimeout(() => setMessageVisible(false), 3000);
  };

  const handleRemoveUser = (userEmail: string) => {
    setInvitedUsers(invitedUsers.filter((user) => user.email !== userEmail));

    setMessage({
      text: "Usuario eliminado correctamente.",
      type: "success",
    });
    setMessageVisible(true);
    setTimeout(() => setMessageVisible(false), 3000);
  };

  const filteredUsers = invitedUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  const toggleRoleDetails = (roleName: string) => {
    if (viewingRole === roleName) {
      setViewingRole(null);
    } else {
      setViewingRole(roleName);
    }
  };

  const handleSaveChanges = () => {
    // Simulando guardado
    setMessage({
      text: "Cambios guardados correctamente.",
      type: "success",
    });
    setMessageVisible(true);
    setTimeout(() => setMessageVisible(false), 3000);
  };

  // Reemplaza la antigua sección de permisos con esta nueva implementación
  const renderPermissionSection = () => {
    const permissionIcons = {
      dashboard: <FaTachometerAlt className="text-blue-500" />,
      createTasks: <FaRegCheckSquare className="text-green-500" />,
      editTasks: <FaEdit className="text-yellow-500" />,
      deleteTasks: <FaTrashAlt className="text-red-500" />,
      accessReports: <FaChartBar className="text-purple-500" />,
      generateReports: <FaFolderOpen className="text-indigo-500" />,
      accessDirectory: <FaAddressBook className="text-green-500" />,
      addContacts: <FaAddUser className="text-blue-500" />,
      deleteContacts: <FaUserMinus className="text-red-500" />,
      accessCalendar: <FaCalendarAlt className="text-orange-500" />,
      createEvents: <FaCalendarPlus className="text-green-500" />,
      deleteEvents: <FaCalendarMinus className="text-red-500" />,
      accessUsersList: <FaUserFriends className="text-blue-500" />,
      manageUserRoles: <FaUserShield className="text-purple-500" />,
      manageUsers: <FaUsers className="text-indigo-500" />,
    };

    const permissionLabels = {
      dashboard: "Acceder al dashboard",
      createTasks: "Crear tareas",
      editTasks: "Editar tareas",
      deleteTasks: "Eliminar tareas",
      accessReports: "Acceder a reportes",
      generateReports: "Generar reportes",
      accessDirectory: "Acceder al directorio",
      addContacts: "Agregar contactos",
      deleteContacts: "Eliminar contactos",
      accessCalendar: "Acceder al calendario",
      createEvents: "Crear eventos de calendario",
      deleteEvents: "Eliminar eventos de calendario",
      accessUsersList: "Acceder a la lista de usuarios",
      manageUserRoles: "Gestión de roles de usuario",
      manageUsers: "Gestión de usuarios",
    };

    const categories = {
      general: {
        name: "General",
        icon: <FaTachometerAlt />,
        permissions: ["dashboard"],
      },
      tasks: {
        name: "Tareas",
        icon: <FaTasks />,
        permissions: ["createTasks", "editTasks", "deleteTasks"],
      },
      reports: {
        name: "Reportes",
        icon: <FaChartBar />,
        permissions: ["accessReports", "generateReports"],
      },
      directory: {
        name: "Directorio",
        icon: <FaAddressBook />,
        permissions: ["accessDirectory", "addContacts", "deleteContacts"],
      },
      calendar: {
        name: "Calendario",
        icon: <FaCalendarAlt />,
        permissions: ["accessCalendar", "createEvents", "deleteEvents"],
      },
      users: {
        name: "Usuarios",
        icon: <FaUsers />,
        permissions: ["accessUsersList", "manageUserRoles", "manageUsers"],
      },
    };

    const renderPermissionItem = (perm: string) => {
      const key = perm as keyof typeof permissions;
      const icon = permissionIcons[key as keyof typeof permissionIcons];
      const label = permissionLabels[key as keyof typeof permissionLabels];

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
              checked={permissions[key]}
              onChange={() => handlePermissionChange(key)}
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
              className={`px-3 py-2 flex items-center gap-1 rounded-t-lg transition-all ${
                activeTab === key
                  ? "bg-primary-600 text-white font-medium"
                  : "hover:bg-light-bg-input dark:hover:bg-dark-bg-input"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className="h-[280px] overflow-y-auto pr-2 space-y-1">
          {/* Toggle All de categoría */}
          {activeTab && (
            <div className="mb-2">
              <div className="flex items-center justify-between p-2 bg-light-bg-input dark:bg-dark-bg-input rounded-md mb-2">
                <div className="flex items-center gap-2 font-medium">
                  <FaCheck className="text-green-500" />
                  <span>Seleccionar todos</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleCategoryPermissions(activeTab, true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => toggleCategoryPermissions(activeTab, false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Ninguno
                  </button>
                </div>
              </div>

              {/* Lista de permisos para la categoría seleccionada */}
              <div className="bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-light dark:border-dark-border-light rounded-md divide-y divide-light-border-light dark:divide-dark-border-light">
                {categories[
                  activeTab as keyof typeof categories
                ].permissions.map((perm) => renderPermissionItem(perm))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente para mostrar los mensajes
  const MessageAlert = () => {
    if (!messageVisible) return null;

    return (
      <div
        className={`fixed top-5 right-5 p-3 rounded-md shadow-lg flex items-center gap-2 transition-all ${
          message.type === "success"
            ? "bg-green-100 text-green-800 border-l-4 border-green-500"
            : "bg-red-100 text-red-800 border-l-4 border-red-500"
        }`}
      >
        {message.type === "success" ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <FaExclamationTriangle className="text-red-500" />
        )}
        <span>{message.text}</span>
        <button
          onClick={() => setMessageVisible(false)}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaUsersCog className="mr-2 text-primary-50" />
        Configuración de Roles y Usuarios
      </h2>

      {/* Mensaje de alerta */}
      <MessageAlert />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Card izquierda */}
        <div className="flex-1 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-4 shadow-md">
          <div className="mb-6">
            <h3 className="font-semibold border-b border-light-border-light dark:border-dark-border-light pb-2 mb-3 flex items-center">
              <FaUserTag className="mr-2 text-primary-50" />
              Crear un nuevo rol
            </h3>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                className="p-2 rounded bg-light-bg-input dark:bg-dark-bg-input text-light-text-primary dark:text-white border border-light-border-medium dark:border-dark-border-medium flex-1"
                placeholder="Nombre del rol"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
              <button
                onClick={handleAddRole}
                className="bg-blue-600 px-4 py-2 rounded text-white flex items-center"
              >
                <FaPlus className="mr-2" /> Añadir
              </button>
            </div>
          </div>

          {/* Nueva sección de permisos mejorada */}
          {renderPermissionSection()}

          <div className="mb-6">
            <h3 className="font-semibold border-b border-light-border-light dark:border-dark-border-light pb-2 mb-3 flex items-center">
              <FaClipboardList className="mr-2 text-primary-50" />
              Usuarios invitados
            </h3>

            {/* Buscador de usuarios */}
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="p-2 pl-10 w-full rounded bg-light-bg-input dark:bg-dark-bg-input text-light-text-primary dark:text-white border border-light-border-medium dark:border-dark-border-medium"
                placeholder="Buscar por correo o rol..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>

            <div className="max-h-64 overflow-auto rounded-md border border-light-border-medium dark:border-dark-border-medium">
              <table className="w-full">
                <thead className="sticky top-0">
                  <tr className="bg-light-bg-input dark:bg-dark-bg-input text-light-text-secondary dark:text-gray-300">
                    <th className="p-2 text-left">Correo</th>
                    <th className="p-2 text-left">Rol</th>
                    <th className="p-2 text-center">Estado</th>
                    <th className="p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border-light dark:divide-dark-border-light">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={index}
                        className="border-t border-light-border-light dark:border-dark-border-light hover:bg-light-bg-input dark:hover:bg-dark-bg-input transition-colors"
                      >
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100 rounded-full text-xs">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.status === "Activo"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleRemoveUser(user.email)}
                            className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
                            title="Eliminar usuario"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500">
                        No se encontraron usuarios con la búsqueda actual
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white text-lg flex items-center justify-center mx-auto transition-colors"
            >
              <FaSave className="mr-2" />
              Guardar y continuar
            </button>
          </div>
        </div>

        {/* Card derecha */}
        <div className="flex-1 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-4 shadow-md">
          <div className="mb-6">
            <h3 className="font-semibold border-b border-light-border-light dark:border-dark-border-light pb-2 mb-3 flex items-center">
              <FaUsersCog className="mr-2 text-primary-50" />
              Roles disponibles
            </h3>

            <div className="mb-4">
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="border border-light-border-medium dark:border-dark-border-medium rounded-lg overflow-hidden"
                  >
                    <div
                      className={`p-2 flex justify-between items-center cursor-pointer ${
                        role.name === "Administradores"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                          : "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
                      }`}
                      onClick={() => toggleRoleDetails(role.name)}
                    >
                      <div className="flex items-center gap-2">
                        <FaUserTag className="text-current" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRoleDetails(role.name);
                          }}
                          className="p-1 hover:bg-white/20 rounded-full"
                          title="Ver permisos"
                        >
                          <FaEye />
                        </button>
                        {role.name !== "Administradores" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(role.id);
                            }}
                            className="p-1 hover:bg-white/20 rounded-full text-red-600 dark:text-red-300"
                            title="Eliminar rol"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Modal confirmación eliminar */}
                    {showDeleteConfirm === role.id && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg max-w-md mx-4">
                          <h3 className="text-xl font-bold mb-4 flex items-center text-light-text-primary dark:text-white">
                            <FaExclamationTriangle className="text-yellow-500 mr-2" />
                            Confirmar eliminación
                          </h3>
                          <p className="mb-6 text-light-text-primary dark:text-white">
                            ¿Estás seguro que deseas eliminar el rol{" "}
                            <strong>{role.name}</strong>? Esta acción no se
                            puede deshacer.
                          </p>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-light-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleRemoveRole(role.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            >
                              Sí, eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detalles del rol */}
                    {viewingRole === role.name && (
                      <div className="p-2 bg-light-bg-input dark:bg-dark-bg-input">
                        <h4 className="font-medium mb-1 text-sm text-light-text-secondary dark:text-gray-300">
                          Permisos:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((perm, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold border-b border-light-border-light dark:border-dark-border-light pb-2 mb-3 flex items-center">
              <FaUserPlus className="mr-2 text-primary-50" />
              Invitar usuarios
            </h3>
            <div className="bg-light-bg-primary dark:bg-dark-bg-primary p-3 rounded-lg border border-light-border-light dark:border-dark-border-light">
              <div className="flex flex-col gap-3 mt-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="p-2 pl-10 rounded bg-light-bg-input dark:bg-dark-bg-input text-light-text-primary dark:text-white border border-light-border-medium dark:border-dark-border-medium w-full"
                    placeholder="Correo del usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaUserTag className="text-gray-400" />
                    </div>
                    <select
                      className="p-2 pl-10 rounded bg-light-bg-input dark:bg-dark-bg-input text-light-text-primary dark:text-white border border-light-border-medium dark:border-dark-border-medium w-full appearance-none"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleInviteUser}
                    disabled={!email.trim()}
                    className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white whitespace-nowrap flex items-center transition-colors ${
                      !email.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaPaperPlane className="mr-2" />
                    Enviar invitación
                  </button>
                </div>
              </div>
              <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-2">
                Se enviará una invitación al correo electrónico proporcionado
                con instrucciones para acceder al sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesTab;
