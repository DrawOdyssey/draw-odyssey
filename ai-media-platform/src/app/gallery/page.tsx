"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Globe, Heart, MessageCircle, Share2, Image as ImageIcon, Video,
  TrendingUp, Clock, Award, Filter, Search, Eye,
} from "lucide-react";

type SortBy = "trending" | "latest" | "top";
type FilterType = "all" | "image" | "video";

// Placeholder gallery items (will be replaced with real data from Supabase)
const PLACEHOLDER_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: `item-${i}`,
  type: i % 3 === 0 ? "video" as const : "image" as const,
  url: "",
  prompt: [
    "A mystical forest with bioluminescent trees and floating crystals",
    "Cyberpunk cityscape at night with neon reflections on wet streets",
    "An astronaut floating through a nebula made of flowers",
    "Ancient temple ruins overgrown with glowing alien vegetation",
    "A steampunk airship navigating through thunderclouds",
    "Underwater palace with jellyfish chandeliers and coral architecture",
  ][i % 6],
  model: ["FLUX Pro Ultra", "Stable Diffusion 3.5", "Wan 2.1", "Kling v2", "FLUX Dev", "Recraft V3"][i % 6],
  user: { name: `creator_${i + 1}`, avatar: null },
  likes: Math.floor(Math.random() * 200) + 10,
  views: Math.floor(Math.random() * 2000) + 100,
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
}));

export default function GalleryPage() {
  const [sortBy, setSortBy] = useState<SortBy>("trending");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Globe className="w-6 h-6 text-cyan-400" />
            Community Gallery
          </h1>
          <p className="text-surface-400 text-sm">
            Explore what creators are making with Draw Odyssey. Get inspired, share your work.
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Sort */}
          <div className="flex gap-1.5">
            {([
              { id: "trending", label: "Trending", icon: TrendingUp },
              { id: "latest", label: "Latest", icon: Clock },
              { id: "top", label: "Top", icon: Award },
            ] as const).map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  sortBy === s.id ? "bg-cyan-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
                }`}
              >
                <s.icon className="w-3.5 h-3.5" /> {s.label}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex gap-1.5">
            {([
              { id: "all", label: "All" },
              { id: "image", label: "Images" },
              { id: "video", label: "Videos" },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  filterType === f.id ? "bg-surface-700 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts, models, creators..."
              className="input-field !pl-10 !py-2 text-sm"
            />
          </div>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {PLACEHOLDER_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border border-surface-800 hover:border-surface-600 transition-all cursor-pointer bg-surface-900"
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-gradient-to-br from-surface-800 to-surface-700 relative">
                {/* Placeholder gradient — replace with actual images */}
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(${45 + parseInt(item.id.split('-')[1]) * 30}deg, 
                      hsl(${parseInt(item.id.split('-')[1]) * 45}, 60%, 20%), 
                      hsl(${parseInt(item.id.split('-')[1]) * 45 + 60}, 50%, 30%))`,
                  }}
                />

                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                    item.type === "video" ? "bg-accent-500/80 text-white" : "bg-brand-500/80 text-white"
                  }`}>
                    {item.type === "video" ? "VID" : "IMG"}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <p className="text-xs text-surface-200 line-clamp-2 mb-2">{item.prompt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-surface-400">{item.model}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-surface-300">
                        <Heart className="w-3 h-3" /> {item.likes}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-surface-300">
                        <Eye className="w-3 h-3" /> {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info bar */}
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-surface-700 flex-shrink-0" />
                  <span className="text-xs text-surface-400 truncate">{item.user.name}</span>
                </div>
                <div className="flex items-center gap-1 text-surface-500">
                  <Heart className="w-3 h-3" />
                  <span className="text-[10px]">{item.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-8">
          <button className="btn-secondary text-sm">Load More</button>
        </div>
      </div>
    </AppShell>
  );
}
