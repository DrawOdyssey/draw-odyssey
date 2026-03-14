import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-brand-400" />
          </div>
        </div>
        <p className="text-sm text-surface-400">Loading Draw Odyssey...</p>
      </div>
    </div>
  );
}
