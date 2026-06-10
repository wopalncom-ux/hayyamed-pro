"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const colors: Record<ToastType, string> = {
    success: "bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a]",
    error:   "bg-[#fef2f2] border-[#fecaca] text-[#dc2626]",
    info:    "bg-[#eff6ff] border-[#bfdbfe] text-[#1a56a0]",
  };

  const icons: Record<ToastType, string> = {
    success: "✓",
    error:   "✕",
    info:    "i",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium max-w-xs pointer-events-auto animate-in slide-in-from-bottom-2 ${colors[t.type]}`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border border-current flex-shrink-0">
              {icons[t.type]}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
