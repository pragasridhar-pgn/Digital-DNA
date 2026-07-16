import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock3, MapPin } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, TrustScoreRing, Badge } from "@/components/ui-blocks";
import { getAuthUser } from "@/lib/auth";
import { employees, trustLevel, type Employee } from "@/lib/mock-data";

export const Route = createFileRoute("/employee/$employeeId")({
  head: () => ({
    meta: [
      { title: "Employee Trust Detail — SentinelDNA" },
      { name: "description", content: "Detailed employee trust score and behavior analytics." },
    ],
  }),
  component: EmployeeDetailPage,
});

function EmployeeDetailPage({ params }: { params: { employeeId: string } }) {
  const [authUser, setAuthUser] = useState(() => getAuthUser());

  useEffect(() => {
    setAuthUser(getAuthUser());
  }, []);

  const targetEmployees = useMemo(() => {
    if (authUser?.role === "Super Admin") return employees;
    if (authUser) return employees.filter((employee) => employee.department === authUser.department);
    return employees;
  }, [authUser]);

  const selected = useMemo(
    () => targetEmployees.find((employee) => employee.id === params.employeeId) ?? null,
    [params.employeeId, targetEmployees]
  );

  if (!selected) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Employee not found"
          subtitle="The selected employee is not available in your access scope."
        />
        <GlassCard className="p-8 text-center">
          <p className="text-sm text-slate-600">Please return to the active user directory or select another employee.</p>
          <Link
            to="/active-users"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-2">Back to Active Users</span>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Trust Detail"
        subtitle={`Detailed trust analytics for ${selected.name}`}
        actions={
          <Link
            to="/active-users"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl font-bold text-slate-950">
              {selected.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{selected.name}</h2>
              <div className="text-sm text-slate-600">{selected.role} · {selected.department}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                <span>{selected.status}</span>
                <span>{selected.location}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Email</div>
              <div className="mt-2 text-sm text-slate-900">{selected.email}</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Device</div>
              <div className="mt-2 text-sm text-slate-900">{selected.device}</div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Last activity</div>
              <div className="mt-2 font-semibold text-slate-900">{selected.lastActivity}</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</div>
              <div className="mt-2 font-semibold text-slate-900">{selected.location}</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Trust level</div>
              <div className="mt-2 font-semibold text-slate-900">{trustLevel(selected.trustScore)}</div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <h3 className="font-semibold">Behavioral signals</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {Object.entries(selected.dna).map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/80 p-3 text-sm">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label.replace(/([A-Z])/g, " $1")}</div>
                  <div className="mt-2 font-semibold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-5">
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Trust score</div>
                <div className="text-3xl font-semibold text-slate-900">{selected.trustScore}</div>
              </div>
              <TrustScoreRing score={selected.trustScore} size={120} />
            </div>
            <div className="mt-4 text-sm text-slate-600">This score reflects the employee's session behavior across device, geo, app usage, and privilege signals.</div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">Recent activity</div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/80 p-3">
                <div className="text-sm font-semibold text-slate-900">Session start</div>
                <div className="mt-1 text-xs text-slate-600"><MapPin className="inline h-3.5 w-3.5 text-cyan-300" /> {selected.location}</div>
              </div>
              <div className="rounded-2xl bg-white/80 p-3">
                <div className="text-sm font-semibold text-slate-900">Device signal</div>
                <div className="mt-1 text-xs text-slate-600"><Clock3 className="inline h-3.5 w-3.5 text-cyan-300" /> {selected.device}</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
