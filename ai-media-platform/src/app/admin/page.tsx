"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  ShieldCheck, Users, BarChart3, CreditCard, Image as ImageIcon,
  Video, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign,
  Activity, Server, Clock, AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const metrics = {
    totalUsers: 0,
    usersGrowth: 0,
    activeToday: 0,
    totalRevenue: "$0",
    revenueGrowth: 0,
    totalGenerations: 0,
    genGrowth: 0,
    creditsConsumed: 0,
    apiCalls: 0,
    failureRate: "0%",
  };

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-red-400" />
              Admin Dashboard
            </h1>
            <p className="text-surface-400 text-sm">Platform overview and management</p>
          </div>
          <div className="flex gap-1.5 bg-surface-800 rounded-lg p-1">
            {["24h", "7d", "30d", "all"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  timeRange === range ? "bg-surface-700 text-white" : "text-surface-400 hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Users", value: metrics.totalUsers, change: metrics.usersGrowth, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Revenue", value: metrics.totalRevenue, change: metrics.revenueGrowth, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Generations", value: metrics.totalGenerations, change: metrics.genGrowth, icon: ImageIcon, color: "text-brand-400", bg: "bg-brand-500/10" },
            { label: "Active Today", value: metrics.activeToday, change: 0, icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10" },
          ].map((m) => (
            <div key={m.label} className="card !p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-surface-400">{m.label}</span>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{m.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {m.change >= 0 ? (
                  <><ArrowUpRight className="w-3 h-3 text-green-400" /><span className="text-green-400">+{m.change}%</span></>
                ) : (
                  <><ArrowDownRight className="w-3 h-3 text-red-400" /><span className="text-red-400">{m.change}%</span></>
                )}
                <span className="text-surface-600">vs prev period</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card !p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Generations Over Time</h3>
              <div className="h-52 flex items-end justify-between gap-1.5 px-2">
                {Array.from({ length: 28 }, (_, i) => {
                  const h = Math.random() * 80 + 5;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full rounded-t bg-brand-600/50 hover:bg-brand-500/60 transition-colors cursor-pointer" style={{ height: `${h}%` }} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card !p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Revenue Over Time</h3>
              <div className="h-40 flex items-end justify-between gap-1.5 px-2">
                {Array.from({ length: 28 }, (_, i) => {
                  const h = Math.random() * 70 + 5;
                  return (
                    <div key={i} className="flex-1">
                      <div className="w-full rounded-t bg-green-600/50 hover:bg-green-500/60 transition-colors cursor-pointer" style={{ height: `${h}%` }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar stats */}
          <div className="space-y-4">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">System Health</h3>
              <div className="space-y-3">
                {[
                  { label: "API Uptime", value: "99.9%", status: "good" },
                  { label: "Avg Response Time", value: "340ms", status: "good" },
                  { label: "Failure Rate", value: metrics.failureRate, status: "good" },
                  { label: "Queue Depth", value: "0", status: "good" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-surface-400">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-medium">{item.value}</span>
                      <div className={`w-2 h-2 rounded-full ${item.status === "good" ? "bg-green-400" : "bg-red-400"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Plan Distribution</h3>
              <div className="space-y-2">
                {[
                  { plan: "Free", count: 0, color: "bg-surface-600" },
                  { plan: "Standard", count: 0, color: "bg-blue-500" },
                  { plan: "Premium", count: 0, color: "bg-brand-500" },
                  { plan: "Pro", count: 0, color: "bg-accent-500" },
                ].map((p) => (
                  <div key={p.plan} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                      <span className="text-xs text-surface-300">{p.plan}</span>
                    </div>
                    <span className="text-xs text-white font-medium">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Top Models</h3>
              <div className="space-y-2">
                {["FLUX Pro 1.1", "FLUX Dev", "Wan 2.1", "Kling v2", "AuraSR"].map((m, i) => (
                  <div key={m} className="flex items-center justify-between text-xs">
                    <span className="text-surface-300">{i + 1}. {m}</span>
                    <span className="text-surface-500">--</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Quick Links</h3>
              <div className="space-y-1.5">
                <a href="/admin/users" className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-800 transition-colors text-xs text-surface-300 hover:text-white">
                  <span>Manage Users</span><Users className="w-3.5 h-3.5" />
                </a>
                <a href="/admin/analytics" className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-800 transition-colors text-xs text-surface-300 hover:text-white">
                  <span>Detailed Analytics</span><BarChart3 className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
