import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Radio } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, TrustScoreRing, Badge } from "@/components/ui-blocks";
import { employees, trustBg, trustLevel } from "@/lib/mock-data";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Live Trust Monitor — SentinelDNA" },
      { name: "description", content: "Real-time Trust Score across every active session." },
    ],
  }),
  component: TrustPage,
});

function useLiveHistory(base: number) {
  const [data, setData] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({ t: i, score: base + Math.sin(i / 3) * 6 }))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1].score;
        const next = Math.max(20, Math.min(100, last + (Math.random() - 0.5) * 4));
        return [...prev.slice(1), { t: prev[prev.length - 1].t + 1, score: next }];
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);
  return data;
}

function TrustPage() {
  const [orgTrust, setOrgTrust] = useState(87);
  const liveData = useLiveHistory(orgTrust);
  const active = employees.filter((e) => e.status === "online" || e.status === "idle").slice(0, 8);

  useEffect(() => {
    const id = setInterval(() => setOrgTrust((s) => Math.max(70, Math.min(95, s + (Math.random() - 0.5) * 2))), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Trust Monitor"
        subtitle="Continuous 0-100 Trust Score streaming across the workforce"
        actions={
          <Badge variant="success">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-ring" /> LIVE STREAM
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1 flex flex-col items-center justify-center py-8">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Live Org Trust</div>
          <TrustScoreRing score={Math.round(orgTrust)} size={180} label="of 100" />
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-cyan-300" />
            <span className="text-muted-foreground">AI evaluating</span>
            <span className="font-semibold">947</span>
            <span className="text-muted-foreground">sessions</span>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Radio className="h-4 w-4 text-cyan-300" /> Live Trust Stream</h3>
              <p className="text-xs text-muted-foreground">Updates every 1.5s · Rolling 30 samples</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={liveData}>
              <defs>
                <linearGradient id="liveGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.15 200)" />
                  <stop offset="100%" stopColor="oklch(0.7 0.2 240)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.4 0.05 240 / 0.15)" vertical={false} />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} stroke="oklch(0.7 0.02 240 / 0.6)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.03 250)", border: "1px solid oklch(0.4 0.05 240 / 0.3)", borderRadius: 8 }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#liveGrad)"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-cyan-300" /> Active Sessions</h3>
            <p className="text-xs text-muted-foreground">Trust meters updating in real time</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {active.map((e) => (
            <motion.div
              key={e.id}
              whileHover={{ y: -2 }}
              className="glass rounded-xl p-4 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-slate-950">
                  {e.avatar}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{e.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{e.department}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Trust</span>
                <span className={`text-lg font-bold tabular-nums ${trustLevel(e.trustScore) === "high" ? "text-emerald-400" : trustLevel(e.trustScore) === "medium" ? "text-cyan-400" : trustLevel(e.trustScore) === "low" ? "text-amber-400" : "text-rose-400"}`}>
                  {e.trustScore}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-white/5">
                <motion.div
                  animate={{ width: `${e.trustScore}%` }}
                  className={`h-full rounded-full ${
                    trustLevel(e.trustScore) === "high"
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                      : trustLevel(e.trustScore) === "medium"
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                      : trustLevel(e.trustScore) === "low"
                      ? "bg-gradient-to-r from-amber-400 to-orange-400"
                      : "bg-gradient-to-r from-rose-500 to-pink-500"
                  }`}
                />
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground">
                {e.location} · {e.lastActivity}
              </div>
              <Badge variant={trustLevel(e.trustScore) === "high" ? "success" : trustLevel(e.trustScore) === "medium" ? "info" : trustLevel(e.trustScore) === "low" ? "warning" : "danger"}>
                <span className="mt-2">{trustBg(e.trustScore).includes("emerald") ? "Full Access" : trustBg(e.trustScore).includes("cyan") ? "MFA Required" : trustBg(e.trustScore).includes("amber") ? "Read-Only" : "Isolated"}</span>
              </Badge>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
