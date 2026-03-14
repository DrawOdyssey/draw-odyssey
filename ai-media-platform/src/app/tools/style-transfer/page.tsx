"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { Palette, Upload, Loader2, Download, ArrowRight, Sparkles, X, Plus } from "lucide-react";

const STYLE_EXAMPLES = [
  { id: "oil", label: "Oil Painting", gradient: "from-amber-900 to-orange-800" },
  { id: "watercolor", label: "Watercolor", gradient: "from-cyan-800 to-blue-700" },
  { id: "anime", label: "Anime", gradient: "from-pink-800 to-purple-700" },
  { id: "pencil", label: "Pencil Sketch", gradient: "from-gray-700 to-gray-600" },
  { id: "neon", label: "Neon Glow", gradient: "from-violet-800 to-fuchsia-700" },
  { id: "pixel", label: "Pixel Art", gradient: "from-green-800 to-emerald-700" },
  { id: "comic", label: "Comic Book", gradient: "from-red-800 to-yellow-700" },
  { id: "surreal", label: "Surrealism", gradient: "from-indigo-800 to-purple-700" },
];

export default function StyleTransferPage() {
  const [contentImage, setContentImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [stylePrompt, setStylePrompt] = useState("");
  const [mode, setMode] = useState<"image" | "preset">("preset");
  const [strength, setStrength] = useState(0.65);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLInputElement>(null);
  const styleRef = useRef<HTMLInputElement>(null);

  function handleUpload(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setter(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
  }

  async function handleTransfer() {
    if (!contentImage) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: "fal-ai/flux/dev/image-to-image",
          imageUrl: contentImage,
          styleImageUrl: mode === "image" ? styleImage : undefined,
          prompt: stylePrompt || "Transform in artistic style",
          userId: "demo-user",
          params: { strength },
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Transfer failed");
      else setResult(data.imageUrl);
    } catch { setError("Network error"); }
    finally { setProcessing(false); }
  }

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Palette className="w-6 h-6 text-rose-400" />
            Style Transfer
          </h1>
          <p className="text-surface-400 text-sm">
            Fuse images with artistic styles. Use a style image or choose a preset. 1-2 credits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Content image */}
          <div className="lg:col-span-1">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Content Image</h3>
              {contentImage ? (
                <div className="relative">
                  <img src={contentImage} alt="Content" className="w-full aspect-square object-cover rounded-lg border border-surface-700" />
                  <button onClick={() => { setContentImage(null); setResult(null); }} className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full"><X className="w-3 h-3 text-white" /></button>
                </div>
              ) : (
                <button onClick={() => contentRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-rose-500/50 transition-colors">
                  <Upload className="w-6 h-6 text-surface-500 mb-1.5" />
                  <span className="text-xs text-surface-400">Upload image</span>
                </button>
              )}
              <input ref={contentRef} type="file" accept="image/*" className="hidden" onChange={handleUpload(setContentImage)} />
            </div>
          </div>

          {/* Style controls */}
          <div className="lg:col-span-2">
            <div className="card !p-4 space-y-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Style Source</h3>

              {/* Mode toggle */}
              <div className="flex gap-2">
                <button onClick={() => setMode("preset")} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode === "preset" ? "bg-rose-600 text-white" : "bg-surface-800 text-surface-400"}`}>
                  Style Presets
                </button>
                <button onClick={() => setMode("image")} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode === "image" ? "bg-rose-600 text-white" : "bg-surface-800 text-surface-400"}`}>
                  Style Image
                </button>
              </div>

              {mode === "preset" ? (
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_EXAMPLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setStylePrompt(`${style.label} style, artistic, detailed`)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        stylePrompt.includes(style.label)
                          ? "border-rose-500 bg-rose-500/10"
                          : "border-surface-700 hover:border-surface-600"
                      }`}
                    >
                      <div className={`w-full h-8 rounded bg-gradient-to-br ${style.gradient} mb-2`} />
                      <span className="text-xs text-white">{style.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {styleImage ? (
                    <div className="relative">
                      <img src={styleImage} alt="Style" className="w-full aspect-video object-cover rounded-lg border border-surface-700" />
                      <button onClick={() => setStyleImage(null)} className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full"><X className="w-3 h-3 text-white" /></button>
                    </div>
                  ) : (
                    <button onClick={() => styleRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-rose-500/50 transition-colors">
                      <Plus className="w-6 h-6 text-surface-500 mb-1.5" />
                      <span className="text-xs text-surface-400">Upload style reference</span>
                    </button>
                  )}
                  <input ref={styleRef} type="file" accept="image/*" className="hidden" onChange={handleUpload(setStyleImage)} />
                </>
              )}

              {/* Custom prompt override */}
              <div>
                <label className="text-xs text-surface-400 mb-1 block">Style Prompt (optional override)</label>
                <input type="text" value={stylePrompt} onChange={(e) => setStylePrompt(e.target.value)} placeholder="Describe the style..." className="input-field text-sm" />
              </div>

              <div>
                <label className="text-xs text-surface-400 mb-1 block">Transfer Strength: {Math.round(strength * 100)}%</label>
                <input type="range" min={0.2} max={0.95} step={0.05} value={strength} onChange={(e) => setStrength(parseFloat(e.target.value))} className="w-full accent-rose-500" />
                <div className="flex justify-between text-[10px] text-surface-600 mt-1">
                  <span>Subtle</span><span>Strong</span>
                </div>
              </div>

              <button onClick={handleTransfer} disabled={processing || !contentImage} className="btn-primary w-full bg-rose-600 hover:bg-rose-500">
                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Transferring...</> : <><Sparkles className="w-4 h-4" /> Apply Style</>}
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="lg:col-span-2">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Result</h3>
              {result ? (
                <div>
                  <img src={result} alt="Styled" className="w-full rounded-lg border border-surface-700" />
                  <a href={result} target="_blank" rel="noopener noreferrer" className="btn-primary w-full mt-3 text-sm"><Download className="w-4 h-4" /> Download</a>
                </div>
              ) : processing ? (
                <div className="aspect-square flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-rose-400 animate-spin mb-3" />
                  <p className="text-sm text-surface-400">Applying style transfer...</p>
                </div>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-surface-800 rounded-xl">
                  <Palette className="w-10 h-10 text-surface-700 mb-3" />
                  <p className="text-sm text-surface-500">Styled image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
      </div>
    </AppShell>
  );
}
