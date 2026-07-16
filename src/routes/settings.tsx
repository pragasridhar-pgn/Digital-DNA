import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Bell, Shield, Zap, Database, Users } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, Badge } from "@/components/ui-blocks";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SentinelDNA" },
      { name: "description", content: "Configure trust thresholds, adaptive access policies and AI Guardian sensitivity." },
    ],
  }),
  component: SettingsPage,
});

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function SettingsPage() {
  const [thresholds, setThresholds] = useState({ full: 80, mfa: 60, readonly: 35 });
  const [toggles, setToggles] = useState({
    autoIsolate: true,
    aiNarration: true,
    biometricKeystroke: true,
    biometricMouse: true,
    emailAlerts: true,
    slackAlerts: false,
    smsCritical: true,
  });

  const tabs = [
    { key: "trust", label: "Trust Policies", icon: Shield },
    { key: "ai", label: "AI Guardian", icon: Zap },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "data", label: "Data & Baselines", icon: Database },
    { key: "team", label: "Team", icon: Users },
  ];
  const [tab, setTab] = useState(tabs[0].key);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Configure trust thresholds, AI behavior and integrations"
        actions={<Badge variant="success">All changes autosaved</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <GlassCard className="lg:col-span-1 p-2">
          <nav className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-100" : "hover:bg-white/5 text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {t.label}
                </button>
              );
            })}
          </nav>
        </GlassCard>

        <div className="lg:col-span-3 space-y-4">
          {tab === "trust" && (
            <GlassCard>
              <h3 className="font-semibold">Trust Score Thresholds</h3>
              <p className="text-xs text-muted-foreground mb-4">Define the boundaries between adaptive access tiers</p>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Full access threshold</span>
                    <span className="font-bold tabular-nums text-emerald-400">{thresholds.full}</span>
                  </div>
                  <input type="range" min={60} max={100} value={thresholds.full} onChange={(e) => setThresholds((t) => ({ ...t, full: +e.target.value }))} className="w-full accent-cyan-400" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>MFA challenge threshold</span>
                    <span className="font-bold tabular-nums text-cyan-400">{thresholds.mfa}</span>
                  </div>
                  <input type="range" min={40} max={80} value={thresholds.mfa} onChange={(e) => setThresholds((t) => ({ ...t, mfa: +e.target.value }))} className="w-full accent-cyan-400" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Read-only threshold</span>
                    <span className="font-bold tabular-nums text-amber-400">{thresholds.readonly}</span>
                  </div>
                  <input type="range" min={10} max={60} value={thresholds.readonly} onChange={(e) => setThresholds((t) => ({ ...t, readonly: +e.target.value }))} className="w-full accent-cyan-400" />
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-white/5 bg-white/[0.02] p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Auto-isolate on critical trust</div>
                  <div className="text-xs text-muted-foreground">Automatically revoke sessions when trust falls below {thresholds.readonly}</div>
                </div>
                <Toggle enabled={toggles.autoIsolate} onChange={(v) => setToggles((t) => ({ ...t, autoIsolate: v }))} />
              </div>
            </GlassCard>
          )}

          {tab === "ai" && (
            <GlassCard>
              <h3 className="font-semibold">AI Guardian Configuration</h3>
              <p className="text-xs text-muted-foreground mb-4">Tune AI narration, biometric signals and model behavior</p>
              <div className="space-y-3">
                {[
                  { key: "aiNarration", label: "AI narration on every decision", desc: "Guardian explains each trust change in natural language" },
                  { key: "biometricKeystroke", label: "Keystroke biometric signal", desc: "Include typing rhythm in DNA fingerprint" },
                  { key: "biometricMouse", label: "Mouse dynamics signal", desc: "Include cursor patterns in DNA fingerprint" },
                ].map((row) => (
                  <div key={row.key} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{row.label}</div>
                      <div className="text-xs text-muted-foreground">{row.desc}</div>
                    </div>
                    <Toggle enabled={toggles[row.key as keyof typeof toggles]} onChange={(v) => setToggles((t) => ({ ...t, [row.key]: v }))} />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {tab === "notifications" && (
            <GlassCard>
              <h3 className="font-semibold">Notification Channels</h3>
              <p className="text-xs text-muted-foreground mb-4">Where SentinelDNA should page you</p>
              <div className="space-y-3">
                {[
                  { key: "emailAlerts", label: "Email alerts", desc: "All incidents and daily digests" },
                  { key: "slackAlerts", label: "Slack integration", desc: "Route critical alerts to #security-ops" },
                  { key: "smsCritical", label: "SMS for critical", desc: "Text CISO on-call for critical incidents" },
                ].map((row) => (
                  <div key={row.key} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{row.label}</div>
                      <div className="text-xs text-muted-foreground">{row.desc}</div>
                    </div>
                    <Toggle enabled={toggles[row.key as keyof typeof toggles]} onChange={(v) => setToggles((t) => ({ ...t, [row.key]: v }))} />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {tab === "data" && (
            <GlassCard>
              <h3 className="font-semibold">Data & Baselines</h3>
              <p className="text-xs text-muted-foreground mb-4">DNA baseline retention and export</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-xs text-muted-foreground">Baseline retention</div>
                  <div className="text-2xl font-bold mt-1">180 days</div>
                  <div className="text-xs text-muted-foreground mt-1">Rolling window for DNA training</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-xs text-muted-foreground">Event history</div>
                  <div className="text-2xl font-bold mt-1">2 years</div>
                  <div className="text-xs text-muted-foreground mt-1">Audit-grade trust event log</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-xs text-muted-foreground">Data residency</div>
                  <div className="text-2xl font-bold mt-1">EU-West</div>
                  <div className="text-xs text-muted-foreground mt-1">GDPR-compliant region</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-xs text-muted-foreground">DNA profiles synced</div>
                  <div className="text-2xl font-bold mt-1">1,284</div>
                  <div className="text-xs text-muted-foreground mt-1">100% coverage</div>
                </div>
              </div>
            </GlassCard>
          )}

          {tab === "team" && (
            <GlassCard>
              <h3 className="font-semibold">Security Team</h3>
              <p className="text-xs text-muted-foreground mb-4">Roles and on-call rotation</p>
              <div className="space-y-2">
                {[
                  { name: "Alex Kessler", role: "CISO", status: "On-call" },
                  { name: "Priya Menon", role: "SOC Lead", status: "Active" },
                  { name: "Marco Silva", role: "Senior Analyst", status: "Active" },
                  { name: "Yuki Tanaka", role: "Threat Hunter", status: "Off-hours" },
                ].map((m) => (
                  <div key={m.name} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-slate-950">
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.role}</div>
                    </div>
                    <Badge variant={m.status === "On-call" ? "success" : m.status === "Active" ? "info" : "default"}>{m.status}</Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
