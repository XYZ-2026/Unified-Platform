"use client";

import React, { useEffect } from "react";
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconInfoCircle,
  IconAlertTriangle,
} from "@tabler/icons-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: string; iconBg: string }> = {
  success: {
    bg: "bg-white",
    border: "border-[#BFF6CD]",
    icon: "text-[#0F8A43]",
    iconBg: "bg-[#EAFDF1]",
  },
  error: {
    bg: "bg-white",
    border: "border-[#FCD4D4]",
    icon: "text-[#C23B3B]",
    iconBg: "bg-[#FDF2F2]",
  },
  warning: {
    bg: "bg-white",
    border: "border-[#FFE7B2]",
    icon: "text-[#C9A55D]",
    iconBg: "bg-[#FFF9ED]",
  },
  info: {
    bg: "bg-white",
    border: "border-[#C3DAFE]",
    icon: "text-[#3B82F6]",
    iconBg: "bg-[#EFF6FF]",
  },
};

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <IconCheck size={16} stroke={2.5} />,
  error: <IconAlertCircle size={16} stroke={2} />,
  warning: <IconAlertTriangle size={16} stroke={2} />,
  info: <IconInfoCircle size={16} stroke={2} />,
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const styles = TOAST_STYLES[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration ?? 4500);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-sm max-w-[380px] w-full ${styles.bg} ${styles.border} animate-in slide-in-from-right-5 fade-in duration-300`}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg} ${styles.icon}`}>
        {TOAST_ICONS[toast.type]}
      </div>
      <p className="flex-grow text-[13px] font-semibold text-[#1a1a1a] leading-snug pt-1 pr-1">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[#A5A5A5] hover:text-[#555] hover:bg-[#F6F4F2] transition-all cursor-pointer mt-0.5"
      >
        <IconX size={13} stroke={2.5} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

// Hook for easy usage
export function useToast() {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback(
    (message: string, type: ToastType = "info", duration?: number) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string, duration?: number) => addToast(msg, "success", duration),
    error: (msg: string, duration?: number) => addToast(msg, "error", duration),
    warning: (msg: string, duration?: number) => addToast(msg, "warning", duration),
    info: (msg: string, duration?: number) => addToast(msg, "info", duration),
  };

  return { toasts, toast, dismiss };
}
