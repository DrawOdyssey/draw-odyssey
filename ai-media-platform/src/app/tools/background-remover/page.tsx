"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { Scissors, Upload, Loader2, Download } from "lucide-react";

export default function BackgroundRemoverPage() {
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setUploaded(reader.result as string); setResult(null); };
      reader.readAsDataURL(file);
    }
  }

  async function handleRemove() {
    if (!uploaded) return;
    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "remove background", modelId: "fal-ai/birefnet", userId: "demo-user", imageUrl: uploaded }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed");
      else setResult(data.imageUrl);
    } catch { setError("Network error"); }
    finally { setProcessing(false); }
  }

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Scissors className="w-6 h-6 text-orange-400" />
            Background Remover
          </h1>
          <p className="text-surface-400 text-sm">Remove backgrounds with AI precision &middot; 1 credit per image</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card !p-4">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Original</h3>
            {uploaded ? (
              <div className="relative">
                <img src={uploaded} alt="Original" className="w-full rounded-lg border border-surface-700" />
                <button onClick={() => { setUploaded(null); setResult(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white text-xs">Remove</button>
              </div>
            ) : (
              <button onClick={() => ref.current?.click()} className="w-full aspect-[4/3] border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-surface-500 transition-colors">
                <Upload className="w-10 h-10 text-surface-500 mb-3" />
                <span className="text-sm text-surface-400">Upload image</span>
              </button>
            )}
            <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            {uploaded && (
              <button onClick={handleRemove} disabled={processing} className="btn-primary w-full mt-4">
                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Scissors className="w-4 h-4" /> Remove Background</>}
              </button>
            )}
          </div>

          <div className="card !p-4">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Result</h3>
            {result ? (
              <div className="relative" style={{ background: "repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 0 0 / 20px 20px" }}>
                <img src={result} alt="Result" className="w-full rounded-lg" />
                <a href={result} target="_blank" rel="noopener noreferrer" className="btn-primary w-full mt-4 text-sm"><Download className="w-4 h-4" /> Download PNG</a>
              </div>
            ) : processing ? (
              <div className="aspect-[4/3] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-orange-400 animate-spin mb-3" />
                <p className="text-sm text-surface-400">Removing background...</p>
              </div>
            ) : (
              <div className="aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-surface-800 rounded-xl" style={{ background: "repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 0 0 / 20px 20px" }}>
                <Scissors className="w-10 h-10 text-surface-700 mb-3" />
                <p className="text-sm text-surface-500">Result will appear here</p>
              </div>
            )}
          </div>
        </div>
        {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
      </div>
    </AppShell>
  );
}
