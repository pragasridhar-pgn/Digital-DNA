import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Fingerprint,
  Activity,
  Sparkles,
  History,
  ShieldAlert,
  Lock,
  AlertOctagon,
  FileText,
  Settings as SettingsIcon,
  Shield,
  Search,
  Bell,
  User,
} from "lucide-react";
import { type ReactNode } from "react";

const navItems = [
  { to: "/", label: "Executive Dashboard", icon: LayoutDashboard },
  { to: "/dna", label: "Digital DNA Profiles", icon: Fingerprint },
  { to: "/trust", label: "Live Trust Monitor", icon: Activity },
  { to: "/guardian", label: "AI Guardian", icon: Sparkles },
  { to: "/timeline", label: "Trust Timeline", icon: History },
  { to: "/insider", label: "Insider Threat Center", icon: ShieldAlert },
  { to: "/access", label: "Adaptive Access Control", icon: Lock },
  { to: "/incidents", label: "Incident Center", icon: AlertOctagon },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative min-h-screen w-full text-foreground overflow-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl float-slow" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-3xl float-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl float-slow" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/5 glass lg:flex">
          <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 glow-cyan">
              <Shield className="h-5 w-5 text-slate-950" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-wide gradient-text">SentinelDNA</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Zero Trust AI</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-100 shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute left-0 h-6 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-500"
                    />
                  )}
                  <Icon className={`h-4 w-4 ${active ? "text-cyan-300" : ""}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/5 p-3">
            <div className="flex items-center gap-3 rounded-lg glass px-3 py-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-slate-950">
                AK
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-semibold">Alex Kessler</div>
                <div className="truncate text-[10px] text-muted-foreground">CISO · Trust 98</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-400 pulse-ring" />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:pl-64">
          {/* Top bar */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-white/5 glass px-4 md:px-8">
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
                <Shield className="h-4 w-4 text-slate-950" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold gradient-text">SentinelDNA</span>
            </div>
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search users, incidents, or DNA fingerprints…"
                  className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm outline-none focus:border-cyan-400/40 focus:bg-white/10 transition"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-ring" />
                <span className="text-emerald-300 font-medium">AI Engine Live</span>
              </div>
              <button className="relative rounded-lg p-2 hover:bg-white/5 transition">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold">3</span>
              </button>
              <button className="rounded-lg p-2 hover:bg-white/5 transition">
                <User className="h-4 w-4" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
