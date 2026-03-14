"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { IMG2IMG_MODELS, type AIModel } from "@/lib/fal";
import { PenTool, Upload, Loader2, Download, Sparkles, X, ArrowLeftRight, Settings2 } from "lucide-react";

const EDIT_PRESETS = [
  { label: "Make it sunset", prompt: "warm golden sunset lighting, orange sky" },
  { label: "Add snow", prompt: "covered in snow, winter scene, frost" },
  { label: "Night version", prompt: "nighttime, starry sky, moonlight" },
  { label: "Make cyberpunk", prompt: "cyberpunk style, neon lights, futuristic" },
  { label: "Studio Ghibli", prompt: "Studio Ghibli anime style, lush and whimsical" },
  { label: "Make dramatic", prompt: "dramatic lighting, high contrast, cinematic" },
  { label: "Watercolor", prompt: "watercolor painting style, soft edges, artistic" },
  { label: "Add autumn", prompt: "autumn colors, falling leaves, warm tones" },
];

export default function ImageEditorPage() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>(IMG2IMG_MODELS[0]);
  const [strength, setStrength] = useState(0.6);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setSourceImage(reader.result as string); setResult(null); };
      reader.readAsDataURL(file);
    }
  }

  async function handleEdit() {
    if (!sourceImage || !prompt.trim()) return;
    setProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/generate/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel.id,
          imageUrl: sourceImage,
          prompt,
          userId: "demo-user",
          params: { strength },
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Edit failed");
      else {
        setResult(data.imageUrl);
        setHistory((prev) => [data.imageUrl, ...prev]);
      }
    } catch { setError("Network error"); }
    finally { setProcessing(false); }
  }

  function useResultAsSource() {
    if (result) {
      setSourceImage(result);
      setResult(null);
    }
  }

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <PenTool className="w-6 h-6 text-sky-400" />
            Smart Image Editor
          </h1>
          <p className="text-surface-400 text-sm">
            Edit images with text prompts. Describe the changes you want and AI makes them happen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Edit Model</h3>
              <div className="space-y-1.5">
                {IMG2IMG_MODELS.filter((m) => m.category === "Image to Image").map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      selectedModel.id === model.id ? "border-sky-500 bg-sky-500/10" : "border-surface-700/50 bg-surface-800/50 hover:border-surface-600"
                    }`}
                  >
                    <span className="text-sm font-medium text-white">{model.name}</span>
                    <p className="text-[11px] text-surface-500">{model.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="card !p-4 space-y-3">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Settings</h3>
              <div>
                <label className="text-xs text-surface-400 mb-1 block">Edit Strength: {Math.round(strength * 100)}%</label>
                <input type="range" min={0.1} max={0.95} step={0.05} value={strength} onChange={(e) => setStrength(parseFloat(e.target.value))} className="w-full accent-sky-500" />
                <div className="flex justify-between text-[10px] text-surface-600 mt-1"><span>Subtle</span><span>Dramatic</span></div>
              </div>
            </div>

            {/* Quick edits */}
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Quick Edits</h3>
              <div className="flex flex-wrap gap-1.5">
                {EDIT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setPrompt(preset.prompt)}
                    className="px-2.5 py-1.5 text-[11px] bg-surface-800 text-surface-400 rounded-md hover:text-white hover:bg-surface-700 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Side-by-side comparison */}
          <div className="lg:col-span-9 space-y-4">
            <div className="card !p-4">
              <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
                Describe your edit
              </label>
              <div className="flex gap-3">
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the changes you want... e.g. 'make the sky dramatic with storm clouds'" className="input-field min-h-[60px] resize-none text-sm flex-1" />
                <button onClick={handleEdit} disabled={processing || !sourceImage || !prompt.trim()} className="btn-primary bg-sky-600 hover:bg-sky-500 self-end">
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PenTool className="w-4 h-4" /> Edit</>}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Source */}
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Original</h3>
                {sourceImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-surface-700">
                    <img src={sourceImage} alt="Source" className="w-full" />
                    <button onClick={() => { setSourceImage(null); setResult(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white text-xs">Change</button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()} className="w-full aspect-[4/3] border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-sky-500/50 transition-colors">
                    <Upload className="w-8 h-8 text-surface-500 mb-2" /><span className="text-sm text-surface-400">Upload image to edit</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </div>

              {/* Result */}
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Edited</h3>
                {result ? (
                  <div className="relative rounded-xl overflow-hidden border border-surface-700">
                    <img src={result} alt="Edited" className="w-full" />
                    <div className="absolute bottom-2 right-2 flex gap-1.5">
                      <button onClick={useResultAsSource} className="p-1.5 bg-black/60 rounded-lg text-white text-xs hover:bg-black/80 flex items-center gap-1" title="Use as new source">
                        <ArrowLeftRight className="w-3 h-3" /> Iterate
                      </button>
                      <a href={result} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-black/60 rounded-lg text-white text-xs hover:bg-black/80">
                        <Download className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : processing ? (
                  <div className="aspect-[4/3] rounded-xl border border-surface-700 flex flex-col items-center justify-center bg-surface-900">
                    <Loader2 className="w-8 h-8 text-sky-400 animate-spin mb-2" /><p className="text-xs text-surface-400">Editing...</p>
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-surface-800 flex items-center justify-center">
                    <p className="text-sm text-surface-600">Result appears here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Edit history */}
            {history.length > 1 && (
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Edit History</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {history.map((url, i) => (
                    <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-surface-700 flex-shrink-0 cursor-pointer hover:border-sky-500 transition-colors bg-gradient-to-br from-sky-900/20 to-surface-800" />
                  ))}
                </div>
              </div>
            )}

            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
