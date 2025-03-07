// src/utils/toast.ts
import toast from "react-hot-toast";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        border: "1px solid #10B981",
        padding: "16px",
      },
      iconTheme: {
        primary: "#10B981",
        secondary: "#FFFFFF",
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      style: {
        border: "1px solid #EF4444",
        padding: "16px",
      },
      iconTheme: {
        primary: "#EF4444",
        secondary: "#FFFFFF",
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        border: "1px solid #3B82F6",
        padding: "16px",
      },
    });
  },

  // Para actualizar un toast de loading
  updateLoading: (
    toastId: string,
    message: string,
    type: "success" | "error"
  ) => {
    toast.dismiss(toastId);
    if (type === "success") {
      showToast.success(message);
    } else {
      showToast.error(message);
    }
  },
};
