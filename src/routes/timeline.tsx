import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, Info, ShieldAlert, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, ReferenceDot } from "recharts";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, Badge } from "@/components/ui-blocks";
import { timelineEvents } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Trust Timeline — SentinelDNA" },
      { name: "description", content: "Trust evolution over time with the events that caused each change." },
    ],
  }),
  component: TimelinePage,
});

const trustCurve = Array.from({ length: 40 }, (_, i) => {
  const events = [10, 18, 24, 30, 34];
  let base = 88 + Math.sin(i / 4) * 4;
  if (i >= 24 && i < 30) base -= 25;
  if (i >= 30 && i < 34) base -= 10;
  if (i >= 34) base += 5;
  return { t: i, hour: `${(6 + Math.floor(i / 2)) % 24}:${i % 2 === 0 ? "00" : "30"}`, score: Math.max(15, Math.min(100, Math.round(base))), event: events.includes(i) ? i : null };
});

const iconFor = (type: string) => {
  switch (type) {
    case "trust_up": return <TrendingUp className="h-4 w-4" />;
    case "trust_down": return <TrendingDown className="h-4 w-4" />;
    case "alert": return <AlertTriangle className="h-4 w-4" />;
    case "critical": return <ShieldAlert className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

const variantFor = (type: string): "success" | "danger" | "warning" | "info" | "default" => {
  if (type === "trust_up") return "success";
  if (type === "trust_down") return "warning";
  if (type === "alert") return "warning";
  if (type === "critical") return "danger";
  return "info";
};

function TimelinePage() {
  const [selected, setSelected] = useState(timelineEvents[0]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trust Timeline"
        subtitle="Every trust change with attributable evidence — Sage Weber · Last 24 hours"
        actions={<Badge variant="info">42 events analyzed</Badge>}
      />

      <GlassCard>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trustCurve}>
            <defs>
              <linearGradient id="tlGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.82 0.15 200)" />
                <stop offset="100%" stopColor="oklch(0.65 0.24 25)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="oklch(0.4 0.05 240 / 0.15)" vertical={false} />
            <XAxis dataKey="hour" stroke="oklch(0.7 0.02 240 / 0.6)" fontSize={11} tickLine={false} axisLine={false} interval={4} />
            <YAxis domain={[0, 100]} stroke="oklch(0.7 0.02 240 / 0.6)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "oklch(0.2 0.03 250)", border: "1px solid oklch(0.4 0.05 240 / 0.3)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="score" stroke="url(#tlGrad)" strokeWidth={2.5} dot={false} />
            {trustCurve.filter((d) => d.event !== null).map((d) => (
              <ReferenceDot key={d.t} x={d.hour} y={d.score} r={5} fill="oklch(0.82 0.15 200)" stroke="oklch(1 0 0)" strokeWidth={2} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Event stream</h3>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/60 via-white/10 to-transparent" />
            {timelineEvents.map((e, i) => (
              <motion.button
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(e)}
                className={`relative mb-3 w-full text-left glass rounded-xl p-3 transition-all hover:border-cyan-400/40 ${
                  selected.id === e.id ? "border-cyan-400/50 shadow-lg shadow-cyan-500/10" : ""
                }`}
              >
                <div className={`absolute -left-[22px] top-4 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-slate-950 ${
                  e.type === "trust_up" ? "bg-emerald-500" :
                  e.type === "critical" ? "bg-rose-500" :
                  e.type === "trust_down" || e.type === "alert" ? "bg-amber-500" : "bg-cyan-500"
                }`}>
                  <span className="text-slate-950">{iconFor(e.type)}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">{e.time}</span>
                  <Badge variant={variantFor(e.type)}>{e.delta > 0 ? `+${e.delta}` : e.delta}</Badge>
                </div>
                <div className="mt-1 text-sm font-semibold">{e.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{e.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <GlassCard>
              <Badge variant={variantFor(selected.type)}>
                {iconFor(selected.type)} {selected.type.replace("_", " ")}
              </Badge>
              <h3 className="mt-3 text-lg font-bold">{selected.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selected.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div>
                  <div className="text-muted-foreground">Time</div>
                  <div className="font-semibold">{selected.time}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Trust Δ</div>
                  <div className={`font-bold ${selected.delta > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {selected.delta > 0 ? `+${selected.delta}` : selected.delta}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-widest text-cyan-300">Evidence</div>
                <ul className="mt-2 space-y-1.5">
                  {selected.evidence.map((ev, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <ChevronRight className="h-3 w-3 mt-0.5 text-cyan-300 shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
