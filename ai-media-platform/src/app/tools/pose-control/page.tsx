"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { CONTROL_MODELS, type AIModel } from "@/lib/fal";
import { PersonStanding, Upload, Loader2, Download, Sparkles, X, Image as ImageIcon, Layers } from "lucide-react";

type ControlMode = "pose" | "depth" | "edge";

export default function PoseControlPage() {
  const [controlMode, setControlMode] = useState<ControlMode>("pose");
  const [controlImage, setControlImage] = useState<string | null>(null);
  const [extractedMap, setExtractedMap] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [processing, setProcessing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setControlImage(reader.result as string); setExtractedMap(null); setResult(null); };
      reader.readAsDataURL(file);
    }
  }

  async function handleExtract() {
    if (!controlImage) return;
    setExtracting(true);
    // Simulate extraction
    setTimeout(() => {
      setExtractedMap(controlImage); // In production, this would be the actual pose/depth/edge map
      setExtracting(false);
    }, 1500);
  }

  async function handleGenerate() {
    if (!extractedMap || !prompt.trim()) return;
    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/generate/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: "fal-ai/flux-general/image-to-image/controlnet",
          imageUrl: extractedMap,
          prompt,
          userId: "demo-user",
          params: { controlMode },
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Generation failed");
      else setResult(data.imageUrl);
    } catch { setError("Network error"); }
    finally { setProcessing(false); }
  }

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <PersonStanding className="w-6 h-6 text-lime-400" />
            Pose &amp; Depth Control
          </h1>
          <p className="text-surface-400 text-sm">
            Extract poses, depth maps, or edges from images and use them to guide AI generation. 2 credits.
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-6">
          {([
            { id: "pose" as const, label: "Pose Control", desc: "Body/hand/face pose" },
            { id: "depth" as const, label: "Depth Map", desc: "3D depth information" },
            { id: "edge" as const, label: "Edge Detection", desc: "Structural outlines" },
          ]).map((mode) => (
            <button
              key={mode.id}
              onClick={() => setControlMode(mode.id)}
              className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                controlMode === mode.id ? "border-lime-500 bg-lime-500/10" : "border-surface-700 bg-surface-900 hover:border-surface-600"
              }`}
            >
              <span className="text-sm font-semibold text-white">{mode.label}</span>
              <p className="text-xs text-surface-500">{mode.desc}</p>
            </button>
          ))}
        </div>

        {/* Three-column workflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Upload */}
          <div className="card !p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center text-xs font-bold text-lime-400">1</span>
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Upload Reference</h3>
            </div>
            {controlImage ? (
              <div className="relative">
                <img src={controlImage} alt="Reference" className="w-full aspect-square object-cover rounded-lg border border-surface-700" />
                <button onClick={() => { setControlImage(null); setExtractedMap(null); setResult(null); }} className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full"><X className="w-3 h-3 text-white" /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-lime-500/50 transition-colors">
                <Upload className="w-8 h-8 text-surface-500 mb-2" />
                <span className="text-sm text-surface-400">Upload image</span>
                <span className="text-xs text-surface-600 mt-1">with a person/scene</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            {controlImage && !extractedMap && (
              <button onClick={handleExtract} disabled={extracting} className="btn-secondary w-full mt-3 text-sm">
                {extracting ? <><Loader2 className="w-4 h-4 animate-spin" /> Extracting...</> : <><Layers className="w-4 h-4" /> Extract {controlMode}</>}
              </button>
            )}
          </div>

          {/* Step 2: Extracted map */}
          <div className="card !p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center text-xs font-bold text-lime-400">2</span>
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Control Map</h3>
            </div>
            {extractedMap ? (
              <div>
                <div className="aspect-square rounded-lg border border-surface-700 overflow-hidden bg-black">
                  <img src={extractedMap} alt="Control map" className="w-full h-full object-cover opacity-70" style={{ filter: controlMode === "depth" ? "hue-rotate(180deg) saturate(2)" : controlMode === "edge" ? "invert(1) grayscale(1)" : "hue-rotate(90deg)" }} />
                </div>
                <div className="mt-3 space-y-2">
                  <label className="text-xs text-surface-400 block">Generation Prompt</label>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={`Describe what to generate using this ${controlMode} as a guide...`} className="input-field min-h-[60px] resize-none text-sm" />
                  <button onClick={handleGenerate} disabled={processing || !prompt.trim()} className="btn-primary w-full bg-lime-600 hover:bg-lime-500 text-sm">
                    {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate</>}
                  </button>
                </div>
              </div>
            ) : extracting ? (
              <div className="aspect-square flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-lime-400 animate-spin mb-2" />
                <p className="text-xs text-surface-400">Extracting {controlMode} map...</p>
              </div>
            ) : (
              <div className="aspect-square border-2 border-dashed border-surface-800 rounded-xl flex flex-col items-center justify-center">
                <Layers className="w-8 h-8 text-surface-700 mb-2" />
                <p className="text-xs text-surface-500">Extract from step 1</p>
              </div>
            )}
          </div>

          {/* Step 3: Result */}
          <div className="card !p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center text-xs font-bold text-lime-400">3</span>
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Generated Result</h3>
            </div>
            {result ? (
              <div>
                <img src={result} alt="Result" className="w-full aspect-square object-cover rounded-lg border border-surface-700" />
                <a href={result} target="_blank" rel="noopener noreferrer" className="btn-primary w-full mt-3 text-sm"><Download className="w-4 h-4" /> Download</a>
              </div>
            ) : processing ? (
              <div className="aspect-square flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-lime-400 animate-spin mb-2" />
                <p className="text-xs text-surface-400">Generating with {controlMode} control...</p>
              </div>
            ) : (
              <div className="aspect-square border-2 border-dashed border-surface-800 rounded-xl flex flex-col items-center justify-center">
                <ImageIcon className="w-8 h-8 text-surface-700 mb-2" />
                <p className="text-xs text-surface-500">Result appears here</p>
              </div>
            )}
          </div>
        </div>
        {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
      </div>
    </AppShell>
  );
}
