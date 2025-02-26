export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "El correo es requerido";
  if (!regex.test(email))
    return "Formato inválido. Ejemplo: usuario@dominio.com";
  return "";
};

export const validateName = (name: string, field: "nombre" | "apellido") => {
  if (!name) return `El ${field} es requerido`;
  if (name.length < 2) return `El ${field} debe tener al menos 2 caracteres`;
  return "";
};

export const validatePhone = (phone: string) => {
  const regex = /^\d{10}$/;
  if (!phone) return "El teléfono es requerido";
  if (!regex.test(phone))
    return "Formato inválido. Ejemplo: 1234567890 (10 dígitos sin espacios ni guiones)";
  return "";
};

export const validateRoleUser = (roleUser: string) => {
  if (!roleUser) return "El rol de usuario es requerido";
  return "";
};

export interface ValidationErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roleUser?: string;
}

export interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleUser: string;
}

export const validateForm = (data: FormData): ValidationErrors => {
  return {
    email: validateEmail(data.email),
    firstName: validateName(data.firstName, "nombre"),
    lastName: validateName(data.lastName, "apellido"),
    phoneNumber: validatePhone(data.phoneNumber),
    roleUser: validateRoleUser(data.roleUser),
  };
};

// Profile Validation

export interface ValidationErrorsProfile {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface FormDataProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const validateFormProfile = (
  data: FormDataProfile
): ValidationErrorsProfile => {
  return {
    firstName: validateName(data.firstName, "nombre"),
    lastName: validateName(data.lastName, "apellido"),
    phoneNumber: validatePhone(data.phoneNumber),
  };
};
