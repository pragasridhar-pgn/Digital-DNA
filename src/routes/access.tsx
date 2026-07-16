import { createFileRoute } from "@tanstack/react-router";
import { Lock, ShieldCheck, KeyRound, EyeOff, AlertOctagon } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, Badge } from "@/components/ui-blocks";
import { employees, accessPolicy, trustLevel } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/access")({
  head: () => ({
    meta: [
      { title: "Adaptive Access Control — SentinelDNA" },
      { name: "description", content: "Automatically enforce Zero Trust responses based on real-time Trust Score." },
    ],
  }),
  component: AccessPage,
});

const policies = [
  { range: "80–100", level: "Full Access", desc: "All resources granted. No friction.", icon: ShieldCheck, color: "emerald" },
  { range: "60–79", level: "MFA Challenge", desc: "Step-up authentication required for sensitive actions.", icon: KeyRound, color: "cyan" },
  { range: "35–59", level: "Read-Only", desc: "Write operations blocked. Read access preserved.", icon: EyeOff, color: "amber" },
  { range: "0–34", level: "Session Isolation", desc: "Tokens revoked. Account locked. Security paged.", icon: AlertOctagon, color: "rose" },
];

function AccessPage() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = employees.filter((e) => {
    if (filter === "all") return true;
    return trustLevel(e.trustScore) === filter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Adaptive Access Control"
        subtitle="Zero Trust that reacts to behavior — not passwords"
        actions={<Badge variant="info"><Lock className="h-3 w-3" /> Policies enforced live</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {policies.map((p) => {
          const Icon = p.icon;
          const colors: Record<string, string> = {
            emerald: "from-emerald-400/20 to-teal-500/10 border-emerald-400/30 text-emerald-300",
            cyan: "from-cyan-400/20 to-blue-500/10 border-cyan-400/30 text-cyan-300",
            amber: "from-amber-400/20 to-orange-500/10 border-amber-400/30 text-amber-300",
            rose: "from-rose-400/20 to-pink-500/10 border-rose-400/30 text-rose-300",
          };
          return (
            <div key={p.level} className={`glass rounded-xl p-5 relative overflow-hidden border ${colors[p.color]}`}>
              <div className={`absolute inset-0 bg-gradient-to-br opacity-30 ${colors[p.color]}`} />
              <div className="relative">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${colors[p.color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">Trust {p.range}</div>
                <div className="mt-1 text-lg font-bold">{p.level}</div>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <GlassCard>
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold">Live Policy Matrix</h3>
          <div className="ml-auto flex gap-1">
            {["all", "high", "medium", "low", "critical"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition ${
                  filter === f ? "bg-cyan-500 text-slate-950" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-white/5">
                <th className="py-2 px-2">User</th>
                <th className="py-2 px-2">Department</th>
                <th className="py-2 px-2">Location</th>
                <th className="py-2 px-2">Trust</th>
                <th className="py-2 px-2">Applied Policy</th>
                <th className="py-2 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map((e) => {
                const policy = accessPolicy(e.trustScore);
                const variant = policy.color === "emerald" ? "success" : policy.color === "cyan" ? "info" : policy.color === "amber" ? "warning" : "danger";
                return (
                  <tr key={e.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-[10px] font-bold text-slate-950">
                          {e.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{e.name}</div>
                          <div className="text-[10px] text-muted-foreground">{e.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 text-muted-foreground">{e.department}</td>
                    <td className="px-2 text-muted-foreground text-xs">{e.location}</td>
                    <td className="px-2">
                      <span className={`font-bold tabular-nums ${trustLevel(e.trustScore) === "high" ? "text-emerald-400" : trustLevel(e.trustScore) === "medium" ? "text-cyan-400" : trustLevel(e.trustScore) === "low" ? "text-amber-400" : "text-rose-400"}`}>
                        {e.trustScore}
                      </span>
                    </td>
                    <td className="px-2">
                      <Badge variant={variant}>{policy.level}</Badge>
                    </td>
                    <td className="px-2 text-right">
                      <button className="text-xs rounded-md border border-white/10 bg-white/5 px-2.5 py-1 hover:bg-white/10 transition">
                        Override
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
