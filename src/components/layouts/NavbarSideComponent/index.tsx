"use client";

import Image from "next/image";
import Link from "next/link";
import { LuLayoutDashboard, LuUser } from "react-icons/lu";
import { VscChecklist } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "flowbite-react";
import { MdLogout, MdOutlineEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import MassEmailModal from "../modals/emailMasiveModal/page";
import { HiMenu } from "react-icons/hi";

interface NavbarSideComponentProps {
  children: React.ReactNode;
  getOpportunity?: () => void;
  name?: string;
  nameButton?: string;
  setOpenModal?: (open: boolean) => void;
}

export default function NavbarSideComponent({
  children,
  name,
  nameButton,
  setOpenModal,
}: NavbarSideComponentProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [openModalEmail, setOpenModalEmail] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    // Eliminar la cookie 'auth_token'
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // Redirigir al usuario a la página de login
    router.push("/login");
  };

  return (
    <React.Fragment>
      <MassEmailModal onClose={setOpenModalEmail} isOpen={openModalEmail} />
      <div className="left-0 bg-light-bg-secondary dark:bg-dark-bg-secondary right-0 absolute top-0 h-screen overflow-auto">
        <div className="flex h-screen">
          {/* Sidebar - Ahora con clases más responsivas */}
          <aside
            className={`
            fixed md:static 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0
            transition-transform duration-300 ease-in-out
            w-48 sm:w-56 md:w-20 
            h-screen
            z-50
            flex flex-col items-center justify-between 
            border-r border-light-border-light dark:border-dark-border-light 
            bg-light-bg-primary dark:bg-dark-bg-primary
          `}
          >
            <div>
              <div className="p-4 h-20 border-b border-light-border-light dark:border-dark-border-light">
                {theme === "light" ? (
                  <Image
                    src="/images/niux.png"
                    alt="Niux Logo"
                    width={100}
                    height={40}
                  />
                ) : (
                  <Image
                    src="/images/niuxdark.png"
                    alt="Niux Logo"
                    width={100}
                    height={40}
                  />
                )}
              </div>

              {/* Navigation */}
              <nav className="mt-5 flex flex-col items-center">
                <NavLink href="/funnels">
                  <LuLayoutDashboard />
                </NavLink>
                <NavLink href="/clients">
                  <LuUser />
                </NavLink>
                <NavLink href="/tasks">
                  <VscChecklist />
                </NavLink>
                <NavLink href="/settings">
                  <IoSettingsOutline />
                </NavLink>
              </nav>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-light-bg-primary dark:bg-dark-bg-primary 
        mb-2 flex justify-center items-center h-14 w-14 
        border border-light-border-light dark:border-red-600 
        rounded-full text-xl transition duration-200
        text-light-text-primary dark:text-red-600
        hover:border-brand-accent hover:text-brand-accent"
              href="/settings"
            >
              <MdLogout />
            </Button>
          </aside>

          {/* Overlay para móviles */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col w-full">
            {/* Header - Más responsivo */}
            <header className="flex items-center justify-between border-b border-light-border-light dark:border-dark-border-light h-16 sm:h-18 md:h-20 p-2 sm:p-3 md:p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className="md:hidden mr-2 sm:mr-3 text-xl sm:text-2xl text-primary-50"
                >
                  <HiMenu />
                </button>
                <h1 className="text-base sm:text-lg md:text-xl text-primary-50 font-bold">
                  {name}
                </h1>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                {/* Search Input - Ajustado para diferentes tamaños */}
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="hidden lg:block w-32 sm:w-40 md:w-48 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg 
                  bg-light-bg-input dark:bg-dark-bg-input 
                  border border-light-border-medium dark:border-dark-border-medium 
                  text-light-text-primary dark:text-dark-text-primary
                  text-sm focus:outline-none focus:border-brand-accent"
                />

                {/* Email Button - Más compacto en móviles */}
                <button
                  onClick={() => setOpenModalEmail(true)}
                  className="text-white text-sm bg-primary-50 hover:bg-primary-600 active:bg-primary-700 
                  rounded-full p-1.5 sm:p-2 md:p-3 focus:outline-none focus:ring"
                >
                  <MdOutlineEmail className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Action Button - Más compacto y responsivo */}
                {nameButton !== undefined && setOpenModal !== undefined && (
                  <button
                    onClick={() => setOpenModal(true)}
                    className="text-white bg-primary-50 hover:bg-primary-600 active:bg-primary-700 
                    rounded-full py-1.5 sm:py-2 px-3 sm:px-4 md:px-6
                    text-xs sm:text-sm focus:outline-none focus:ring
                    whitespace-nowrap hidden sm:block"
                  >
                    {nameButton}
                  </button>
                )}

                {/* User Avatar - Más pequeño en móviles */}
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ot7fjk2Zlzx4r_0smMzzSJs6RTlzvp5NOA&s"
                  alt="User"
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-cover rounded-full"
                />
              </div>
            </header>

            {/* Main Content Area - Padding ajustado */}
            <div className="flex-1 bg-light-bg-secondary dark:bg-dark-bg-secondary p-2 sm:p-3 md:p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// Helper component for navigation links
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="bg-light-bg-primary dark:bg-dark-bg-primary 
        mb-2 flex justify-center items-center h-14 w-14 
        border border-light-border-light dark:border-dark-border-light 
        rounded-full text-xl transition duration-200
        text-light-text-primary dark:text-dark-text-primary
        hover:border-brand-accent hover:text-brand-accent"
    >
      {children}
    </Link>
  );
}
