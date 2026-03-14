"use client";

import AppShell from "@/components/layout/AppShell";
import { Newspaper, Sparkles, Video, Image as ImageIcon, Brain, Zap, ExternalLink } from "lucide-react";

const NEWS_ITEMS = [
  {
    date: "March 2026",
    title: "Draw Odyssey Launches Phase 3: Advanced Creative Tools",
    description: "Consistent Character generation, Style Transfer, Smart Image Editor, Video Transform, and Pose & Depth Control are now live. Train AI to replicate your characters across scenes.",
    tags: ["Feature", "Tools"],
    icon: Sparkles,
    color: "text-violet-400",
  },
  {
    date: "March 2026",
    title: "AI Agents: Automated Multi-Step Workflows",
    description: "Introducing 6 pre-built AI agents that combine multiple tools into one-click workflows. Social Media Pack, Character Sheet Generator, Product Showcase, and more.",
    tags: ["Feature", "Agents"],
    icon: Zap,
    color: "text-indigo-400",
  },
  {
    date: "March 2026",
    title: "30+ Models Now Available",
    description: "We've expanded our model library to include FLUX Pro Ultra, Stable Diffusion 3.5, Kling v2, Wan 2.1, HunyuanVideo, Recraft V3, Ideogram 2, and many more. New models added weekly.",
    tags: ["Models"],
    icon: ImageIcon,
    color: "text-brand-400",
  },
  {
    date: "March 2026",
    title: "Video Generation Expansion",
    description: "8 video models now available including Text-to-Video and Image-to-Video workflows. Create 5-15 second clips with Kling, Minimax, Wan, CogVideoX, and more.",
    tags: ["Feature", "Video"],
    icon: Video,
    color: "text-accent-400",
  },
  {
    date: "March 2026",
    title: "LoRA Training: Create Custom AI Models",
    description: "Train your own AI models using just 5-10 images. Flux LoRA, Fast Flux LoRA (2-minute training on H100 GPUs), and SDXL LoRA trainers now available.",
    tags: ["Feature", "Training"],
    icon: Brain,
    color: "text-purple-400",
  },
  {
    date: "March 2026",
    title: "Community Gallery & API Platform",
    description: "Share your creations with the community. Browse trending and top-rated content. Plus, integrate Draw Odyssey into your own apps with our REST API.",
    tags: ["Feature", "Community"],
    icon: Sparkles,
    color: "text-cyan-400",
  },
  {
    date: "March 2026",
    title: "Draw Odyssey is Born",
    description: "Initial launch with AI image generation, AI video generation, credit-based billing, media library, and video editor integration. The journey begins.",
    tags: ["Launch"],
    icon: Sparkles,
    color: "text-emerald-400",
  },
];

export default function NewsPage() {
  return (
    <AppShell>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-amber-400" />
            News &amp; Updates
          </h1>
          <p className="text-surface-400 text-sm">
            Latest features, model updates, and announcements from Draw Odyssey.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-surface-800" />

          <div className="space-y-6">
            {NEWS_ITEMS.map((item, i) => (
              <div key={i} className="relative flex gap-5">
                {/* Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-surface-900 border-2 border-surface-700 flex items-center justify-center">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="card-hover flex-1 !pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-surface-500 font-medium uppercase tracking-wider">
                      {item.date}
                    </span>
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-800 text-surface-400 border border-surface-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
