import AppShell from "@/components/layout/AppShell";
import {
  Image as ImageIcon,
  Video,
  Coins,
  TrendingUp,
  Wand2,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to Draw Odyssey
          </h1>
          <p className="text-surface-400">
            Generate images and videos with AI, then edit them together.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Credits Balance", value: "--", icon: Coins, color: "text-yellow-400", bg: "bg-yellow-500/10" },
            { label: "Images Created", value: "--", icon: ImageIcon, color: "text-brand-400", bg: "bg-brand-500/10" },
            { label: "Videos Created", value: "--", icon: Video, color: "text-accent-400", bg: "bg-accent-500/10" },
            { label: "Projects", value: "--", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-surface-400">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/generate" className="card-hover group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-0.5">Generate Media</h3>
                <p className="text-sm text-surface-400">Create images or videos from text</p>
              </div>
              <ArrowRight className="w-5 h-5 text-surface-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link href="/library" className="card-hover group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-0.5">Media Library</h3>
                <p className="text-sm text-surface-400">Browse your generated assets</p>
              </div>
              <ArrowRight className="w-5 h-5 text-surface-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link href="/editor" className="card-hover group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-0.5">Video Editor</h3>
                <p className="text-sm text-surface-400">Combine clips on the timeline</p>
              </div>
              <ArrowRight className="w-5 h-5 text-surface-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Recent activity */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-surface-400" />
            Recent Activity
          </h2>
          <div className="text-center py-12 text-surface-500">
            <Wand2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No activity yet. Start by generating your first image!</p>
            <Link href="/generate" className="btn-primary text-sm mt-4 inline-flex">
              Generate Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
