"use client";

import { AlertTriangle, CheckCircle2, Info, X, Loader2 } from "lucide-react";
import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ── Loading Skeletons ──
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-800 rounded-lg ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="card !p-4 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function ImageGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl" />
      ))}
    </div>
  );
}

export function ModelListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-3" />
        <p className="text-sm text-surface-400">Loading...</p>
      </div>
    </div>
  );
}

// ── Error Display ──
export function ErrorDisplay({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        {message && (
          <p className="text-sm text-surface-400 mb-4">{message}</p>
        )}
        {onRetry && (
          <button onClick={onRetry} className="btn-primary text-sm">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// ── Toast Notification System ──
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, type, message, duration }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  const icons: Record<ToastType, typeof CheckCircle2> = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors: Record<ToastType, string> = {
    success: "border-green-500/30 bg-green-500/10",
    error: "border-red-500/30 bg-red-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
    warning: "border-yellow-500/30 bg-yellow-500/10",
  };

  const iconColors: Record<ToastType, string> = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-blue-400",
    warning: "text-yellow-400",
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-xl animate-slide-up ${colors[toast.type]}`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
            <p className="text-sm text-surface-200 flex-1">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-surface-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Auth Guard Component ──
export function AuthGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check auth state — in production, use Supabase auth helpers
    const checkAuth = async () => {
      try {
        // Simplified check — replace with real Supabase session check
        const hasSession = document.cookie.includes("sb-") || true; // default to true for dev
        setIsAuthenticated(hasSession);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <PageLoader />;
  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Sign in required</h2>
          <p className="text-surface-400 mb-4">Please sign in to access this page.</p>
          <a href="/auth/login" className="btn-primary">Sign In</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ── Empty State Component ──
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: any;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="card text-center !py-16">
      <Icon className="w-12 h-12 mx-auto text-surface-600 mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-surface-400 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && actionHref && (
        <a href={actionHref} className="btn-primary inline-flex text-sm">
          {actionLabel}
        </a>
      )}
    </div>
  );
}

// ── Credit Indicator ──
export function CreditCost({ amount }: { amount: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-surface-400">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
      {amount} credit{amount !== 1 ? "s" : ""}
    </span>
  );
}

// ── Confirmation Dialog ──
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface-900 border border-surface-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-surface-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`${destructive ? "btn-primary bg-red-600 hover:bg-red-500" : "btn-primary"} text-sm`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
