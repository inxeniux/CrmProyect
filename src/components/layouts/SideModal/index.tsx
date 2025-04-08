interface SideModalProps {
  isOpen: boolean;
  loading: boolean;
  patch: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
}

const SideModal = ({
  isOpen,
  onClose,
  children,
  title,
  patch,
  onSubmit,
  loading,
}: SideModalProps) => {
  return (
    <>
      {/* Fondo Oscuro */}
      <div
        className={`fixed inset-0 bg-black/50 dark:bg-black/70 z-[50] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Modal Lateral */}
      <div
        className={`fixed top-0 right-0 bottom-0 md:top-2 md:right-2 md:bottom-2 w-full md:w-[30rem] 
        bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary 
        shadow-lg rounded-none md:rounded-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex p-4 justify-between items-center border-b border-light-border-light dark:border-dark-border-light pb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded-md w-8 h-8 flex justify-center items-center hover:text-light-text-primary dark:hover:text-dark-text-primary"
            >
              ✕
            </button>
          </div>

          <div className="flex-grow p-2 overflow-auto">{children}</div>

          <div className="border-t border-light-border-light dark:border-dark-border-light p-4 pt-4 flex justify-end">
            <button
              className={`px-4 py-3 flex items-center justify-center 
              bg-primary-50 hover:bg-primary-600 active:bg-primary-700
              dark:bg-brand-primary dark:hover:bg-opacity-90 dark:active:bg-opacity-80
              w-full ${loading ? "cursor-not-allowed opacity-70" : ""} 
              font-semibold rounded-xl text-sm text-white`}
              onClick={!loading ? onSubmit : undefined}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                    />
                  </svg>
                  Cargando...
                </div>
              ) : patch ? (
                "Actualizar"
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideModal;
