// src/app/layout.tsx
import '@/styles/globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import AuthGuard from '@/components/AutoGuard';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
          <Toaster 
            position="top-right"
            toastOptions={{
              // Estilo para todos los toasts
              className: 'dark:bg-gray-800 dark:text-white',
              duration: 4000,
              style: {
                padding: '16px',
                borderRadius: '8px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}