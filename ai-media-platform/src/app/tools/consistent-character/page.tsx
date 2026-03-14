"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  UserCircle, Upload, Loader2, Download, Sparkles, X,
  RefreshCw, Grid3X3, Info, Plus, Image as ImageIcon,
} from "lucide-react";

const SCENE_PRESETS = [
  "Portrait photo, studio lighting, neutral background",
  "Outdoor scene, golden hour, natural lighting",
  "Professional headshot, corporate setting",
  "Casual pose, urban street photography",
  "Action shot, dynamic pose, dramatic lighting",
  "Fantasy setting, magical atmosphere, cinematic",
  "Anime style, colorful background, expressive",
  "Vintage film look, warm tones, soft focus",
];

export default function ConsistentCharacterPage() {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [numVariations, setNumVariations] = useState(4);
  const [strength, setStrength] = useState(0.7);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setReferenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleGenerate() {
    if (!referenceImage || !prompt.trim()) return;
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/generate/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: "fal-ai/ip-adapter-face-id",
          imageUrl: referenceImage,
          prompt,
          userId: "demo-user",
          params: { strength, numVariations },
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Generation failed");
      else setResults((prev) => [...(data.imageUrls || [data.imageUrl]), ...prev]);
    } catch { setError("Network error"); }
    finally { setGenerating(false); }
  }

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <UserCircle className="w-6 h-6 text-violet-400" />
            Consistent Character
          </h1>
          <p className="text-surface-400 text-sm">
            Upload a reference face and generate the same character in any scene, pose, or style. 2 credits per generation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Reference + Controls */}
          <div className="lg:col-span-3 space-y-4">
            {/* Reference image */}
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                Reference Face
              </h3>
              {referenceImage ? (
                <div className="relative">
                  <img src={referenceImage} alt="Reference" className="w-full aspect-square object-cover rounded-lg border border-surface-700" />
                  <button onClick={() => setReferenceImage(null)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-violet-500/50 transition-colors">
                  <Upload className="w-8 h-8 text-surface-500 mb-2" />
                  <span className="text-sm text-surface-400">Upload face photo</span>
                  <span className="text-xs text-surface-600 mt-1">Clear, front-facing works best</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </div>

            {/* Controls */}
            <div className="card !p-4 space-y-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Controls</h3>
              <div>
                <label className="text-xs text-surface-400 mb-1 block">Identity Strength: {Math.round(strength * 100)}%</label>
                <input type="range" min={0.3} max={1} step={0.05} value={strength} onChange={(e) => setStrength(parseFloat(e.target.value))} className="w-full accent-violet-500" />
                <div className="flex justify-between text-[10px] text-surface-600 mt-1">
                  <span>More creative</span><span>More accurate</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-surface-400 mb-1 block">Variations: {numVariations}</label>
                <input type="range" min={1} max={8} value={numVariations} onChange={(e) => setNumVariations(parseInt(e.target.value))} className="w-full accent-violet-500" />
              </div>
            </div>

            <div className="p-3 bg-violet-500/5 border border-violet-500/20 rounded-xl">
              <div className="flex gap-2 text-xs text-surface-400">
                <Info className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-violet-300 mb-1">Best practices</p>
                  <p>&#x2022; Use a clear, well-lit face photo</p>
                  <p>&#x2022; Front-facing angles work best</p>
                  <p>&#x2022; One face per reference image</p>
                  <p>&#x2022; Higher strength = more faithful likeness</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Prompt + Results */}
          <div className="lg:col-span-9 space-y-4">
            {/* Prompt */}
            <div className="card !p-4">
              <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
                Scene Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the scene, pose, and style you want your character in..."
                className="input-field min-h-[80px] resize-none text-sm"
              />

              {/* Quick presets */}
              <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                {SCENE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setPrompt(preset)}
                    className="px-2.5 py-1 text-[11px] bg-surface-800 text-surface-400 rounded-md hover:text-white hover:bg-surface-700 transition-all"
                  >
                    {preset.split(",")[0]}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-500">{numVariations * 2} credits total</span>
                <button onClick={handleGenerate} disabled={generating || !referenceImage || !prompt.trim()} className="btn-primary bg-violet-600 hover:bg-violet-500">
                  {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate {numVariations} Variations</>}
                </button>
              </div>
            </div>

            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}

            {generating && (
              <div className="card !p-10 text-center">
                <div className="relative w-14 h-14 mx-auto mb-3">
                  <div className="w-14 h-14 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                  <UserCircle className="w-5 h-5 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-surface-400">Generating {numVariations} character variations...</p>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                  Generated Characters ({results.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {results.map((url, i) => (
                    <div key={i} className="group relative rounded-xl overflow-hidden border border-surface-800 hover:border-surface-600 transition-all">
                      <div className="aspect-square bg-gradient-to-br from-violet-900/30 to-surface-800" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <div className="flex gap-1.5">
                          <button className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 backdrop-blur-sm"><Download className="w-3.5 h-3.5 text-white" /></button>
                          <button className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 backdrop-blur-sm"><ImageIcon className="w-3.5 h-3.5 text-white" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.length === 0 && !generating && (
              <div className="card text-center !py-16">
                <UserCircle className="w-12 h-12 mx-auto text-surface-600 mb-3" />
                <p className="text-sm text-surface-500 mb-1">Upload a reference face and describe a scene</p>
                <p className="text-xs text-surface-600">Your character will be generated in the described setting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
