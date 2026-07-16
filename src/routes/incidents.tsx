import { createFileRoute } from "@tanstack/react-router";
import { AlertOctagon, Filter, Search, ChevronDown, User, Clock, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, Badge } from "@/components/ui-blocks";
import { incidents, type Incident } from "@/lib/mock-data";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "Incident Center — SentinelDNA" },
      { name: "description", content: "Investigate, triage and resolve security incidents with full trust-evidence chains." },
    ],
  }),
  component: IncidentsPage,
});

const severityVariant: Record<Incident["severity"], "danger" | "warning" | "info" | "default"> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "default",
};

const statusVariant: Record<Incident["status"], "warning" | "info" | "success"> = {
  open: "warning",
  investigating: "info",
  resolved: "success",
};

function IncidentsPage() {
  const [severity, setSeverity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(incidents[0].id);

  const filtered = incidents.filter(
    (i) =>
      (severity === "all" || i.severity === severity) &&
      (status === "all" || i.status === status) &&
      (search === "" || i.title.toLowerCase().includes(search.toLowerCase()) || i.user.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Center"
        subtitle="Trust-driven incidents with full evidence chains"
        actions={
          <>
            <Badge variant="danger">{incidents.filter((i) => i.status === "open").length} open</Badge>
            <Badge variant="info">{incidents.filter((i) => i.status === "investigating").length} investigating</Badge>
          </>
        }
      />

      <GlassCard>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents…"
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm outline-none focus:border-cyan-400/40"
            />
          </div>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none">
            <option value="all" className="bg-slate-900">All severity</option>
            <option value="critical" className="bg-slate-900">Critical</option>
            <option value="high" className="bg-slate-900">High</option>
            <option value="medium" className="bg-slate-900">Medium</option>
            <option value="low" className="bg-slate-900">Low</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none">
            <option value="all" className="bg-slate-900">All status</option>
            <option value="open" className="bg-slate-900">Open</option>
            <option value="investigating" className="bg-slate-900">Investigating</option>
            <option value="resolved" className="bg-slate-900">Resolved</option>
          </select>
          <button className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm hover:bg-white/10 inline-flex items-center gap-2">
            <Filter className="h-3.5 w-3.5" /> Advanced
          </button>
        </div>
      </GlassCard>

      <div className="space-y-3">
        {filtered.map((inc) => {
          const isOpen = expanded === inc.id;
          return (
            <GlassCard key={inc.id} className="p-0 overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : inc.id)}
                className="w-full text-left p-4 hover:bg-white/[0.03] transition flex items-center gap-4"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  inc.severity === "critical" ? "bg-rose-500/20 text-rose-300" :
                  inc.severity === "high" ? "bg-amber-500/20 text-amber-300" :
                  inc.severity === "medium" ? "bg-cyan-500/20 text-cyan-300" : "bg-white/5"
                }`}>
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{inc.id}</span>
                    <span className="font-semibold">{inc.title}</span>
                    <Badge variant={severityVariant[inc.severity]}>{inc.severity}</Badge>
                    <Badge variant={statusVariant[inc.status]}>{inc.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
                    <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {inc.user}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {inc.time}</span>
                    <span className="text-rose-400 font-semibold">Trust {inc.trustImpact}</span>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 overflow-hidden"
                  >
                    <div className="p-4 grid gap-4 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <div className="text-[10px] uppercase tracking-widest text-cyan-300">Analysis</div>
                        <p className="text-sm mt-1">{inc.description}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                            <div className="text-muted-foreground">First seen</div>
                            <div className="font-semibold">{inc.time}</div>
                          </div>
                          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2">
                            <div className="text-muted-foreground">Trust impact</div>
                            <div className="font-semibold text-rose-400">{inc.trustImpact}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-sm font-semibold text-slate-950">
                          Contain user
                        </button>
                        <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
                          Assign to analyst
                        </button>
                        <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
                          Mark resolved
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          );
        })}
        {filtered.length === 0 && (
          <GlassCard className="text-center py-10">
            <AlertOctagon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No incidents match your filters.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
