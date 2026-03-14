"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles, LayoutDashboard, Image as ImageIcon, Video, Wand2,
  FolderOpen, Film, CreditCard, Coins, ChevronLeft, Menu,
  Maximize2, Scissors, Palette, ChevronDown, Wrench,
  Brain, Globe, Code2, Users, UserCircle, PenTool, Clapperboard, PersonStanding,
  Bot, Newspaper, User, ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai-image", label: "AI Images", icon: ImageIcon },
  { href: "/ai-video", label: "AI Videos", icon: Video },
];

const toolsNav = [
  { href: "/tools/upscale", label: "AI Upscaler", icon: Maximize2 },
  { href: "/tools/background-remover", label: "BG Remover", icon: Scissors },
  { href: "/tools/face-swap", label: "Face Swap", icon: Users },
  { href: "/tools/style-transfer", label: "Style Transfer", icon: Palette },
  { href: "/tools/image-editor", label: "Image Editor", icon: PenTool },
  { href: "/tools/video-transform", label: "Video Transform", icon: Clapperboard },
  { href: "/tools/pose-control", label: "Pose & Depth", icon: PersonStanding },
  { href: "/tools/consistent-character", label: "Character", icon: UserCircle },
  { href: "/prompt-builder", label: "Prompt Builder", icon: Wand2 },
];

const studioNav = [
  { href: "/agents", label: "AI Agents", icon: Bot },
  { href: "/lora-training", label: "LoRA Training", icon: Brain },
  { href: "/library", label: "Media Library", icon: FolderOpen },
  { href: "/editor", label: "Video Editor", icon: Film },
  { href: "/gallery", label: "Community", icon: Globe },
  { href: "/api-platform", label: "API", icon: Code2 },
  { href: "/news", label: "News", icon: Newspaper },
];

const accountNav = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: any }) {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
          active ? "bg-brand-600/20 text-brand-300" : "text-surface-400 hover:text-white hover:bg-surface-800"
        }`}
        title={collapsed ? label : undefined}
      >
        <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-brand-400" : ""}`} />
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
      </Link>
    );
  }

  function SectionLabel({ label }: { label: string }) {
    if (collapsed) return null;
    return (
      <div className="px-3 pt-4 pb-1">
        <span className="text-[10px] font-semibold text-surface-600 uppercase tracking-widest">{label}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-surface-950">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 h-full bg-surface-900/95 backdrop-blur-xl border-r border-surface-800 z-40 flex flex-col transition-all duration-300
        ${collapsed ? "w-16" : "w-60"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-surface-800">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          {!collapsed && <span className="text-sm font-bold text-white tracking-tight">Draw Odyssey</span>}
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {/* Main */}
          {mainNav.map((item) => <NavLink key={item.href} {...item} />)}

          {/* Tools */}
          <SectionLabel label="Tools" />
          {toolsNav.map((item) => <NavLink key={item.href} {...item} />)}

          {/* Creator Studio */}
          <SectionLabel label="Creator Studio" />
          {studioNav.map((item) => <NavLink key={item.href} {...item} />)}

          {/* Account */}
          <SectionLabel label="Account" />
          {accountNav.map((item) => <NavLink key={item.href} {...item} />)}

          {/* Subscribe */}
          <SectionLabel label="" />
          <Link
            href="/subscribe"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              isActive("/subscribe")
                ? "bg-yellow-500/20 text-yellow-300"
                : "text-yellow-400/70 hover:text-yellow-300 hover:bg-yellow-500/10"
            }`}
          >
            <CreditCard className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Subscribe</span>}
          </Link>
        </nav>

        <div className="px-2 py-2 border-t border-surface-800 hidden md:block">
          <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-surface-500 hover:text-white hover:bg-surface-800 transition-all w-full">
            {collapsed ? <Menu className="w-[18px] h-[18px]" /> : <><ChevronLeft className="w-[18px] h-[18px]" /><span className="text-sm">Collapse</span></>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ml-0 ${collapsed ? "md:ml-16" : "md:ml-60"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800 flex items-center justify-between px-4 md:px-5">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-surface-400 hover:text-white rounded-lg hover:bg-surface-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 bg-surface-800 rounded-full border border-surface-700">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-sm font-semibold text-white">--</span>
              <span className="text-[10px] text-surface-500 hidden sm:inline">credits</span>
            </div>
            <Link href="/subscribe" className="btn-primary text-xs !py-1.5 !px-3">
              <span className="hidden sm:inline">Get Credits</span>
              <span className="sm:hidden">Credits</span>
            </Link>
          </div>
        </header>
        <div className="page-enter">{children}</div>
      </main>
    </div>
  );
}
