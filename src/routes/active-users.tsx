import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, Clock3, MapPin, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, TrustScoreRing, Badge } from "@/components/ui-blocks";
import { getAuthUser } from "@/lib/auth";
import { employees, trustBg, trustLevel, type Employee } from "@/lib/mock-data";

export const Route = createFileRoute("/active-users")({
  head: () => ({
    meta: [
      { title: "Active Users — SentinelDNA" },
      { name: "description", content: "Department-aware active user trust monitoring with employee details." },
    ],
  }),
  component: ActiveUsersPage,
});

function ActiveUsersPage() {
  const [authUser, setAuthUser] = useState(() => getAuthUser());

  useEffect(() => {
    setAuthUser(getAuthUser());
  }, []);

  const isSuperAdmin = authUser?.role === "Super Admin";
  const visibleEmployees = useMemo(() => {
    if (isSuperAdmin) return employees;
    if (!authUser) return [];
    return employees.filter((employee) => employee.department === authUser.department);
  }, [authUser, isSuperAdmin]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee | null>(visibleEmployees[0] ?? null);
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "idle" | "offline">("all");

  useEffect(() => {
    setSelected(visibleEmployees[0] ?? null);
  }, [visibleEmployees]);

  const filteredEmployees = useMemo(() => {
    return visibleEmployees.filter((employee) => {
      const matchesSearch = search === "" || employee.name.toLowerCase().includes(search.toLowerCase()) || employee.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, visibleEmployees]);

  const groupedByDepartment = useMemo(() => {
    return filteredEmployees.reduce<Record<string, Employee[]>>((groups, employee) => {
      const key = employee.department;
      groups[key] = groups[key] ?? [];
      groups[key].push(employee);
      return groups;
    }, {});
  }, [filteredEmployees]);

  const employeeActivities = useMemo(() => {
    if (!selected) return [];
    return [
      {
        title: "Recent session",
        description: `${selected.lastActivity} on ${selected.device} from ${selected.location}`,
      },
      {
        title: "Behavioral signal",
        description: `Device trust ${selected.dna.deviceTrust} and geo consistency ${selected.dna.geoConsistency} indicate ${selected.dna.geoConsistency >= 70 ? "stable" : "elevated"} risk.`,
      },
      {
        title: "Trust trend",
        description: `Current trust score is ${selected.trustScore}, ${trustLevel(selected.trustScore) === "high" ? "routine" : trustLevel(selected.trustScore) === "medium" ? "review recommended" : "escalation likely"}.`,
      },
    ];
  }, [selected]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Users"
        subtitle={isSuperAdmin ? "Full workforce trust visibility and employee detail access." : `Department view for ${authUser?.department ?? "your"} team members.`}
        actions={
          <Badge variant="info">
            <Users className="h-3 w-3" /> {isSuperAdmin ? "Super Admin" : `${authUser?.department ?? "Department"} Access`}
          </Badge>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <GlassCard className="xl:col-span-3">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">Employee directory</h3>
              <p className="text-xs text-muted-foreground">Click any employee to inspect trust details and activity history.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px] md:min-w-[260px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or email"
                  className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm outline-none focus:border-cyan-400/40"
                />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Status</span>
                {(["all", "online", "idle", "offline"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full px-3 py-1 text-xs transition ${statusFilter === status ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-white/10"}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {Object.entries(groupedByDepartment).map(([departmentName, employeesInDept]) => (
              <div key={departmentName} className="space-y-2">
                <div className="rounded-2xl bg-slate-950/10 p-3 text-xs uppercase tracking-[0.28em] text-slate-500">{departmentName}</div>
                <div className="space-y-2">
                  {employeesInDept.map((employee) => (
                    <Link
                      key={employee.id}
                      to={`/employee/${employee.id}`}
                      className={`w-full text-left rounded-3xl border px-4 py-3 transition ${selected?.id === employee.id ? "border-cyan-300 bg-slate-100/80" : "border-white/10 bg-white/5 hover:border-cyan-300/40 hover:bg-white/10"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{employee.name}</div>
                          <div className="text-[11px] text-muted-foreground">{employee.role}</div>
                        </div>
                        <span className={`text-sm font-semibold tabular-nums ${trustLevel(employee.trustScore) === "high" ? "text-emerald-400" : trustLevel(employee.trustScore) === "medium" ? "text-cyan-400" : trustLevel(employee.trustScore) === "low" ? "text-amber-400" : "text-rose-400"}`}>
                          {employee.trustScore}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="xl:col-span-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">Employee details</h3>
              <p className="text-xs text-muted-foreground">Trust score, department metrics, and recent activity.</p>
            </div>
            {selected ? (
              <Badge variant={trustLevel(selected.trustScore) === "high" ? "success" : trustLevel(selected.trustScore) === "medium" ? "info" : trustLevel(selected.trustScore) === "low" ? "warning" : "danger"}>
                {trustLevel(selected.trustScore)} trust
              </Badge>
            ) : null}
          </div>

          {selected ? (
            <div className="mt-6 space-y-5">
              <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-bold text-slate-950">
                    {selected.avatar}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{selected.name}</div>
                    <div className="text-xs text-muted-foreground">{selected.role} · {selected.department}</div>
                  </div>
                </div>
                <div className="grid gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-cyan-300" /> {selected.location}</div>
                  <div className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-cyan-300" /> {selected.lastActivity} · {selected.status}</div>
                  <div className="text-xs"><span className="font-semibold">Device:</span> {selected.device}</div>
                  <div className="text-xs"><span className="font-semibold">Email:</span> {selected.email}</div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Trust Score</div>
                    <div className="text-2xl font-semibold text-slate-900">{selected.trustScore}</div>
                  </div>
                  <TrustScoreRing score={selected.trustScore} size={100} label="of 100" />
                </div>
                <div className="text-sm text-slate-600">Employee trust is derived from behavioral signals, device posture, and activity context.</div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Previous activity</div>
                    <div className="text-sm font-semibold text-slate-900">Latest trust events</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {employeeActivities.map((activity) => (
                    <div key={activity.title} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs font-semibold text-slate-900">{activity.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{activity.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">No employees are available for your access scope.</div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
