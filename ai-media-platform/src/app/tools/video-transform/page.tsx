"use client";

import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { VIDEO_TRANSFORM_MODELS, type AIModel } from "@/lib/fal";
import { Clapperboard, Upload, Loader2, Download, Sparkles, X, Video, Image as ImageIcon } from "lucide-react";

const TRANSFORM_STYLES = [
  { id: "anime", label: "Anime", desc: "Convert to anime style" },
  { id: "cinematic", label: "Cinematic", desc: "Film-quality grading" },
  { id: "painterly", label: "Painterly", desc: "Oil painting in motion" },
  { id: "noir", label: "Film Noir", desc: "Black & white drama" },
  { id: "cyberpunk", label: "Cyberpunk", desc: "Neon-soaked futurism" },
  { id: "fantasy", label: "Fantasy", desc: "Magical dreamscape" },
];

export default function VideoTransformPage() {
  const [sourceVideo, setSourceVideo] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>(VIDEO_TRANSFORM_MODELS[0]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLInputElement>(null);
  const styleRef = useRef<HTMLInputElement>(null);

  function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSourceVideo(URL.createObjectURL(file));
  }
  function handleStyleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setStyleImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleTransform() {
    if (!sourceVideo || !prompt.trim()) return;
    setProcessing(true);
    setError("");
    // Simulate API call
    setTimeout(() => {
      setResult(sourceVideo);
      setProcessing(false);
    }, 3000);
  }

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Clapperboard className="w-6 h-6 text-teal-400" />
            Video Transform
          </h1>
          <p className="text-surface-400 text-sm">
            Re-style existing videos with AI. Change the visual style while preserving motion. 10-12 credits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Config */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Model</h3>
              <div className="space-y-1.5">
                {VIDEO_TRANSFORM_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      selectedModel.id === model.id ? "border-teal-500 bg-teal-500/10" : "border-surface-700/50 bg-surface-800/50 hover:border-surface-600"
                    }`}
                  >
                    <div className="flex justify-between mb-0.5">
                      <span className="text-sm font-medium text-white">{model.name}</span>
                      <span className="text-xs text-surface-400">{model.creditCost}cr</span>
                    </div>
                    <p className="text-[11px] text-surface-500">{model.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Style reference */}
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Style Reference (optional)</h3>
              {styleImage ? (
                <div className="relative">
                  <img src={styleImage} alt="Style" className="w-full aspect-video object-cover rounded-lg border border-surface-700" />
                  <button onClick={() => setStyleImage(null)} className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full"><X className="w-3 h-3 text-white" /></button>
                </div>
              ) : (
                <button onClick={() => styleRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-teal-500/50 transition-colors">
                  <ImageIcon className="w-6 h-6 text-surface-500 mb-1" />
                  <span className="text-xs text-surface-400">Upload style image</span>
                </button>
              )}
              <input ref={styleRef} type="file" accept="image/*" className="hidden" onChange={handleStyleUpload} />
            </div>

            {/* Quick styles */}
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Quick Styles</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {TRANSFORM_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setPrompt(`${style.desc}, ${style.label.toLowerCase()} style, artistic`)}
                    className={`p-2 text-left rounded-lg border transition-all ${
                      prompt.includes(style.label.toLowerCase()) ? "border-teal-500 bg-teal-500/10" : "border-surface-700/50 hover:border-surface-600"
                    }`}
                  >
                    <span className="text-xs font-medium text-white">{style.label}</span>
                    <p className="text-[10px] text-surface-500">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center + Right: Upload + Result */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video upload */}
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Source Video</h3>
              {sourceVideo ? (
                <div className="relative">
                  <video src={sourceVideo} controls className="w-full rounded-lg border border-surface-700" />
                  <button onClick={() => { setSourceVideo(null); setResult(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white text-xs">Remove</button>
                </div>
              ) : (
                <button onClick={() => videoRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-surface-700 rounded-xl flex flex-col items-center justify-center hover:border-teal-500/50 transition-colors">
                  <Upload className="w-10 h-10 text-surface-500 mb-2" />
                  <span className="text-sm text-surface-400">Upload video to transform</span>
                  <span className="text-xs text-surface-600 mt-1">MP4, WebM up to 50MB</span>
                </button>
              )}
              <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
            </div>

            {/* Transform prompt */}
            <div className="card !p-4">
              <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">Transform Style</label>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the visual style you want applied to the video..." className="input-field min-h-[60px] resize-none text-sm" />
              <div className="flex justify-end mt-3">
                <button onClick={handleTransform} disabled={processing || !sourceVideo || !prompt.trim()} className="btn-primary bg-teal-600 hover:bg-teal-500">
                  {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Transforming...</> : <><Clapperboard className="w-4 h-4" /> Transform Video</>}
                </button>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div className="card !p-4">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Transformed Result</h3>
                <video src={result} controls className="w-full rounded-lg border border-surface-700" />
                <a href={result} target="_blank" rel="noopener noreferrer" className="btn-primary w-full mt-3 text-sm"><Download className="w-4 h-4" /> Download</a>
              </div>
            )}

            {processing && (
              <div className="card !p-10 text-center">
                <div className="relative w-14 h-14 mx-auto mb-3">
                  <div className="w-14 h-14 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
                  <Video className="w-5 h-5 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-surface-400">Transforming video style...</p>
                <p className="text-xs text-surface-600 mt-1">This may take 1-2 minutes</p>
              </div>
            )}

            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
