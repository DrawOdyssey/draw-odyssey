"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Settings, User, Bell, Shield, CreditCard, Key, Trash2, Save, Globe, Eye, EyeOff } from "lucide-react";

export default function ProfileSettingsPage() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [generationNotifications, setGenerationNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  }

  function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label: string }) {
    return (
      <button onClick={onChange} className="flex items-center justify-between w-full py-2">
        <span className="text-sm text-surface-300">{label}</span>
        <div className={`w-10 h-5.5 rounded-full transition-colors relative ${enabled ? "bg-brand-600" : "bg-surface-700"}`}>
          <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} style={{ width: 18, height: 18, top: 2 }} />
        </div>
      </button>
    );
  }

  return (
    <AppShell>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <Settings className="w-6 h-6 text-surface-400" />
            Account Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="card !p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-surface-400" /> Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Display Name</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="How others see you" className="input-field" />
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell others about yourself..." className="input-field min-h-[80px] resize-none" />
              </div>
              <Toggle enabled={isPublicProfile} onChange={() => setIsPublicProfile(!isPublicProfile)} label="Public profile (visible in community gallery)" />
            </div>
          </div>

          {/* Notifications */}
          <div className="card !p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-surface-400" /> Notifications
            </h2>
            <div className="space-y-1">
              <Toggle enabled={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} label="Email notifications (new features, tips)" />
              <Toggle enabled={generationNotifications} onChange={() => setGenerationNotifications(!generationNotifications)} label="Generation complete notifications" />
            </div>
          </div>

          {/* Subscription */}
          <div className="card !p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-surface-400" /> Subscription
            </h2>
            <div className="flex items-center justify-between p-3 bg-surface-800 rounded-lg mb-3">
              <div>
                <span className="text-sm font-medium text-white">Free Plan</span>
                <p className="text-xs text-surface-400">50 credits &middot; Standard models</p>
              </div>
              <a href="/subscribe" className="btn-primary text-xs">Upgrade</a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-400">Credits remaining</span>
              <span className="text-yellow-400 font-semibold">50</span>
            </div>
          </div>

          {/* API Key */}
          <div className="card !p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-surface-400" /> API Access
            </h2>
            <p className="text-sm text-surface-400 mb-3">Manage your API keys for programmatic access.</p>
            <a href="/api-platform" className="btn-secondary text-xs inline-flex">
              <Key className="w-3.5 h-3.5" /> Manage API Keys
            </a>
          </div>

          {/* Danger zone */}
          <div className="card !p-5 !border-red-500/20">
            <h2 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Danger Zone
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-white">Delete Account</span>
                <p className="text-xs text-surface-500">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
              </button>
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full !py-3">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
