"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { IMAGE_MODELS, VIDEO_MODELS } from "@/lib/fal";
import {
  Wand2,
  Image as ImageIcon,
  Video,
  Loader2,
  Sparkles,
  Download,
  Check,
} from "lucide-react";

type Tab = "image" | "video";

export default function GeneratePage() {
  const [tab, setTab] = useState<Tab>("image");
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(IMAGE_MODELS[0].id);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const models = tab === "image" ? IMAGE_MODELS : VIDEO_MODELS;

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/generate/${tab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          modelId: selectedModel,
          userId: "demo-user", // Replace with actual auth
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
      } else {
        setResult(tab === "image" ? data.imageUrl : data.videoUrl);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <Wand2 className="w-6 h-6 text-brand-400" />
            Generate Media
          </h1>
          <p className="text-surface-400">
            Describe what you want to create and choose a model.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setTab("image"); setSelectedModel(IMAGE_MODELS[0].id); setResult(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "image"
                ? "bg-brand-600 text-white"
                : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Image
          </button>
          <button
            onClick={() => { setTab("video"); setSelectedModel(VIDEO_MODELS[0].id); setResult(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "video"
                ? "bg-accent-600 text-white"
                : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" /> Video
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-1 space-y-5">
            {/* Model selector */}
            <div className="card">
              <label className="label">Model</label>
              <div className="space-y-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedModel === model.id
                        ? "border-brand-500 bg-brand-500/10"
                        : "border-surface-700 bg-surface-800 hover:border-surface-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">
                        {model.name}
                      </span>
                      <span className="text-xs text-surface-400">
                        {model.creditCost} {model.creditCost === 1 ? "credit" : "credits"}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500">
                      {model.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Prompt + Result */}
          <div className="lg:col-span-2 space-y-5">
            {/* Prompt input */}
            <div className="card">
              <label className="label">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  tab === "image"
                    ? "A serene mountain lake at sunset with pink clouds reflecting on the water..."
                    : "A slow cinematic drone shot over a misty forest at dawn..."
                }
                className="input-field min-h-[120px] resize-none"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-surface-500">
                  {prompt.length} characters
                </span>
                <button
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim()}
                  className="btn-primary"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate {tab === "image" ? "Image" : "Video"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Generation Complete
                  </span>
                  <a
                    href={result}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-xs"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
                {tab === "image" ? (
                  <img
                    src={result}
                    alt="Generated image"
                    className="w-full rounded-lg border border-surface-700"
                  />
                ) : (
                  <video
                    src={result}
                    controls
                    className="w-full rounded-lg border border-surface-700"
                  />
                )}
              </div>
            )}

            {/* Generating placeholder */}
            {generating && (
              <div className="card">
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-surface-400 mt-4 text-sm">
                    {tab === "image"
                      ? "Generating your image..."
                      : "Generating your video (this may take 30-60 seconds)..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
