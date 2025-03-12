"use client";

import { useState, useEffect, useMemo, memo } from "react";
import Cookies from "js-cookie";
import ProfileTab from "./ProfileTab";
import BusinessTab from "./BusinessTab";
import PaymentsTab from "./PaymentsTab";
import DesignTab from "./DesignTab";
import RolesTab from "./RolesTab";

type TabType = "Perfil" | "Negocio" | "Pagos" | "Diseño" | "Gestión de roles";

// Componente optimizado para cada pestaña individual
const TabItem = memo(
  ({
    tab,
    activeTab,
    onClick,
  }: {
    tab: TabType;
    activeTab: TabType;
    onClick: (tab: TabType) => void;
  }) => (
    <li
      className={`${
        activeTab === tab
          ? "border-b-2 border-primary-50 text-primary-50"
          : "text-light-text-tertiary dark:text-dark-text-tertiary border-b-2 border-transparent"
      } 
    text-[11px] sm:text-xs md:text-sm 
    mr-2 sm:mr-4 md:mr-8 
    px-1.5 sm:px-2 md:px-1 
    py-1.5 sm:py-2 md:py-2.5
    cursor-pointer 
    transition-colors 
    hover:text-primary-50
    font-medium
    flex-1 md:flex-none
    text-center md:text-left`}
      onClick={() => onClick(tab)}
    >
      {tab}
    </li>
  )
);

TabItem.displayName = "TabItem";

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("Perfil");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("role");
    if (token) {
      try {
        setUserRole(token);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  // Memorizar la lista de pestañas para evitar recálculos innecesarios
  const tabs = useMemo(() => {
    const baseTabs: TabType[] = ["Perfil", "Pagos", "Diseño"];
    if (userRole === "Admin") {
      return [
        "Perfil",
        "Negocio",
        "Pagos",
        "Diseño",
        "Gestión de roles",
      ] as TabType[];
    }
    return baseTabs;
  }, [userRole]);

  // Memorizar la función de cambio de pestaña
  const handleTabClick = useMemo(() => (tab: TabType) => setActiveTab(tab), []);

  // Memorizar el contenido de la pestaña activa para evitar re-renderizaciones
  const activeTabContent = useMemo(() => {
    switch (activeTab) {
      case "Perfil":
        return <ProfileTab />;
      case "Negocio":
        return <BusinessTab />;
      case "Pagos":
        return <PaymentsTab />;
      case "Diseño":
        return <DesignTab />;
      case "Gestión de roles":
        return <RolesTab />;
      default:
        return <ProfileTab />;
    }
  }, [activeTab]);

  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-sm min-h-screen md:min-h-0">
      <div className="border-b border-light-border-light dark:border-dark-border-light overflow-x-auto scrollbar-hide">
        <ul className="flex px-1 sm:px-2 md:px-6 pt-2 md:pt-4 whitespace-nowrap min-w-full">
          {tabs.map((tab) => (
            <TabItem
              key={tab}
              tab={tab}
              activeTab={activeTab}
              onClick={handleTabClick}
            />
          ))}
        </ul>
      </div>

      <div className="p-2 sm:p-4 md:p-6">{activeTabContent}</div>
    </div>
  );
}
