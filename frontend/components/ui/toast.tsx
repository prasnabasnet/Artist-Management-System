"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  action?: { label: string; onClick: () => void };
}

interface ToastContextProps {
  showToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

let toastId = 0;

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "flex items-center justify-between p-4 rounded shadow-md w-80 max-w-full animate-slide-in",
              toast.type === "success" && "bg-green-100 text-green-800",
              toast.type === "error" && "bg-red-100 text-red-800",
              toast.type === "info" && "bg-blue-100 text-blue-800",
            )}
          >
            <div className="flex-1">{toast.message}</div>
            {toast.action && (
              <button
                className="ml-3 underline font-medium"
                onClick={toast.action.onClick}
              >
                {toast.action.label}
              </button>
            )}
            <button
              className="ml-3"
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
