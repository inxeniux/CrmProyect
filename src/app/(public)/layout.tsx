import React from "react";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">CRM Project</h1>
          <Link href="/login" passHref>
            <a className="text-blue-500 hover:text-blue-600 mr-4">Login</a>
          </Link>
          <Link href="/register" passHref>
            <a className="text-blue-500 hover:text-blue-600">Register</a>
          </Link>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="bg-white p-4 shadow-inner mt-8">
        <div className="container mx-auto text-center text-gray-500">
          &copy; {new Date().getFullYear()} CRM Project. Todos los derechos
          reservados.
        </div>
      </footer>
    </div>
  );
}
