"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  FolderOpen,
  Image as ImageIcon,
  Video,
  Grid3X3,
  List,
  Search,
  Trash2,
  Download,
  Film,
} from "lucide-react";
import Link from "next/link";

type Filter = "all" | "image" | "video";

export default function LibraryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  // Placeholder items - will be replaced with real data
  const items: any[] = [];

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <FolderOpen className="w-6 h-6 text-accent-400" />
              Media Library
            </h1>
            <p className="text-surface-400">
              All your generated images and videos in one place.
            </p>
          </div>
          <Link href="/generate" className="btn-primary text-sm">
            Generate New
          </Link>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {(["all", "image", "video"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-brand-600 text-white"
                    : "bg-surface-800 text-surface-400 hover:text-white"
                }`}
              >
                {f === "all" && <Grid3X3 className="w-3.5 h-3.5" />}
                {f === "image" && <ImageIcon className="w-3.5 h-3.5" />}
                {f === "video" && <Video className="w-3.5 h-3.5" />}
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "all" && "s"}
                {f !== "all" && "s"}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by prompt..."
              className="input-field !pl-10"
            />
          </div>

          <div className="flex gap-1 bg-surface-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid" ? "bg-surface-700 text-white" : "text-surface-500"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list" ? "bg-surface-700 text-white" : "text-surface-500"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="card text-center py-20">
            <FolderOpen className="w-12 h-12 mx-auto text-surface-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Your library is empty
            </h3>
            <p className="text-surface-400 text-sm mb-6 max-w-md mx-auto">
              Start generating images and videos — they&apos;ll appear here automatically.
              You can then drag them into the video editor.
            </p>
            <Link href="/generate" className="btn-primary inline-flex text-sm">
              Generate Your First Media
            </Link>
          </div>
        )}

        {/* Grid of items (will render when data exists) */}
        {items.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden border border-surface-800 hover:border-surface-600 transition-all">
                <div className="aspect-video bg-surface-800">
                  {item.type === "image" ? (
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs text-surface-200 line-clamp-2 mb-2">{item.prompt}</p>
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors">
                        <Download className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button className="p-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors">
                        <Film className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button className="p-1.5 bg-red-500/20 rounded-md hover:bg-red-500/30 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    item.type === "image" ? "bg-brand-500/80 text-white" : "bg-accent-500/80 text-white"
                  }`}>
                    {item.type === "image" ? "IMG" : "VID"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
