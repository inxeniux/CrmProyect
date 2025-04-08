export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export interface User {
  email: string;
  role: string;
  status: string;
}
