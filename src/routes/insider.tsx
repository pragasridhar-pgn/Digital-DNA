import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Lock, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceArea } from "recharts";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, TrustScoreRing, Badge } from "@/components/ui-blocks";

export const Route = createFileRoute("/insider")({
  head: () => ({
    meta: [
      { title: "Insider Threat Center — SentinelDNA" },
      { name: "description", content: "Live insider-threat simulation demonstrating the SentinelDNA continuous-trust model end-to-end." },
    ],
  }),
  component: InsiderPage,
});

type Stage = {
  key: string;
  label: string;
  narrative: string;
  trust: number;
  badge: "success" | "info" | "warning" | "danger";
  icon: typeof Play;
};

const stages: Stage[] = [
  { key: "learn", label: "Baseline Learning", narrative: "AI observes typical login times, device, geo, typing rhythm and file-access scope for Riya Patel. DNA fingerprint stabilizing.", trust: 92, badge: "success", icon: CheckCircle2 },
  { key: "normal", label: "Normal Behavior", narrative: "Session matches baseline: office IP, MacBook Pro fingerprint, typing dwell within 2ms, file access within scope.", trust: 88, badge: "success", icon: Activity },
  { key: "suspicious", label: "Suspicious Deviation", narrative: "New device fingerprint. Access to /finance/2024-audit (never accessed before). Typing rhythm 84% off baseline.", trust: 54, badge: "warning", icon: AlertTriangle },
  { key: "drop", label: "Trust Collapse", narrative: "Impossible-travel event detected. Bulk file download initiated: 240 files in 4 minutes. Behavior deviates 87% from baseline.", trust: 22, badge: "danger", icon: ShieldAlert },
  { key: "ai", label: "AI Guardian Explains", narrative: "Cross-referenced 12 DNA dimensions. Verdict: high-confidence insider-threat indicator. Recommended action: session isolation.", trust: 22, badge: "info", icon: Sparkles },
  { key: "adapt", label: "Adaptive Response", narrative: "Session isolated automatically. Active tokens revoked. Read-only degraded to zero. Security team paged.", trust: 22, badge: "danger", icon: Lock },
  { key: "incident", label: "Incident Generated", narrative: "INC-4821 opened with full evidence chain. Executive dashboard updated. Attack surface reduced by 38%.", trust: 22, badge: "info", icon: CheckCircle2 },
];

function InsiderPage() {
  const [stageIdx, setStageIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<{ t: number; score: number }[]>([{ t: 0, score: 92 }]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!running) return;
    if (stageIdx >= stages.length - 1) {
      setRunning(false);
      return;
    }
    timer.current = setTimeout(() => {
      const next = stageIdx + 1;
      setStageIdx(next);
      setHistory((h) => [...h, { t: h.length, score: stages[next].trust }]);
    }, 2200);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [running, stageIdx]);

  function launch() {
    setStageIdx(0);
    setHistory([{ t: 0, score: stages[0].trust }]);
    setRunning(true);
  }
  function toggle() {
    if (stageIdx === -1) launch();
    else setRunning((r) => !r);
  }
  function reset() {
    setRunning(false);
    setStageIdx(-1);
    setHistory([{ t: 0, score: 92 }]);
  }

  const current = stageIdx >= 0 ? stages[stageIdx] : null;
  const currentTrust = current?.trust ?? 92;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insider Threat Simulation"
        subtitle="End-to-end demonstration of continuous trust verification defeating an insider attack"
        actions={
          <>
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button
              onClick={toggle}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition"
            >
              {running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> {stageIdx === -1 ? "Launch Simulation" : "Resume"}</>}
            </button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="flex flex-col items-center justify-center py-8">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Target subject</div>
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-bold text-slate-950 glow-cyan">
              RP
            </div>
            <div className="mt-2 font-semibold">Riya Patel</div>
            <div className="text-xs text-muted-foreground">Finance · Senior Analyst</div>
          </div>
          <div className="mt-6">
            <TrustScoreRing score={currentTrust} size={160} label="Live Trust" />
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Live Trust Trajectory</h3>
            <Badge variant={current?.badge ?? "info"}>{current?.label ?? "Awaiting launch"}</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={history}>
              <defs>
                <linearGradient id="simGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.15 200)" />
                  <stop offset="100%" stopColor="oklch(0.65 0.24 25)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.4 0.05 240 / 0.15)" vertical={false} />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} stroke="oklch(0.7 0.02 240 / 0.6)" fontSize={11} tickLine={false} axisLine={false} />
              <ReferenceArea y1={80} y2={100} fill="oklch(0.75 0.17 155)" fillOpacity={0.06} />
              <ReferenceArea y1={60} y2={80} fill="oklch(0.82 0.15 200)" fillOpacity={0.05} />
              <ReferenceArea y1={35} y2={60} fill="oklch(0.8 0.17 80)" fillOpacity={0.05} />
              <ReferenceArea y1={0} y2={35} fill="oklch(0.65 0.24 25)" fillOpacity={0.07} />
              <Line type="monotone" dataKey="score" stroke="url(#simGrad)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.82 0.15 200)" }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>Isolated (0-35)</span><span>Read-only</span><span>MFA</span><span>Full access (80+)</span>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="mb-4">
          <h3 className="font-semibold">Attack Playbook — 7 stages</h3>
          <p className="text-xs text-muted-foreground">Simulation advances every 2.2 seconds</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s, i) => {
            const done = i <= stageIdx;
            const active = i === stageIdx;
            const Icon = s.icon;
            return (
              <motion.div
                key={s.key}
                animate={{ scale: active ? 1.02 : 1, opacity: done ? 1 : 0.45 }}
                className={`relative rounded-xl p-4 border ${
                  active ? "border-cyan-400/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/20" : done ? "border-white/10 bg-white/5" : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? "bg-cyan-500 text-slate-950" : done ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-slate-500"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Stage {i + 1}</div>
                </div>
                <div className="mt-2 font-semibold text-sm">{s.label}</div>
                <p className="mt-1 text-xs text-muted-foreground">{s.narrative}</p>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      <AnimatePresence>
        {current && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="border-cyan-400/30">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 glow-cyan">
                  <Sparkles className="h-4 w-4 text-slate-950" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-cyan-300">AI Guardian Narration</div>
                  <p className="text-sm mt-1">{current.narrative}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
