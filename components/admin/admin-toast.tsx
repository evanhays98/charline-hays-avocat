"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export interface Toast {
  id: number;
  tone: "success" | "warning" | "error";
  message: string;
}

interface AdminToastProps {
  toast: Toast | null;
  onDismiss: () => void;
}

const TONES = {
  success: { icon: CheckCircle2, className: "text-[#a8dcc0]" },
  warning: { icon: AlertCircle, className: "text-gold-soft" },
  error: { icon: AlertCircle, className: "text-[#f09a85]" },
};

export const AdminToast = ({ toast, onDismiss }: AdminToastProps) => {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const { icon: Icon, className } = TONES[toast.tone];

  return (
    <div
      key={toast.id}
      role="status"
      className="fixed inset-x-3 bottom-4 z-50 mx-auto flex max-w-md animate-[rdv-rise_0.35s_ease-out] items-center gap-3 bg-navy px-4 py-3.5 text-sm text-white shadow-[0_18px_40px_-16px_rgba(12,26,56,0.6)]"
    >
      <Icon className={`size-5 shrink-0 ${className}`} aria-hidden="true" />
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fermer"
        className="grid size-8 cursor-pointer place-items-center text-mist hover:text-white"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
};
