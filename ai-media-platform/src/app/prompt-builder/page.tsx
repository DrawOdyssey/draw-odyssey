"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Wand2, Sparkles, Loader2, Copy, Check, ArrowRight,
  Image as ImageIcon, Video, Lightbulb, RefreshCw, Zap,
} from "lucide-react";

const STYLE_PRESETS = [
  { id: "cinematic", label: "Cinematic", emoji: "🎬" },
  { id: "photorealistic", label: "Photorealistic", emoji: "📸" },
  { id: "anime", label: "Anime", emoji: "🎌" },
  { id: "oil-painting", label: "Oil Painting", emoji: "🎨" },
  { id: "3d-render", label: "3D Render", emoji: "💎" },
  { id: "watercolor", label: "Watercolor", emoji: "🖌️" },
  { id: "pixel-art", label: "Pixel Art", emoji: "👾" },
  { id: "comic-book", label: "Comic Book", emoji: "💥" },
  { id: "noir", label: "Film Noir", emoji: "🕵️" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "🌆" },
  { id: "fantasy", label: "Fantasy", emoji: "🧙" },
  { id: "minimalist", label: "Minimalist", emoji: "⬜" },
];

const ENHANCEMENT_MODES = [
  { id: "enhance", label: "Enhance", desc: "Improve and detail your existing prompt" },
  { id: "expand", label: "Expand", desc: "Turn a short idea into a full detailed prompt" },
  { id: "variations", label: "Variations", desc: "Generate 3 different prompt variations" },
];

export default function PromptBuilderPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("enhance");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [targetType, setTargetType] = useState<"image" | "video">("image");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [variations, setVariations] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function toggleStyle(id: string) {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id].slice(0, 3)
    );
  }

  async function handleEnhance() {
    if (!input.trim()) return;
    setProcessing(true);
    setEnhancedPrompt("");
    setVariations([]);

    // Simulate AI enhancement (replace with real API call to Claude or GPT)
    setTimeout(() => {
      const styleText = selectedStyles
        .map((s) => STYLE_PRESETS.find((p) => p.id === s)?.label)
        .filter(Boolean)
        .join(", ");

      if (mode === "variations") {
        setVariations([
          `${input}, ${styleText || "cinematic"} style, dramatic lighting, highly detailed, 8k resolution, professional composition`,
          `${input}, ${styleText || "photorealistic"} aesthetic, golden hour light, shallow depth of field, masterful technique, award-winning`,
          `${input}, ${styleText || "artistic"} interpretation, vibrant colors, dynamic composition, trending on artstation, ultra detailed`,
        ]);
      } else {
        const enhanced = `${input}${styleText ? `, ${styleText.toLowerCase()} style` : ""}. Highly detailed, professional quality, ${
          targetType === "image"
            ? "sharp focus, beautiful lighting, 8k resolution, masterful composition"
            : "smooth cinematic motion, dramatic camera movement, professional cinematography, 4K quality"
        }`;
        setEnhancedPrompt(enhanced);
      }
      setProcessing(false);
    }, 1500);
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Wand2 className="w-6 h-6 text-amber-400" />
            AI Prompt Builder
          </h1>
          <p className="text-surface-400 text-sm">
            Enhance your prompts with AI for better generation results. Free to use.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Config */}
          <div className="lg:col-span-1 space-y-4">
            {/* Target type */}
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Target</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTargetType("image")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${
                    targetType === "image" ? "bg-brand-600 text-white" : "bg-surface-800 text-surface-400"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> Image
                </button>
                <button
                  onClick={() => setTargetType("video")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${
                    targetType === "video" ? "bg-accent-600 text-white" : "bg-surface-800 text-surface-400"
                  }`}
                >
                  <Video className="w-4 h-4" /> Video
                </button>
              </div>
            </div>

            {/* Mode */}
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Mode</h3>
              <div className="space-y-1.5">
                {ENHANCEMENT_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      mode === m.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-surface-700/50 bg-surface-800/50 hover:border-surface-600"
                    }`}
                  >
                    <span className="text-sm font-medium text-white">{m.label}</span>
                    <p className="text-[11px] text-surface-500">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Style presets */}
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                Style (select up to 3)
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
                      selectedStyles.includes(style.id)
                        ? "border-amber-500 bg-amber-500/10 text-amber-300"
                        : "border-surface-700 text-surface-400 hover:text-white hover:border-surface-600"
                    }`}
                  >
                    {style.emoji} {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center+Right: Input/Output */}
          <div className="lg:col-span-2 space-y-4">
            {/* Input */}
            <div className="card !p-4">
              <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
                Your Prompt
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your basic idea here... e.g. 'a cat sitting on a throne'"
                className="input-field min-h-[100px] resize-none text-sm"
              />
              <div className="flex justify-end mt-3">
                <button onClick={handleEnhance} disabled={processing || !input.trim()} className="btn-primary bg-amber-600 hover:bg-amber-500">
                  {processing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Enhancing...</>
                  ) : (
                    <><Wand2 className="w-4 h-4" /> Enhance Prompt</>
                  )}
                </button>
              </div>
            </div>

            {/* Output */}
            {enhancedPrompt && (
              <div className="card !p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Enhanced Prompt
                  </h3>
                  <button
                    onClick={() => copyToClipboard(enhancedPrompt, "main")}
                    className="btn-ghost text-xs !py-1 !px-2"
                  >
                    {copied === "main" ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <div className="p-3 bg-surface-800 rounded-lg text-sm text-surface-200 leading-relaxed">
                  {enhancedPrompt}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleEnhance} className="btn-ghost text-xs">
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  <a href={`/ai-${targetType}?prompt=${encodeURIComponent(enhancedPrompt)}`} className="btn-primary text-xs">
                    <ArrowRight className="w-3.5 h-3.5" /> Use in {targetType === "image" ? "AI Images" : "AI Videos"}
                  </a>
                </div>
              </div>
            )}

            {/* Variations output */}
            {variations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Prompt Variations
                </h3>
                {variations.map((v, i) => (
                  <div key={i} className="card !p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-[10px] text-surface-500 uppercase tracking-wider">Variation {i + 1}</span>
                        <p className="text-sm text-surface-200 mt-1 leading-relaxed">{v}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(v, `var-${i}`)}
                        className="btn-ghost text-xs !py-1 !px-2 flex-shrink-0"
                      >
                        {copied === `var-${i}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!enhancedPrompt && variations.length === 0 && !processing && (
              <div className="card text-center !py-12">
                <Lightbulb className="w-10 h-10 mx-auto text-surface-600 mb-3" />
                <p className="text-sm text-surface-500 mb-1">Enhanced prompts will appear here</p>
                <p className="text-xs text-surface-600">Type a basic idea and click Enhance to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
