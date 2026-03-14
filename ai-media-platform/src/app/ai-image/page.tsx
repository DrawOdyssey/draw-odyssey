"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { IMAGE_MODELS, getCategories, type AIModel } from "@/lib/fal";
import {
  Wand2, Loader2, Sparkles, Download, Check, Image as ImageIcon,
  Settings2, Maximize2, ChevronDown, Grid3X3, Zap, Star, Copy,
} from "lucide-react";

const SIZES = [
  { id: "square", label: "1:1", w: 1024, h: 1024 },
  { id: "landscape_16_9", label: "16:9", w: 1344, h: 768 },
  { id: "portrait_9_16", label: "9:16", w: 768, h: 1344 },
  { id: "landscape_4_3", label: "4:3", w: 1152, h: 896 },
  { id: "portrait_3_4", label: "3:4", w: 896, h: 1152 },
];

const BADGE_STYLES: Record<string, string> = {
  new: "bg-green-500/20 text-green-300 border-green-500/30",
  popular: "bg-brand-500/20 text-brand-300 border-brand-500/30",
  fast: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  hd: "bg-accent-500/20 text-accent-300 border-accent-500/30",
};

export default function AIImagePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>(IMAGE_MODELS[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [numImages, setNumImages] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSettings, setShowSettings] = useState(false);

  const categories = ["All", ...getCategories(IMAGE_MODELS)];
  const filteredModels = activeCategory === "All"
    ? IMAGE_MODELS
    : IMAGE_MODELS.filter((m) => m.category === activeCategory);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          modelId: selectedModel.id,
          userId: "demo-user",
          size: selectedSize.id,
          numImages,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
      } else {
        setResults((prev) => [data.imageUrl, ...prev]);
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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-brand-400" />
            AI Image Generator
          </h1>
          <p className="text-surface-400 text-sm">
            {IMAGE_MODELS.length} models available &middot; Generate stunning images from text prompts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Model Selection */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                Select Model
              </h3>
              {/* Category filter */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                      activeCategory === cat
                        ? "bg-brand-600 text-white"
                        : "bg-surface-800 text-surface-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* Model list */}
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      selectedModel.id === model.id
                        ? "border-brand-500 bg-brand-500/10"
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
                        <span className="text-[10px] text-surface-500">
                          {model.creditCost}cr
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-surface-500 leading-snug">{model.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Prompt + Results */}
          <div className="lg:col-span-6 space-y-4">
            {/* Prompt */}
            <div className="card !p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Prompt
                </label>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 rounded-md transition-all ${
                    showSettings ? "bg-brand-600 text-white" : "text-surface-500 hover:text-white hover:bg-surface-800"
                  }`}
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                className="input-field min-h-[100px] resize-none text-sm"
              />

              {/* Settings panel */}
              {showSettings && (
                <div className="mt-3 p-3 bg-surface-800 rounded-lg space-y-3">
                  <div>
                    <label className="text-xs text-surface-400 mb-1.5 block">Aspect Ratio</label>
                    <div className="flex gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                            selectedSize.id === size.id
                              ? "border-brand-500 bg-brand-500/10 text-brand-300"
                              : "border-surface-700 text-surface-400 hover:text-white"
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-surface-400 mb-1.5 block">
                      Number of images: {numImages}
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={4}
                      value={numImages}
                      onChange={(e) => setNumImages(parseInt(e.target.value))}
                      className="w-full accent-brand-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3 text-xs text-surface-500">
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> {selectedSize.label}
                  </span>
                  <span>{selectedModel.creditCost * numImages} credits</span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim()}
                  className="btn-primary text-sm"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate</>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Generating spinner */}
            {generating && (
              <div className="card !p-8 text-center">
                <div className="relative w-14 h-14 mx-auto mb-3">
                  <div className="w-14 h-14 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
                  <Sparkles className="w-5 h-5 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-surface-400">Creating with {selectedModel.name}...</p>
              </div>
            )}

            {/* Results grid */}
            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Results ({results.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {results.map((url, i) => (
                    <div key={i} className="group relative rounded-xl overflow-hidden border border-surface-800 hover:border-surface-600 transition-all">
                      <img src={url} alt={`Generated ${i + 1}`} className="w-full aspect-square object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="flex gap-2">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 backdrop-blur-sm">
                            <Download className="w-4 h-4 text-white" />
                          </a>
                          <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 backdrop-blur-sm">
                            <Copy className="w-4 h-4 text-white" />
                          </button>
                          <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 backdrop-blur-sm" title="Upscale">
                            <Maximize2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {results.length === 0 && !generating && (
              <div className="card text-center !py-16">
                <ImageIcon className="w-10 h-10 mx-auto text-surface-600 mb-3" />
                <p className="text-sm text-surface-500 mb-1">Your generated images will appear here</p>
                <p className="text-xs text-surface-600">Type a prompt and click Generate to start</p>
              </div>
            )}
          </div>

          {/* Right: Model info + tips */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                Selected Model
              </h3>
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
                <div className="flex justify-between text-surface-400">
                  <span>Cost</span>
                  <span className="text-white font-medium">{selectedModel.creditCost} credit{selectedModel.creditCost > 1 ? "s" : ""} / image</span>
                </div>
                <div className="flex justify-between text-surface-400">
                  <span>Category</span>
                  <span className="text-white">{selectedModel.category}</span>
                </div>
                <div className="flex justify-between text-surface-400">
                  <span>Input</span>
                  <span className="text-white capitalize">{selectedModel.inputType}</span>
                </div>
              </div>
            </div>

            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                Prompt Tips
              </h3>
              <div className="space-y-2 text-xs text-surface-400">
                <p>&#x2022; Be specific about subject, setting, and lighting</p>
                <p>&#x2022; Include style keywords like &quot;cinematic&quot;, &quot;photorealistic&quot;, &quot;anime&quot;</p>
                <p>&#x2022; Mention camera details: &quot;35mm lens&quot;, &quot;shallow depth of field&quot;</p>
                <p>&#x2022; Add quality boosters: &quot;highly detailed&quot;, &quot;8k resolution&quot;</p>
                <p>&#x2022; Use negative terms sparingly at the end</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
