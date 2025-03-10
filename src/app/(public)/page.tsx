import React from "react";
import Link from "next/link";

export default function PublicPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a nuestro CRM</h1>
      <p className="mb-4">
        Esta es la página pública de nuestro sistema de gestión de clientes.
      </p>
      <Link href="/login" passHref>
        Iniciar sesión
      </Link>
    </div>
  );
}
