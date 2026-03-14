"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { Users, Upload, Loader2, Download, ArrowLeftRight, Sparkles } from "lucide-react";

export default function FaceSwapPage() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const sourceRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);

  function handleUpload(setter: (v: string | null) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => { setter(reader.result as string); setResult(null); };
        reader.readAsDataURL(file);
      }
    };
  }

  async function handleSwap() {
    if (!sourceImage || !targetImage) return;
    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "face swap", modelId: "fal-ai/face-swap", userId: "demo-user", imageUrl: sourceImage, targetImageUrl: targetImage }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Face swap failed");
      else setResult(data.imageUrl);
    } catch { setError("Network error"); }
    finally { setProcessing(false); }
  }

  function ImageUploadBox({ image, onClear, inputRef, onClick, label }: any) {
    return image ? (
      <div className="relative">
        <img src={image} alt={label} className="w-full aspect-[3/4] object-cover rounded-lg border border-surface-700" />
        <button onClick={onClear} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white text-xs hover:bg-black/80">Remove</button>
        <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">{label}</span>
      </div>
    ) : (
      <button onClick={onClick} className="w-full aspect-[3/4] border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-surface-500 transition-colors">
        <Upload className="w-8 h-8 text-surface-500 mb-2" />
        <span className="text-sm text-surface-400">{label}</span>
        <span className="text-xs text-surface-600 mt-1">Click to upload</span>
      </button>
    );
  }

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Users className="w-6 h-6 text-pink-400" />
            Face Swap
          </h1>
          <p className="text-surface-400 text-sm">Swap faces between two images with AI &middot; 2 credits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start">
          {/* Source */}
          <div className="md:col-span-2 card !p-4">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Source Face</h3>
            <ImageUploadBox image={sourceImage} onClear={() => setSourceImage(null)} inputRef={sourceRef} onClick={() => sourceRef.current?.click()} label="Face to use" />
            <input ref={sourceRef} type="file" accept="image/*" className="hidden" onChange={handleUpload(setSourceImage)} />
          </div>

          {/* Arrow */}
          <div className="md:col-span-1 flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <ArrowLeftRight className="w-6 h-6 text-pink-400" />
              <button
                onClick={handleSwap}
                disabled={processing || !sourceImage || !targetImage}
                className="btn-primary bg-pink-600 hover:bg-pink-500 text-xs whitespace-nowrap"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> Swap</>}
              </button>
            </div>
          </div>

          {/* Target */}
          <div className="md:col-span-2 card !p-4">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Target Image</h3>
            <ImageUploadBox image={targetImage} onClear={() => setTargetImage(null)} inputRef={targetRef} onClick={() => targetRef.current?.click()} label="Image to apply face" />
            <input ref={targetRef} type="file" accept="image/*" className="hidden" onChange={handleUpload(setTargetImage)} />
          </div>

          {/* Result */}
          <div className="md:col-span-2 card !p-4">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Result</h3>
            {result ? (
              <div>
                <img src={result} alt="Result" className="w-full aspect-[3/4] object-cover rounded-lg border border-surface-700" />
                <a href={result} target="_blank" rel="noopener noreferrer" className="btn-primary w-full mt-3 text-sm"><Download className="w-4 h-4" /> Download</a>
              </div>
            ) : processing ? (
              <div className="aspect-[3/4] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-pink-400 animate-spin mb-3" />
                <p className="text-sm text-surface-400">Swapping faces...</p>
              </div>
            ) : (
              <div className="aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-surface-800 rounded-xl">
                <Users className="w-10 h-10 text-surface-700 mb-3" />
                <p className="text-sm text-surface-500">Result appears here</p>
              </div>
            )}
          </div>
        </div>
        {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
      </div>
    </AppShell>
  );
}
