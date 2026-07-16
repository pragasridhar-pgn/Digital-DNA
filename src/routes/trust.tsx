import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Radio, ShieldCheck } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import { getAuthUser } from "@/lib/auth";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, TrustScoreRing, Badge, StatCard } from "@/components/ui-blocks";
import { computeOrgTrustScore, computeTrustDistribution, countHighRiskUsers, countLiveSessions, employees, orgMetrics, trustBg, trustLevel } from "@/lib/mock-data";

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
    setData(Array.from({ length: 30 }, (_, i) => ({ t: i, score: base + Math.sin(i / 3) * 6 })));
  }, [base]);

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
  const [authUser, setAuthUser] = useState(() => getAuthUser());

  useEffect(() => {
    setAuthUser(getAuthUser());
  }, []);

  const targetEmployees = useMemo(() => {
    if (authUser?.role === "Super Admin") return employees;
    if (authUser) return employees.filter((employee) => employee.department === authUser.department);
    return employees;
  }, [authUser]);

  const [orgTrust, setOrgTrust] = useState(() => computeOrgTrustScore(targetEmployees));
  const trustDistribution = useMemo(() => computeTrustDistribution(targetEmployees), [targetEmployees]);
  const liveData = useLiveHistory(orgTrust);
  const active = targetEmployees.filter((e) => e.status === "online" || e.status === "idle").slice(0, 8);
  const liveSessions = useMemo(() => countLiveSessions(targetEmployees), [targetEmployees]);
  const highRiskUsers = useMemo(() => countHighRiskUsers(targetEmployees), [targetEmployees]);

  useEffect(() => {
    setOrgTrust(computeOrgTrustScore(targetEmployees));
  }, [targetEmployees]);

  const trustPosture = useMemo(() => {
    const level = trustLevel(orgTrust);
    if (orgTrust >= 85) {
      return {
        label: "Stable trust posture",
        summary: "Org trust is strong, with broad high-confidence behavior across the workforce.",
        status: "Healthy",
        accent: "success",
      };
    }
    if (orgTrust >= 70) {
      return {
        label: "Cautionary posture",
        summary: "Trust remains solid, but a few sessions require stepped-up scrutiny.",
        status: "Monitored",
        accent: "info",
      };
    }
    return {
      label: "Elevated risk posture",
      summary: "Trust is degrading; security should review high-risk access and adaptive controls.",
      status: "Attention",
      accent: "warning",
    };
  }, [orgTrust]);

  useEffect(() => {
    const id = setInterval(() => {
      setOrgTrust((current) => Math.max(70, Math.min(95, current + (Math.random() - 0.5) * 2)));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Trust Monitor"
        subtitle="Organizational trust posture, AI confidence, and risk analytics in a single view."
        actions={
          <Badge variant="success">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-ring" /> LIVE STREAM
          </Badge>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard
          label="Org Trust Score"
          value={`${orgTrust} / 100`}
          delta="Live average"
          icon={<ShieldCheck className="h-5 w-5" />}
          accent="emerald"
        />
        <StatCard
          label="AI Confidence"
          value={`${orgMetrics.aiConfidence.toFixed(1)}%`}
          delta="+1.2%"
          icon={<Activity className="h-5 w-5" />}
          accent="cyan"
        />
        <StatCard
          label="Live Sessions"
          value={liveSessions}
          delta="active now"
          icon={<Zap className="h-5 w-5" />}
          accent="cyan"
        />
        <StatCard
          label="High-Risk Users"
          value={highRiskUsers}
          delta="department signal"
          icon={<Radio className="h-5 w-5" />}
          accent="amber"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Organizational Trust Posture</h3>
              <p className="text-xs text-muted-foreground">Executive summary of current risk and confidence posture.</p>
            </div>
            <Badge variant={trustPosture.accent}>{trustPosture.status}</Badge>
          </div>
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Posture</div>
              <div className="mt-2 text-base font-semibold text-slate-900">{trustPosture.label}</div>
              <div className="mt-2 leading-6">{trustPosture.summary}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 border border-slate-200/70 p-4">
                <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Policy enforcement</div>
                <div className="mt-2 text-sm text-slate-900">Adaptive Zero Trust gating with behavioral risk signals.</div>
              </div>
              <div className="rounded-3xl bg-slate-50 border border-slate-200/70 p-4">
                <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Action focus</div>
                <div className="mt-2 text-sm text-slate-900">Monitor high-risk users and step up verification on suspicious sessions.</div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <h3 className="font-semibold">Trust Distribution</h3>
            <p className="text-xs text-muted-foreground">Breakdown of trust confidence across the workforce.</p>
          </div>
          <div className="space-y-3">
            {trustDistribution.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-slate-900">
                  <span>{item.name}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
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
