export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "El correo es requerido";
  if (!regex.test(email))
    return "Formato inválido. Ejemplo: usuario@dominio.com";
  return "";
};

export const validatePassword = (password: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password) return "La contraseña es requerida";
  if (!regex.test(password))
    return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial. Ejemplo: Abc123!@";
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

export const validateBusinessId = (id: string) => {
  if (!id) return "El ID del negocio es requerido";
  return "";
};

export interface ValidationErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  businessId?: string;
}

export interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  businessId: string;
}

export const validateForm = (data: FormData): ValidationErrors => {
  return {
    email: validateEmail(data.email),
    password: validatePassword(data.password),
    firstName: validateName(data.firstName, "nombre"),
    lastName: validateName(data.lastName, "apellido"),
    phoneNumber: validatePhone(data.phoneNumber),
    businessId: validateBusinessId(data.businessId),
  };
};
