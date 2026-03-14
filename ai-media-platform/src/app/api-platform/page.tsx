"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Code2, Key, Copy, Check, Eye, EyeOff, RefreshCw,
  BookOpen, Zap, Shield, BarChart3, Terminal,
} from "lucide-react";

const CODE_EXAMPLES = {
  javascript: `const response = await fetch("https://api.drawodyssey.com/v1/generate/image", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "fal-ai/flux-pro/v1.1",
    prompt: "A cosmic landscape with nebula clouds",
    size: "landscape_16_9"
  })
});

const data = await response.json();
console.log(data.image_url);`,
  python: `import requests

response = requests.post(
    "https://api.drawodyssey.com/v1/generate/image",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "model": "fal-ai/flux-pro/v1.1",
        "prompt": "A cosmic landscape with nebula clouds",
        "size": "landscape_16_9"
    }
)

data = response.json()
print(data["image_url"])`,
  curl: `curl -X POST https://api.drawodyssey.com/v1/generate/image \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "fal-ai/flux-pro/v1.1",
    "prompt": "A cosmic landscape with nebula clouds",
    "size": "landscape_16_9"
  }'`,
};

export default function APIPlatformPage() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState<keyof typeof CODE_EXAMPLES>("javascript");
  const [copiedCode, setCopiedCode] = useState(false);

  const demoKey = "vo_sk_demo_xxxxxxxxxxxxxxxxxxxxxxxx";

  function copyKey() {
    navigator.clipboard.writeText(demoKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyCode() {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeLang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Code2 className="w-6 h-6 text-emerald-400" />
            API Platform
          </h1>
          <p className="text-surface-400 text-sm">
            Integrate Draw Odyssey&apos;s AI models directly into your applications.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "API Calls Today", value: "0", icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Credits Used", value: "0", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
            { label: "Rate Limit", value: "10/min", icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Status", value: "Active", icon: CheckIcon, color: "text-green-400", bg: "bg-green-500/10" },
          ].map((stat) => (
            <div key={stat.label} className="card !p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-surface-400">{stat.label}</span>
                <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
              </div>
              <span className="text-xl font-bold text-white">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: API Key */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Key className="w-4 h-4" /> Your API Key
              </h3>
              <div className="flex items-center gap-2 p-3 bg-surface-800 rounded-lg border border-surface-700 mb-3">
                <code className="flex-1 text-sm font-mono text-surface-300 truncate">
                  {showKey ? demoKey : "vo_sk_demo_••••••••••••••••"}
                </code>
                <button onClick={() => setShowKey(!showKey)} className="text-surface-500 hover:text-white transition-colors">
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={copyKey} className="text-surface-500 hover:text-white transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary text-xs flex-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
              </div>
              <p className="text-[11px] text-surface-600 mt-3">
                Keep your API key secret. Never expose it in client-side code.
              </p>
            </div>

            {/* Endpoints */}
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Endpoints</h3>
              <div className="space-y-2 text-xs">
                {[
                  { method: "POST", path: "/v1/generate/image", desc: "Generate images" },
                  { method: "POST", path: "/v1/generate/video", desc: "Generate videos" },
                  { method: "POST", path: "/v1/upscale", desc: "Upscale images" },
                  { method: "POST", path: "/v1/remove-bg", desc: "Remove backgrounds" },
                  { method: "GET", path: "/v1/models", desc: "List available models" },
                  { method: "GET", path: "/v1/credits", desc: "Check credit balance" },
                ].map((ep) => (
                  <div key={ep.path} className="flex items-center gap-2 p-2 rounded-lg bg-surface-800/50">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      ep.method === "POST" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"
                    }`}>
                      {ep.method}
                    </span>
                    <code className="text-surface-300 font-mono truncate flex-1">{ep.path}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Pricing</h3>
              <div className="space-y-2 text-xs text-surface-400">
                <div className="flex justify-between"><span>Standard image</span><span className="text-white">1 credit</span></div>
                <div className="flex justify-between"><span>Pro image (FLUX Ultra)</span><span className="text-white">2 credits</span></div>
                <div className="flex justify-between"><span>Video generation</span><span className="text-white">8-15 credits</span></div>
                <div className="flex justify-between"><span>Upscale</span><span className="text-white">1-2 credits</span></div>
                <div className="flex justify-between"><span>Background removal</span><span className="text-white">1 credit</span></div>
              </div>
            </div>
          </div>

          {/* Right: Code examples */}
          <div className="lg:col-span-2">
            <div className="card !p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Quick Start
                </h3>
                <div className="flex gap-1">
                  {(Object.keys(CODE_EXAMPLES) as Array<keyof typeof CODE_EXAMPLES>).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1 text-xs rounded-md transition-all ${
                        activeLang === lang ? "bg-emerald-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
                      }`}
                    >
                      {lang === "javascript" ? "JS" : lang === "python" ? "Python" : "cURL"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 bg-surface-950 rounded-lg border border-surface-800 overflow-x-auto text-sm leading-relaxed">
                  <code className="text-surface-300 font-mono">{CODE_EXAMPLES[activeLang]}</code>
                </pre>
                <button
                  onClick={copyCode}
                  className="absolute top-3 right-3 p-2 bg-surface-800 rounded-lg hover:bg-surface-700 transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-surface-400" />}
                </button>
              </div>

              {/* Response example */}
              <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mt-6 mb-3">Response</h4>
              <pre className="p-4 bg-surface-950 rounded-lg border border-surface-800 overflow-x-auto text-sm">
                <code className="text-surface-300 font-mono">{`{
  "success": true,
  "image_url": "https://cdn.drawodyssey.com/gen/abc123.png",
  "model": "fal-ai/flux-pro/v1.1",
  "credits_used": 2,
  "credits_remaining": 298,
  "generation_time_ms": 3200
}`}</code>
              </pre>

              <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-emerald-300 font-medium mb-1">Full Documentation</p>
                  <p className="text-xs text-surface-400">
                    View complete API documentation with all parameters, error codes, rate limits, and webhook events at{" "}
                    <span className="text-emerald-400 font-mono">docs.drawodyssey.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function CheckIcon(props: any) {
  return <Check {...props} />;
}
