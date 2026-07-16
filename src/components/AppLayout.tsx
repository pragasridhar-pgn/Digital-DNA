import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Users,
} from "lucide-react";
import { type ReactNode } from "react";
import { getAuthUser, signOut, type AuthSession } from "@/lib/auth";

const navItems = [
  { to: "/", label: "Executive Dashboard", icon: LayoutDashboard },
  { to: "/dna", label: "Digital DNA Profiles", icon: Fingerprint },
  { to: "/trust", label: "Live Trust Monitor", icon: Activity },
  { to: "/active-users", label: "Active Users", icon: Users },
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
  const router = useRouter();
  const isLoginRoute = pathname === "/login";
  const isLandingRoute = pathname === "/landing";
  const [authUser, setAuthUser] = useState<AuthSession | null>(null);

  useEffect(() => {
    setAuthUser(getAuthUser());
  }, []);

  const initials = useMemo(() => {
    if (!authUser) return "SD";
    return authUser.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [authUser]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (isLoginRoute || isLandingRoute) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  return (
    <div className="relative min-h-screen w-full text-foreground overflow-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-slate-100/30 blur-3xl float-slow" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-slate-100/20 blur-3xl float-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-slate-100/15 blur-3xl float-slow" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 grid-bg opacity-15" />
      </div>

      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/5 glass lg:flex">
          <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
              <Shield className="h-5 w-5 text-slate-900" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-wide text-slate-900">SentinelDNA</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Zero Trust AI</span>
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
                      ? "bg-slate-100 text-slate-900 shadow-inner"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute left-0 h-6 w-1 rounded-r-full bg-slate-500/40"
                    />
                  )}
                  <Icon className="h-4 w-4 text-slate-700" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-200/70 p-3">
            <div className="flex items-center gap-3 rounded-lg glass px-3 py-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-900">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-semibold text-slate-900">{authUser?.name ?? "SentinelDNA User"}</div>
                <div className="truncate text-[10px] text-slate-500">
                  {authUser?.role ?? "Platform User"} · {authUser?.department ?? "Security"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  router.navigate({ to: "/login" });
                }}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-200 transition"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:pl-64">
          {/* Top bar */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-white/5 glass px-4 md:px-8">
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                <Shield className="h-4 w-4 text-slate-900" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-900">SentinelDNA</span>
            </div>
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  placeholder="Search users, incidents, or DNA fingerprints…"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-100/80 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:bg-white transition"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3 relative">
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-100/70 px-3 py-1.5 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 pulse-ring" />
                <span className="text-slate-600 font-medium">AI Engine Live</span>
              </div>
              <button className="relative rounded-lg p-2 hover:bg-slate-100 transition">
                <Bell className="h-4 w-4 text-slate-700" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white">3</span>
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition hover:bg-slate-50"
                aria-expanded={menuOpen}
                aria-label="Account menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-900">
                  {initials}
                </span>
                <span className="hidden sm:inline-flex flex-col items-start text-left">
                  <span className="text-xs font-semibold text-slate-900">{authUser?.name ?? "SentinelDNA User"}</span>
                  <span className="text-[10px] text-slate-500">{authUser?.role ?? "Platform User"}</span>
                </span>
              </button>
              {menuOpen ? (
                <div ref={menuRef} className="absolute right-0 top-full mt-3 w-64 rounded-3xl border border-slate-200/70 bg-white/95 p-4 shadow-2xl shadow-slate-300/20 backdrop-blur-xl">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-900">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{authUser?.name ?? "SentinelDNA User"}</div>
                      <div className="truncate text-[11px] text-slate-500">{authUser?.department ?? "Security"} · {authUser?.role ?? "Platform User"}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                      router.navigate({ to: "/login" });
                    }}
                    className="w-full rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
