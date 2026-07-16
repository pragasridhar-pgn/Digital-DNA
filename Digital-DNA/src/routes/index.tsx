import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Activity,
  AlertTriangle,
  Brain,
  AlertOctagon,
  HeartPulse,
  Play,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, StatCard, TrustScoreRing, Badge } from "@/components/ui-blocks";
import {
  orgMetrics,
  trustHistory,
  trustDistribution,
  departmentRisk,
  threatTimeline,
  incidents,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — SentinelDNA" },
      { name: "description", content: "Real-time organizational trust posture, active sessions, AI confidence and critical incident intelligence." },
    ],
  }),
  component: Dashboard,
});

const chartTheme = {
  grid: "oklch(0.4 0.05 240 / 0.15)",
  axis: "oklch(0.7 0.02 240 / 0.6)",
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      {label && <div className="font-semibold mb-1">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Command Center"
        subtitle="Real-time organizational trust posture and threat intelligence"
        actions={
          <>
            <Badge variant="success">All systems nominal</Badge>
            <Link
              to="/insider"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition"
            >
              <Play className="h-4 w-4" />
              Launch Threat Simulation
            </Link>
          </>
        }
      />

      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <StatCard label="Org Trust Score" value={orgMetrics.orgTrustScore} delta="+2.1% today" icon={<ShieldCheck className="h-5 w-5" />} accent="emerald" />
        <StatCard label="Active Users" value={orgMetrics.activeUsers.toLocaleString()} delta="+43 today" icon={<Users className="h-5 w-5" />} accent="cyan" />
        <StatCard label="Live Sessions" value={orgMetrics.liveSessions} delta="Peak: 1,102" icon={<Activity className="h-5 w-5" />} accent="cyan" />
        <StatCard label="High Risk Users" value={orgMetrics.highRiskUsers} delta="+3 vs yesterday" icon={<AlertTriangle className="h-5 w-5" />} accent="amber" />
        <StatCard label="AI Confidence" value={`${orgMetrics.aiConfidence}%`} delta="Stable" icon={<Brain className="h-5 w-5" />} accent="violet" />
        <StatCard label="Critical Incidents" value={orgMetrics.criticalIncidents} delta="2 open" icon={<AlertOctagon className="h-5 w-5" />} accent="rose" />
        <StatCard label="Security Health" value={`${orgMetrics.securityHealth}%`} delta="+0.4%" icon={<HeartPulse className="h-5 w-5" />} accent="emerald" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Trust posture */}
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Organizational Trust — Last 24h</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Aggregate behavioral trust vs. detected anomalies</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Org Trust</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-400" /> AI Baseline</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /> Anomalies</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trustHistory}>
              <defs>
                <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.15 200)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.82 0.15 200)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="anomGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartTheme.grid} vertical={false} />
              <XAxis dataKey="time" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="org" stroke="oklch(0.82 0.15 200)" strokeWidth={2} fill="url(#orgGrad)" name="Org Trust" />
              <Area type="monotone" dataKey="ai" stroke="oklch(0.7 0.2 280)" strokeWidth={2} fill="transparent" name="AI Baseline" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="anomaly" stroke="oklch(0.65 0.24 25)" strokeWidth={2} fill="url(#anomGrad)" name="Anomalies" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Trust distribution */}
        <GlassCard>
          <h3 className="font-semibold mb-1">Trust Distribution</h3>
          <p className="text-xs text-muted-foreground mb-3">Workforce classification</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={trustDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {trustDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {trustDistribution.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground truncate">{d.name}</span>
                <span className="ml-auto font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Threat Timeline — 24h</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Detections by severity</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={threatTimeline}>
              <CartesianGrid stroke={chartTheme.grid} vertical={false} />
              <XAxis dataKey="hour" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="low" stackId="a" fill="oklch(0.75 0.15 200)" radius={[0, 0, 0, 0]} name="Low" />
              <Bar dataKey="medium" stackId="a" fill="oklch(0.8 0.17 80)" name="Medium" />
              <Bar dataKey="high" stackId="a" fill="oklch(0.7 0.2 40)" name="High" />
              <Bar dataKey="critical" stackId="a" fill="oklch(0.65 0.24 25)" radius={[4, 4, 0, 0]} name="Critical" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-1">Department Risk Index</h3>
          <p className="text-xs text-muted-foreground mb-3">Composite risk 0-100</p>
          <div className="space-y-2.5">
            {departmentRisk.map((d) => (
              <div key={d.department}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{d.department}</span>
                  <span className="text-muted-foreground tabular-nums">{d.risk}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.risk}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      d.risk > 60 ? "bg-gradient-to-r from-rose-500 to-orange-400" : d.risk > 40 ? "bg-gradient-to-r from-amber-400 to-yellow-300" : "bg-gradient-to-r from-cyan-500 to-emerald-400"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Critical incidents preview */}
      <GlassCard>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-300" /> Recent Critical Activity
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">AI Guardian flagged events</p>
          </div>
          <Link to="/incidents" className="text-xs text-cyan-300 hover:text-cyan-100 inline-flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {incidents.slice(0, 4).map((inc) => (
            <div key={inc.id} className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition">
              <TrustScoreRing score={Math.max(0, 100 + inc.trustImpact)} size={50} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm truncate">{inc.title}</span>
                  <Badge variant={inc.severity === "critical" ? "danger" : inc.severity === "high" ? "warning" : "info"}>
                    {inc.severity}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {inc.user} · {inc.time} · {inc.id}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Trust impact</div>
                <div className="text-sm font-bold text-rose-400 tabular-nums">{inc.trustImpact}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
