import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteConfirmModalProps {
  roleName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({
  roleName,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4 flex items-center text-light-text-primary dark:text-white">
          <FaExclamationTriangle className="text-yellow-500 mr-2" />
          Confirmar eliminación
        </h3>
        <p className="mb-6 text-light-text-primary dark:text-white">
          ¿Estás seguro que deseas eliminar el rol <strong>{roleName}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-light-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
