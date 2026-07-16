import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Search, Filter, Cpu } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis } from "recharts";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, TrustScoreRing, Badge } from "@/components/ui-blocks";
import { employees, trustBg, trustLevel, type Employee } from "@/lib/mock-data";

export const Route = createFileRoute("/dna")({
  head: () => ({
    meta: [
      { title: "Digital DNA Profiles — SentinelDNA" },
      { name: "description", content: "AI-generated behavioral fingerprints for every employee across 12 dimensions." },
    ],
  }),
  component: DNAPage,
});

const dnaDimensions = [
  { key: "loginPattern", label: "Login Habits" },
  { key: "workHours", label: "Working Hours" },
  { key: "deviceTrust", label: "Device" },
  { key: "browserFingerprint", label: "Browser" },
  { key: "geoConsistency", label: "IP / Geo" },
  { key: "fileAccess", label: "File Access" },
  { key: "appUsage", label: "Apps" },
  { key: "navigation", label: "Navigation" },
  { key: "typingRhythm", label: "Typing" },
  { key: "mouseDynamics", label: "Mouse" },
  { key: "privilegedActions", label: "Privileged" },
  { key: "sessionDuration", label: "Session" },
] as const;

function DNAPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [selected, setSelected] = useState<Employee>(employees[0]);

  const depts = ["all", ...Array.from(new Set(employees.map((e) => e.department)))];
  const filtered = employees.filter(
    (e) =>
      (dept === "all" || e.department === dept) &&
      (search === "" ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()))
  );

  const radarData = dnaDimensions.map((d) => ({
    subject: d.label,
    value: selected.dna[d.key],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital DNA Profiles"
        subtitle="Continuous AI-generated behavioral fingerprints across 12 dimensions"
        actions={<Badge variant="info"><Cpu className="h-3 w-3" /> {employees.length} profiles synced</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          <GlassCard className="p-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employees…"
                  className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm outline-none focus:border-cyan-400/40"
                />
              </div>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-cyan-400/40"
              >
                {depts.map((d) => (
                  <option key={d} value={d} className="bg-slate-900">
                    {d === "all" ? "All departments" : d}
                  </option>
                ))}
              </select>
            </div>
          </GlassCard>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filtered.map((e) => {
              const active = selected.id === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className={`w-full text-left glass rounded-xl p-3 transition-all hover:border-cyan-400/40 ${
                    active ? "border-cyan-400/50 shadow-lg shadow-cyan-500/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-slate-950">
                      {e.avatar}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-900 ${
                          e.status === "online" ? "bg-emerald-400" : e.status === "idle" ? "bg-amber-400" : "bg-slate-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold truncate">{e.name}</span>
                        <span className={`text-sm font-bold tabular-nums ${trustBg(e.trustScore).includes("emerald") ? "text-emerald-400" : trustBg(e.trustScore).includes("cyan") ? "text-cyan-400" : trustBg(e.trustScore).includes("amber") ? "text-amber-400" : "text-rose-400"}`}>
                          {e.trustScore}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {e.role} · {e.department}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 space-y-4">
          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-bold text-slate-950 glow-cyan">
                {selected.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <Badge variant={trustLevel(selected.trustScore) === "high" ? "success" : trustLevel(selected.trustScore) === "medium" ? "info" : trustLevel(selected.trustScore) === "low" ? "warning" : "danger"}>
                    {trustLevel(selected.trustScore)} trust
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{selected.role} · {selected.department}</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Email: </span>{selected.email}</div>
                  <div><span className="text-muted-foreground">ID: </span><span className="font-mono">{selected.id}</span></div>
                  <div><span className="text-muted-foreground">Location: </span>{selected.location}</div>
                  <div><span className="text-muted-foreground">Device: </span>{selected.device}</div>
                </div>
              </div>
              <TrustScoreRing score={selected.trustScore} size={100} label="Trust" />
            </div>
          </GlassCard>

          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard>
              <div className="mb-2 flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-cyan-300" />
                <h3 className="font-semibold">DNA Signature</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">12-dimensional behavioral fingerprint</p>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.4 0.05 240 / 0.25)" />
                  <PolarAngleAxis dataKey="subject" stroke="oklch(0.7 0.02 240 / 0.7)" fontSize={10} />
                  <PolarRadiusAxis stroke="transparent" tick={false} domain={[0, 100]} />
                  <Radar
                    name={selected.name}
                    dataKey="value"
                    stroke="oklch(0.82 0.15 200)"
                    fill="oklch(0.82 0.15 200)"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h3 className="font-semibold mb-3">DNA Dimensions</h3>
              <div className="space-y-2">
                {dnaDimensions.map((d) => {
                  const v = selected.dna[d.key];
                  return (
                    <div key={d.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{d.label}</span>
                        <span className="tabular-nums font-semibold">{v}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${v}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full rounded-full ${
                            v >= 80 ? "bg-gradient-to-r from-emerald-400 to-cyan-400" : v >= 60 ? "bg-gradient-to-r from-cyan-400 to-blue-500" : v >= 40 ? "bg-gradient-to-r from-amber-400 to-orange-400" : "bg-gradient-to-r from-rose-500 to-pink-500"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
