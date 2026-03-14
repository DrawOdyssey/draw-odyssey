"use client";

import AppShell from "@/components/layout/AppShell";
import {
  Film,
  ExternalLink,
  Play,
  Layers,
  Type,
  Music,
  Palette,
  Scissors,
  Download,
  Plus,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";

export default function EditorPage() {
  return (
    <AppShell>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-surface-800 bg-surface-900/50">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-green-400" />
            <span className="text-sm font-semibold text-white">Video Editor</span>
            <span className="text-xs text-surface-500 bg-surface-800 px-2 py-0.5 rounded">
              Powered by OpenReel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost text-xs">
              <FolderOpen className="w-4 h-4" /> Load Project
            </button>
            <button className="btn-primary text-xs !py-1.5">
              <Download className="w-3.5 h-3.5" /> Export Video
            </button>
          </div>
        </div>

        {/* Editor layout */}
        <div className="flex-1 grid grid-cols-5 gap-px bg-surface-800">
          {/* Media panel */}
          <div className="col-span-1 bg-surface-950 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                Media
              </h3>
              <Link href="/library" className="text-xs text-brand-400 hover:text-brand-300">
                Library
              </Link>
            </div>
            <div className="space-y-2">
              <button className="w-full p-4 border-2 border-dashed border-surface-700 rounded-lg text-center hover:border-surface-500 transition-colors">
                <Plus className="w-5 h-5 mx-auto text-surface-500 mb-1" />
                <span className="text-xs text-surface-500">Drop media here</span>
              </button>
              <p className="text-xs text-surface-600 text-center mt-4">
                Generate media first, then drag it here from your library
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="col-span-3 bg-surface-950 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl aspect-video bg-surface-900 rounded-xl border border-surface-800 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mb-4">
                  <Play className="w-7 h-7 text-surface-500 ml-1" />
                </div>
                <p className="text-sm text-surface-500 mb-1">No clips on timeline</p>
                <p className="text-xs text-surface-600">
                  Add media from your library to start editing
                </p>
              </div>
            </div>

            {/* Mini toolbar */}
            <div className="flex items-center justify-center gap-1 py-2 border-t border-surface-800">
              {[
                { icon: Scissors, label: "Split" },
                { icon: Type, label: "Text" },
                { icon: Music, label: "Audio" },
                { icon: Palette, label: "Color" },
                { icon: Layers, label: "Layers" },
              ].map((tool) => (
                <button
                  key={tool.label}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-surface-500 hover:text-white hover:bg-surface-800 transition-all"
                  title={tool.label}
                >
                  <tool.icon className="w-4 h-4" />
                  <span className="text-[10px]">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Properties panel */}
          <div className="col-span-1 bg-surface-950 p-4 overflow-y-auto">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
              Properties
            </h3>
            <p className="text-xs text-surface-600">
              Select a clip on the timeline to edit its properties.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="h-48 bg-surface-900 border-t border-surface-800">
          <div className="flex items-center justify-between px-4 py-2 border-b border-surface-800">
            <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Timeline
            </span>
            <div className="flex items-center gap-2 text-xs text-surface-500">
              <span>00:00:00</span>
              <span>/</span>
              <span>00:00:00</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {["Video 1", "Video 2", "Audio", "Text"].map((track) => (
              <div key={track} className="flex items-center gap-3">
                <span className="text-[10px] text-surface-500 w-14 flex-shrink-0">
                  {track}
                </span>
                <div className="flex-1 h-8 bg-surface-800 rounded-md border border-surface-700/50" />
              </div>
            ))}
          </div>
        </div>

        {/* OpenReel integration note */}
        <div className="px-4 py-2 bg-surface-900/50 border-t border-surface-800 flex items-center justify-center gap-2">
          <ExternalLink className="w-3.5 h-3.5 text-surface-500" />
          <span className="text-xs text-surface-500">
            Full editing powered by{" "}
            <a
              href="https://github.com/Augani/openreel-video"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              OpenReel Video
            </a>
            {" "}&mdash; MIT Licensed, browser-based video editor
          </span>
        </div>
      </div>
    </AppShell>
  );
}
