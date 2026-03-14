"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-surface-950 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-surface-400 mb-2">
            An unexpected error occurred. Our team has been notified.
          </p>
          {error.digest && (
            <p className="text-xs text-surface-600 font-mono mb-6">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex items-center justify-center gap-3">
            <button onClick={reset} className="btn-primary">
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <a href="/" className="btn-secondary">
              <Home className="w-4 h-4" /> Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
