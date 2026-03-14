"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Bot, Play, Loader2, ArrowRight, Clock, Zap, Image as ImageIcon,
  Video, Maximize2, Sparkles, Plus, Settings2, CheckCircle2,
  Pause, RotateCcw, ChevronRight,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  steps: string[];
  creditCost: number;
  badge?: string;
  category: string;
}

const AGENTS: Agent[] = [
  {
    id: "social-pack",
    name: "Social Media Pack",
    description: "Generate an image, upscale it, then create 5 aspect ratio variants for every platform",
    icon: "📱",
    steps: ["Generate image from prompt", "Upscale to 4K", "Crop to 1:1 (Instagram)", "Crop to 9:16 (Stories/TikTok)", "Crop to 16:9 (YouTube/Twitter)"],
    creditCost: 5,
    badge: "popular",
    category: "Content",
  },
  {
    id: "character-sheet",
    name: "Character Sheet Generator",
    description: "Create a consistent character from one photo in 6 different poses and settings",
    icon: "🎭",
    steps: ["Extract face identity", "Generate front portrait", "Generate side profile", "Generate action pose", "Generate casual scene", "Generate dramatic scene", "Compile character sheet"],
    creditCost: 14,
    badge: "new",
    category: "Creative",
  },
  {
    id: "product-showcase",
    name: "Product Showcase",
    description: "Upload a product photo and get it placed in 4 professional lifestyle scenes",
    icon: "📦",
    steps: ["Remove product background", "Generate lifestyle scene 1", "Generate lifestyle scene 2", "Generate lifestyle scene 3", "Generate lifestyle scene 4", "Upscale all results"],
    creditCost: 10,
    category: "Business",
  },
  {
    id: "video-story",
    name: "Video Story Creator",
    description: "Generate a series of images from a story outline and animate each into video clips",
    icon: "🎬",
    steps: ["Enhance story prompts", "Generate scene 1 image", "Generate scene 2 image", "Generate scene 3 image", "Animate scene 1 to video", "Animate scene 2 to video", "Animate scene 3 to video"],
    creditCost: 40,
    category: "Creative",
  },
  {
    id: "brand-kit",
    name: "Brand Visual Kit",
    description: "Create a logo concept, hero banner, social profile image, and favicon from a brand description",
    icon: "🎨",
    steps: ["Generate logo concept", "Generate hero banner (16:9)", "Generate profile avatar (1:1)", "Generate favicon (tiny icon)", "Upscale all to print quality"],
    creditCost: 8,
    category: "Business",
  },
  {
    id: "style-explorer",
    name: "Style Explorer",
    description: "Take one prompt and generate it across 8 different art styles simultaneously",
    icon: "🎪",
    steps: ["Photorealistic", "Anime", "Oil Painting", "Watercolor", "Pixel Art", "3D Render", "Comic Book", "Pencil Sketch"],
    creditCost: 8,
    category: "Creative",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(AGENTS.map((a) => a.category)))];

interface RunningAgent {
  agentId: string;
  currentStep: number;
  status: "running" | "completed" | "paused";
  results: string[];
}

