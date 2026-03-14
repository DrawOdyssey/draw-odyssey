"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { UPSCALE_MODELS, type AIModel } from "@/lib/fal";
import { Maximize2, Upload, Loader2, Download, ArrowRight, Zap } from "lucide-react";

export default function UpscalePage() {
  const [selectedModel, setSelectedModel] = useState<AIModel>(UPSCALE_MODELS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setUploadedImage(reader.result as string); setResult(null); };
      reader.readAsDataURL(file);
    }
  }

  async function handleUpscale() {
    if (!uploadedImage) return;
    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "upscale", modelId: selectedModel.id, userId: "demo-user", imageUrl: uploadedImage }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Upscale failed");
      else setResult(data.imageUrl);
    } catch { setError("Network error"); }
    finally { setProcessing(false); }
  }

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Maximize2 className="w-6 h-6 text-green-400" />
            AI Upscaler
          </h1>
          <p className="text-surface-400 text-sm">Enhance and upscale images up to 8x with AI</p>
        </div>

        {/* Model selector */}
        <div className="flex gap-3 mb-6">
          {UPSCALE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`flex-1 p-4 rounded-xl border text-left transition-all ${
                selectedModel.id === model.id
                  ? "border-green-500 bg-green-500/10"
                  : "border-surface-700 bg-surface-900 hover:border-surface-600"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white">{model.name}</span>
                <span className="text-xs text-surface-400">{model.creditCost} cr</span>
              </div>
              <p className="text-xs text-surface-500">{model.description}</p>
            </button>
          ))}
        </div>

        {/* Upload + Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="card !p-4">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Original Image</h3>
            {uploadedImage ? (
              <div className="relative">
                <img src={uploadedImage} alt="Original" className="w-full rounded-lg border border-surface-700" />
                <button onClick={() => { setUploadedImage(null); setResult(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white text-xs">Remove</button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-surface-500 transition-colors">
                <Upload className="w-10 h-10 text-surface-500 mb-3" />
                <span className="text-sm text-surface-400">Upload image to upscale</span>
                <span className="text-xs text-surface-600 mt-1">JPG, PNG up to 10MB</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            {uploadedImage && (
              <button onClick={handleUpscale} disabled={processing} className="btn-primary w-full mt-4">
                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Upscaling...</> : <><Zap className="w-4 h-4" /> Upscale with {selectedModel.name}</>}
              </button>
            )}
          </div>

          {/* Output */}
          <div className="card !p-4">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
              Upscaled Result
            </h3>
            {result ? (
              <div>
                <img src={result} alt="Upscaled" className="w-full rounded-lg border border-surface-700" />
                <a href={result} target="_blank" rel="noopener noreferrer" className="btn-primary w-full mt-4 text-sm">
                  <Download className="w-4 h-4" /> Download HD
                </a>
              </div>
            ) : processing ? (
              <div className="aspect-square flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-green-400 animate-spin mb-3" />
                <p className="text-sm text-surface-400">Enhancing your image...</p>
              </div>
            ) : (
              <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-surface-800 rounded-xl">
                <Maximize2 className="w-10 h-10 text-surface-700 mb-3" />
                <p className="text-sm text-surface-500">Upscaled image will appear here</p>
              </div>
            )}
          </div>
        </div>

        {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
      </div>
    </AppShell>
  );
}
