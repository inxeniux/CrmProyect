export const metadata = {
  title: "Configuraciones | CRM",
  description: "Administra las configuraciones de tu cuenta y negocio",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
