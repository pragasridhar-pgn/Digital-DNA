import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, StatCard, Badge } from "@/components/ui-blocks";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { departmentRisk, trustHistory } from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — SentinelDNA" },
      { name: "description", content: "Compliance-ready reports of trust posture, incidents and adaptive access decisions." },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  { id: "R-2024-Q4-01", name: "Executive Trust Posture — Q4 2024", type: "Executive", date: "Nov 3, 2026", size: "4.2 MB" },
  { id: "R-2024-11-INC", name: "Insider Threat Incident Digest — November", type: "Compliance", date: "Nov 1, 2026", size: "1.8 MB" },
  { id: "R-SOC2-2024", name: "SOC 2 Type II Evidence Bundle", type: "Audit", date: "Oct 28, 2026", size: "12.4 MB" },
  { id: "R-GDPR-Q3", name: "GDPR Behavioral Data Audit", type: "Compliance", date: "Oct 15, 2026", size: "2.1 MB" },
  { id: "R-DNA-BASE", name: "DNA Baseline Coverage Report", type: "Operational", date: "Oct 12, 2026", size: "3.7 MB" },
  { id: "R-ACCESS-01", name: "Adaptive Access Decisions — 30 day log", type: "Operational", date: "Oct 1, 2026", size: "8.9 MB" },
];

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Compliance"
        subtitle="Board-ready trust analytics and audit evidence"
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-slate-950">
            <FileText className="h-4 w-4" /> Generate report
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Reports available" value="42" icon={<FileText className="h-5 w-5" />} accent="cyan" />
        <StatCard label="Incidents this month" value="18" delta="-24% vs last" icon={<TrendingUp className="h-5 w-5" />} accent="emerald" />
        <StatCard label="Avg trust posture" value="87.4" delta="+3.1 pts" icon={<TrendingUp className="h-5 w-5" />} accent="violet" />
        <StatCard label="Compliance frameworks" value="6" icon={<FileText className="h-5 w-5" />} accent="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="font-semibold mb-2">Monthly Trust Trajectory</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trustHistory}>
              <CartesianGrid stroke="oklch(0.4 0.05 240 / 0.15)" vertical={false} />
              <XAxis dataKey="time" stroke="oklch(0.7 0.02 240 / 0.6)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.7 0.02 240 / 0.6)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.03 250)", border: "1px solid oklch(0.4 0.05 240 / 0.3)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="org" stroke="oklch(0.82 0.15 200)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-2">Risk by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentRisk} layout="vertical">
              <CartesianGrid stroke="oklch(0.4 0.05 240 / 0.15)" horizontal={false} />
              <XAxis type="number" stroke="oklch(0.7 0.02 240 / 0.6)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis dataKey="department" type="category" stroke="oklch(0.7 0.02 240 / 0.6)" fontSize={11} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.03 250)", border: "1px solid oklch(0.4 0.05 240 / 0.3)", borderRadius: 8 }} />
              <Bar dataKey="risk" fill="oklch(0.82 0.15 200)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="font-semibold mb-3">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-white/5">
                <th className="py-2 px-2">Report</th>
                <th className="py-2 px-2">Type</th>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Size</th>
                <th className="py-2 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-3 px-2">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{r.id}</div>
                  </td>
                  <td className="px-2"><Badge variant="info">{r.type}</Badge></td>
                  <td className="px-2 text-muted-foreground text-xs"><Calendar className="h-3 w-3 inline mr-1" />{r.date}</td>
                  <td className="px-2 text-muted-foreground text-xs">{r.size}</td>
                  <td className="px-2 text-right">
                    <button className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:bg-white/10 inline-flex items-center gap-1">
                      <Download className="h-3 w-3" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
