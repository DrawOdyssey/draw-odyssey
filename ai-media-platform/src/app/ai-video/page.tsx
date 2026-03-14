"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { VIDEO_MODELS, getCategories, type AIModel } from "@/lib/fal";
import {
  Video, Loader2, Sparkles, Download, Upload, Play, Image as ImageIcon,
  Settings2, Clock, ChevronDown, Zap,
} from "lucide-react";

const BADGE_STYLES: Record<string, string> = {
  new: "bg-green-500/20 text-green-300 border-green-500/30",
  popular: "bg-brand-500/20 text-brand-300 border-brand-500/30",
  fast: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  hd: "bg-accent-500/20 text-accent-300 border-accent-500/30",
};

export default function AIVideoPage() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>(VIDEO_MODELS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t2vModels = VIDEO_MODELS.filter((m) => m.category === "Text to Video");
  const i2vModels = VIDEO_MODELS.filter((m) => m.category === "Image to Video");
  const activeModels = mode === "text" ? t2vModels : i2vModels;

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleGenerate() {
    if (!prompt.trim()) return;
    if (mode === "image" && !uploadedImage) return;
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          modelId: selectedModel.id,
          userId: "demo-user",
          imageUrl: mode === "image" ? uploadedImage : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
      } else {
        setResults((prev) => [data.videoUrl, ...prev]);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Video className="w-6 h-6 text-accent-400" />
            AI Video Generator
          </h1>
          <p className="text-surface-400 text-sm">
            {VIDEO_MODELS.length} models &middot; Create videos from text prompts or images
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("text"); setSelectedModel(t2vModels[0]); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "text" ? "bg-accent-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Text to Video
          </button>
          <button
            onClick={() => { setMode("image"); setSelectedModel(i2vModels[0]); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "image" ? "bg-accent-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Image to Video
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Models */}
          <div className="lg:col-span-3">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                {mode === "text" ? "Text to Video Models" : "Image to Video Models"}
              </h3>
              <div className="space-y-1.5">
                {activeModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      selectedModel.id === model.id
                        ? "border-accent-500 bg-accent-500/10"
                        : "border-surface-700/50 bg-surface-800/50 hover:border-surface-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-white">{model.name}</span>
                      <div className="flex items-center gap-1.5">
                        {model.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${BADGE_STYLES[model.badge]}`}>
                            {model.badge.toUpperCase()}
                          </span>
                        )}
                        <span className="text-[10px] text-surface-500">{model.creditCost}cr</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-surface-500 leading-snug">{model.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Input + Results */}
          <div className="lg:col-span-6 space-y-4">
            {/* Image upload (for I2V) */}
            {mode === "image" && (
              <div className="card !p-4">
                <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
                  Source Image
                </label>
                {uploadedImage ? (
                  <div className="relative">
                    <img src={uploadedImage} alt="Upload" className="w-full max-h-64 object-contain rounded-lg border border-surface-700" />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white text-xs hover:bg-black/80"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed border-surface-700 rounded-xl text-center hover:border-surface-500 transition-colors"
                  >
                    <Upload className="w-8 h-8 mx-auto text-surface-500 mb-2" />
                    <span className="text-sm text-surface-400">Click to upload an image</span>
                    <p className="text-xs text-surface-600 mt-1">JPG, PNG up to 10MB</p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            )}

            {/* Prompt */}
            <div className="card !p-4">
              <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
                {mode === "text" ? "Describe your video" : "Motion prompt (describe the movement)"}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === "text"
                    ? "A slow cinematic drone shot over a misty mountain forest at dawn, golden light filtering through trees..."
                    : "Gentle wind blowing through hair, camera slowly zooming in, soft bokeh in background..."
                }
                className="input-field min-h-[80px] resize-none text-sm"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3 text-xs text-surface-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ~30-60s
                  </span>
                  <span>{selectedModel.creditCost} credits</span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim() || (mode === "image" && !uploadedImage)}
                  className="btn-accent text-sm"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Video className="w-4 h-4" /> Generate Video</>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>
            )}

            {generating && (
              <div className="card !p-10 text-center">
                <div className="relative w-14 h-14 mx-auto mb-3">
                  <div className="w-14 h-14 rounded-full border-2 border-accent-500/30 border-t-accent-500 animate-spin" />
                  <Video className="w-5 h-5 text-accent-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-surface-400">Creating video with {selectedModel.name}...</p>
                <p className="text-xs text-surface-600 mt-1">This may take 30-60 seconds</p>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Results ({results.length})
                </h3>
                {results.map((url, i) => (
                  <div key={i} className="card !p-3">
                    <video src={url} controls className="w-full rounded-lg border border-surface-700" />
                    <div className="flex justify-end mt-2">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs">
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.length === 0 && !generating && (
              <div className="card text-center !py-16">
                <Video className="w-10 h-10 mx-auto text-surface-600 mb-3" />
                <p className="text-sm text-surface-500 mb-1">Your generated videos will appear here</p>
                <p className="text-xs text-surface-600">
                  {mode === "text" ? "Type a prompt and click Generate" : "Upload an image, add a motion prompt, and click Generate"}
                </p>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Selected Model</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-semibold text-white">{selectedModel.name}</span>
                {selectedModel.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${BADGE_STYLES[selectedModel.badge]}`}>
                    {selectedModel.badge.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-sm text-surface-400 mb-3">{selectedModel.description}</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-surface-400"><span>Cost</span><span className="text-white font-medium">{selectedModel.creditCost} credits</span></div>
                <div className="flex justify-between text-surface-400"><span>Input</span><span className="text-white capitalize">{selectedModel.inputType}</span></div>
                <div className="flex justify-between text-surface-400"><span>Output</span><span className="text-white">~5s video clip</span></div>
              </div>
            </div>

            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Video Tips</h3>
              <div className="space-y-2 text-xs text-surface-400">
                <p>&#x2022; Describe camera movement: &quot;slow pan&quot;, &quot;zoom in&quot;, &quot;tracking shot&quot;</p>
                <p>&#x2022; Specify mood: &quot;cinematic&quot;, &quot;dreamy&quot;, &quot;dramatic&quot;</p>
                <p>&#x2022; Keep prompts focused on one scene</p>
                <p>&#x2022; For I2V: use high-quality source images</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
