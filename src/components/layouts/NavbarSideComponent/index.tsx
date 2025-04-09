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
import React, { useState, useCallback, useMemo, memo } from "react";
import MassEmailModal from "../modals/emailMasiveModal/page";
import { HiMenu } from "react-icons/hi";

interface NavbarSideComponentProps {
  children: React.ReactNode;
  getOpportunity?: () => void;
  name?: string;
  nameButton?: string;
  setOpenModal?: (open: boolean) => void;
}

// Componente de navegación memoizado para evitar renderizados innecesarios
const MemoizedNavLink = memo(function NavLink({
  href,
  children,
  prefetch = true,
}: {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className="bg-light-bg-primary dark:bg-dark-bg-primary 
        mb-2 flex justify-center items-center h-14 w-14 
        border border-light-border-light dark:border-dark-border-light 
        rounded-full text-xl transition duration-200
        text-light-text-primary dark:text-dark-text-primary
        hover:border-brand-accent hover:text-brand-accent"
      aria-label={`Navegar a ${href.replace("/", "")}`}
    >
      {children}
    </Link>
  );
});

// Componente de barra lateral memoizado
const Sidebar = memo(function Sidebar({
  isSidebarOpen,
  theme,
  handleLogout,
}: {
  isSidebarOpen: boolean;
  theme: string;
  handleLogout: () => void;
}) {
  return (
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
              priority
            />
          ) : (
            <Image
              src="/images/niuxdark.png"
              alt="Niux Logo"
              width={100}
              height={40}
              priority
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex flex-col items-center">
          <MemoizedNavLink href="/funnels">
            <LuLayoutDashboard />
          </MemoizedNavLink>
          <MemoizedNavLink href="/clients">
            <LuUser />
          </MemoizedNavLink>
          <MemoizedNavLink href="/tasks">
            <VscChecklist />
          </MemoizedNavLink>
          <MemoizedNavLink href="/settings">
            <IoSettingsOutline />
          </MemoizedNavLink>
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
        aria-label="Cerrar sesión"
      >
        <MdLogout />
      </Button>
    </aside>
  );
});

export default function NavbarSideComponent({
  children,
  name,
  nameButton,
  setOpenModal,
}: NavbarSideComponentProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [openModalEmail, setOpenModalEmail] = useState<boolean>(false);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Memoizar funciones para evitar recreaciones en cada renderizado
  const handleLogout = useCallback(() => {
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    router.push("/login");
  }, [router]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prevState) => !prevState);
  }, []);

  const handleOpenEmailModal = useCallback(() => {
    setOpenModalEmail(true);
  }, []);

  const handleOpenActionModal = useCallback(() => {
    if (setOpenModal) {
      setOpenModal(true);
    }
  }, [setOpenModal]);

  // Precargar rutas principales para navegación más rápida
  useMemo(() => {
    const paths = ["/funnels", "/clients", "/tasks", "/settings"];
    paths.forEach((path) => {
      router.prefetch(path);
    });
  }, [router]);

  return (
    <React.Fragment>
      <MassEmailModal onClose={setOpenModalEmail} isOpen={openModalEmail} />
      <div className="left-0 bg-light-bg-secondary dark:bg-dark-bg-secondary right-0 absolute top-0 h-screen overflow-auto">
        <div className="flex h-screen">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            theme={theme}
            handleLogout={handleLogout}
          />

          {/* Overlay para móviles */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col w-full">
            {/* Header - Más responsivo */}
            <header className="flex items-center justify-between border-b border-light-border-light dark:border-dark-border-light h-16 sm:h-18 md:h-20 p-2 sm:p-3 md:p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="md:hidden mr-2 sm:mr-3 text-xl sm:text-2xl text-primary-50"
                  aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
                  aria-expanded={isSidebarOpen}
                >
                  <HiMenu />
                </button>
                <h1 className="text-base sm:text-lg md:text-xl text-primary-50 font-bold">
                  {name}
                </h1>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="hidden lg:block w-32 sm:w-40 md:w-48 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg 
                  bg-light-bg-input dark:bg-dark-bg-input 
                  border border-light-border-medium dark:border-dark-border-medium 
                  text-light-text-primary dark:text-dark-text-primary
                  text-sm focus:outline-none focus:border-brand-accent"
                  aria-label="Buscar"
                />

                {/* Email Button */}
                <button
                  onClick={handleOpenEmailModal}
                  className="text-white text-sm bg-primary-50 hover:bg-primary-600 active:bg-primary-700 
                  rounded-full p-1.5 sm:p-2 md:p-3 focus:outline-none focus:ring"
                  aria-label="Email masivo"
                >
                  <MdOutlineEmail className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Action Button - Condicional */}
                {nameButton !== undefined && setOpenModal !== undefined && (
                  <button
                    onClick={handleOpenActionModal}
                    className="text-white bg-primary-50 hover:bg-primary-600 active:bg-primary-700 
                    rounded-full py-1.5 sm:py-2 px-3 sm:px-4 md:px-6
                    text-xs sm:text-sm focus:outline-none focus:ring
                    whitespace-nowrap hidden sm:block"
                    aria-label={nameButton}
                  >
                    {nameButton}
                  </button>
                )}

                {/* User Avatar */}
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ot7fjk2Zlzx4r_0smMzzSJs6RTlzvp5NOA&s"
                  alt="Perfil de usuario"
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-cover rounded-full"
                />
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 bg-light-bg-secondary dark:bg-dark-bg-secondary p-2 sm:p-3 md:p-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