export default function AgentsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [prompt, setPrompt] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [running, setRunning] = useState<RunningAgent | null>(null);
  const [history, setHistory] = useState<RunningAgent[]>([]);

  const filteredAgents = selectedCategory === "All"
    ? AGENTS
    : AGENTS.filter((a) => a.category === selectedCategory);

  async function startAgent() {
    if (!selectedAgent || !prompt.trim()) return;

    const run: RunningAgent = {
      agentId: selectedAgent.id,
      currentStep: 0,
      status: "running",
      results: [],
    };
    setRunning(run);

    // Simulate step-by-step execution
    for (let i = 0; i < selectedAgent.steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));
      setRunning((prev) =>
        prev ? { ...prev, currentStep: i + 1, results: [...prev.results, `step-${i}-result`] } : null
      );
    }

    setRunning((prev) => {
      if (prev) {
        const completed = { ...prev, status: "completed" as const };
        setHistory((h) => [completed, ...h]);
        return completed;
      }
      return null;
    });
  }

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Bot className="w-6 h-6 text-indigo-400" />
            AI Agents
          </h1>
          <p className="text-surface-400 text-sm">
            Automated multi-step AI workflows. One prompt, multiple high-quality outputs.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat ? "bg-indigo-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Agent cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => { setSelectedAgent(agent); setRunning(null); }}
                  className={`card-hover text-left ${
                    selectedAgent?.id === agent.id ? "!border-indigo-500 shadow-lg shadow-indigo-500/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{agent.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                        {agent.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            agent.badge === "new" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                          }`}>
                            {agent.badge.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-surface-400 leading-relaxed">{agent.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-surface-500">
                    <span className="flex items-center gap-1"><Settings2 className="w-3 h-3" /> {agent.steps.length} steps</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" /> {agent.creditCost} credits</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Selected agent detail + run */}
          <div className="lg:col-span-1 space-y-4">
            {selectedAgent ? (
              <>
                <div className="card !p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{selectedAgent.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{selectedAgent.name}</h3>
                      <span className="text-xs text-surface-400">{selectedAgent.creditCost} credits &middot; {selectedAgent.steps.length} steps</span>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2 mb-4">
                    {selectedAgent.steps.map((step, i) => {
                      const isCompleted = running && running.agentId === selectedAgent.id && i < running.currentStep;
                      const isCurrent = running && running.agentId === selectedAgent.id && i === running.currentStep && running.status === "running";

                      return (
                        <div key={i} className={`flex items-center gap-2.5 p-2 rounded-lg transition-all ${
                          isCompleted ? "bg-green-500/10" : isCurrent ? "bg-indigo-500/10" : "bg-surface-800/50"
                        }`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted ? "bg-green-500" : isCurrent ? "bg-indigo-500" : "bg-surface-700"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            ) : isCurrent ? (
                              <Loader2 className="w-3 h-3 text-white animate-spin" />
                            ) : (
                              <span className="text-[10px] text-surface-400 font-bold">{i + 1}</span>
                            )}
                          </div>
                          <span className={`text-xs ${isCompleted ? "text-green-300" : isCurrent ? "text-indigo-300" : "text-surface-400"}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Prompt input */}
                  {(!running || running.status === "completed") && (
                    <>
                      <label className="text-xs text-surface-400 mb-1.5 block">Your Prompt</label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe what you want the agent to create..."
                        className="input-field min-h-[80px] resize-none text-sm mb-3"
                      />
                      <button
                        onClick={startAgent}
                        disabled={!prompt.trim() || (running?.status === "running")}
                        className="btn-primary w-full bg-indigo-600 hover:bg-indigo-500"
                      >
                        <Play className="w-4 h-4" />
                        {running?.status === "completed" ? "Run Again" : "Start Agent"} ({selectedAgent.creditCost} credits)
                      </button>
                    </>
                  )}

                  {running?.status === "running" && running.agentId === selectedAgent.id && (
                    <div className="text-center py-2">
                      <p className="text-xs text-indigo-300 mb-2">
                        Step {running.currentStep} of {selectedAgent.steps.length}...
                      </p>
                      <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${(running.currentStep / selectedAgent.steps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Results */}
                {running?.status === "completed" && running.agentId === selectedAgent.id && (
                  <div className="card !p-4">
                    <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Completed
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {running.results.map((_, i) => (
                        <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-indigo-900/30 to-surface-800 border border-surface-700" />
                      ))}
                    </div>
                    <p className="text-xs text-surface-500 text-center mt-3">
                      {running.results.length} assets generated &middot; Saved to your library
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center !py-16">
                <Bot className="w-12 h-12 mx-auto text-surface-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Select an Agent</h3>
                <p className="text-sm text-surface-400">Choose a workflow from the left to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
