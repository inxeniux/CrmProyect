"use client";

import NavbarSideComponent from "@/components/layouts/NavbarSideComponent";
import SettingsTabs from "./components/SettingsTabs";

export default function SettingsPage() {
  return (
    <NavbarSideComponent name="Configuraciones">
      <SettingsTabs />
    </NavbarSideComponent>
  );
}
