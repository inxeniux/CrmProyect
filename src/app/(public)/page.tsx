import React from "react";
import Link from "next/link";

export default function PublicPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a nuestro CRM</h1>
      <p className="mb-4">
        Esta es la página pública de nuestro sistema de gestión de clientes.
      </p>
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors inline-block"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}
