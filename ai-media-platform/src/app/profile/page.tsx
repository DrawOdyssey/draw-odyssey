"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  User, Settings, Image as ImageIcon, Video, Heart, Eye,
  Calendar, Award, Coins, Grid3X3, BarChart3, Edit3, Share2,
  ExternalLink, Globe,
} from "lucide-react";

type Tab = "creations" | "liked" | "stats";

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("creations");
  const [isPublic, setIsPublic] = useState(true);

  // Placeholder stats
  const stats = {
    totalCreations: 0,
    images: 0,
    videos: 0,
    totalLikes: 0,
    totalViews: 0,
    creditsUsed: 0,
    memberSince: "March 2026",
    plan: "Free",
  };

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Profile header */}
        <div className="card !p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-white">Your Profile</h1>
                {isPublic && (
                  <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                    <Globe className="w-3 h-3" /> Public
                  </span>
                )}
              </div>
              <p className="text-sm text-surface-400 mb-2">user@example.com</p>
              <div className="flex flex-wrap gap-4 text-xs text-surface-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {stats.memberSince}</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {stats.plan} Plan</span>
                <span className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" /> {stats.totalCreations} creations</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {stats.totalLikes} likes received</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <a href="/profile/settings" className="btn-secondary text-xs">
                <Settings className="w-3.5 h-3.5" /> Settings
              </a>
              <button className="btn-ghost text-xs">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Images", value: stats.images, icon: ImageIcon, color: "text-brand-400" },
            { label: "Videos", value: stats.videos, icon: Video, color: "text-accent-400" },
            { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-cyan-400" },
            { label: "Credits Used", value: stats.creditsUsed, icon: Coins, color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="card !p-4 text-center">
              <s.icon className={`w-5 h-5 mx-auto ${s.color} mb-1.5`} />
              <div className="text-xl font-bold text-white">{s.value}</div>
              <span className="text-[10px] text-surface-500 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { id: "creations" as const, label: "My Creations", icon: Grid3X3 },
            { id: "liked" as const, label: "Liked", icon: Heart },
            { id: "stats" as const, label: "Analytics", icon: BarChart3 },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? "bg-brand-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "creations" && (
          <div className="card text-center !py-20">
            <ImageIcon className="w-12 h-12 mx-auto text-surface-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No creations yet</h3>
            <p className="text-sm text-surface-400 mb-6">Start generating to build your portfolio.</p>
            <a href="/ai-image" className="btn-primary inline-flex text-sm">
              <Sparkles className="w-4 h-4" /> Start Creating
            </a>
          </div>
        )}

        {tab === "liked" && (
          <div className="card text-center !py-20">
            <Heart className="w-12 h-12 mx-auto text-surface-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No liked items</h3>
            <p className="text-sm text-surface-400 mb-6">Browse the community gallery and like your favorites.</p>
            <a href="/gallery" className="btn-primary inline-flex text-sm">
              <Globe className="w-4 h-4" /> Browse Gallery
            </a>
          </div>
        )}

        {tab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Generation Activity</h3>
              <div className="h-48 flex items-end justify-between gap-1 px-2">
                {Array.from({ length: 14 }, (_, i) => {
                  const h = Math.random() * 80 + 5;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-brand-600/40 rounded-t" style={{ height: `${h}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-surface-600 mt-2 px-2">
                <span>14 days ago</span><span>Today</span>
              </div>
            </div>

            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Credit Usage</h3>
              <div className="space-y-3">
                {[
                  { label: "Image Generation", pct: 45, color: "bg-brand-500" },
                  { label: "Video Generation", pct: 25, color: "bg-accent-500" },
                  { label: "Upscaling & Tools", pct: 15, color: "bg-green-500" },
                  { label: "LoRA Training", pct: 10, color: "bg-purple-500" },
                  { label: "Agents", pct: 5, color: "bg-indigo-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-surface-400">{item.label}</span>
                      <span className="text-surface-300">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Top Models Used</h3>
              <div className="space-y-2">
                {["FLUX Pro 1.1", "FLUX Dev", "Wan 2.1", "Kling v2", "AuraSR 4x"].map((m, i) => (
                  <div key={m} className="flex items-center justify-between p-2 bg-surface-800/50 rounded-lg">
                    <span className="text-sm text-white">{m}</span>
                    <span className="text-xs text-surface-400">{Math.floor(Math.random() * 50)} uses</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">Account Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-surface-400">Current Plan</span><span className="text-white font-medium">{stats.plan}</span></div>
                <div className="flex justify-between"><span className="text-surface-400">Credits Balance</span><span className="text-yellow-400 font-medium">50</span></div>
                <div className="flex justify-between"><span className="text-surface-400">Total Spent</span><span className="text-white">$0.00</span></div>
                <div className="flex justify-between"><span className="text-surface-400">API Calls (this month)</span><span className="text-white">0</span></div>
                <div className="flex justify-between"><span className="text-surface-400">LoRA Models</span><span className="text-white">0</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
