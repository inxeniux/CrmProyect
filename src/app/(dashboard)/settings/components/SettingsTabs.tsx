"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProfileTab from "./ProfileTab";
import BusinessTab from "./BusinessTab";
import PaymentsTab from "./PaymentsTab";
import DesignTab from "./DesignTab";

type TabType = "Perfil" | "Negocio" | "Pagos" | "Diseño";

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("Perfil");
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleTabClick = (tab: TabType) => setActiveTab(tab);

  useEffect(() => {
    const token = Cookies.get("role");
    console.log("Token:", token);
    if (token) {
      try {
        setUserRole(token);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  const tabs: TabType[] = ["Perfil", "Pagos", "Diseño"];
  if (userRole === "Admin") {
    tabs.splice(1, 0, "Negocio"); // Inserta "Negocio" después de "Perfil"
  }

  const renderTab = () => {
    switch (activeTab) {
      case "Perfil":
        return <ProfileTab />;
      case "Negocio":
        return <BusinessTab />;
      case "Pagos":
        return <PaymentsTab />;
      case "Diseño":
        return <DesignTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-sm min-h-screen md:min-h-0">
      <div className="border-b border-light-border-light dark:border-dark-border-light overflow-x-auto scrollbar-hide">
        <ul className="flex px-1 sm:px-2 md:px-6 pt-2 md:pt-4 whitespace-nowrap min-w-full">
          {tabs.map((tab) => (
            <li
              key={tab}
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
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-2 sm:p-4 md:p-6">{renderTab()}</div>
    </div>
  );
}
