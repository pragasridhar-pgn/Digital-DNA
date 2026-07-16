import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { trustColor, trustLevel } from "@/lib/mock-data";

export function GlassCard({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`glass rounded-xl p-5 ${hover ? "transition-all hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  accent = "cyan",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: ReactNode;
  accent?: "cyan" | "emerald" | "amber" | "rose" | "violet";
}) {
  const accents: Record<string, string> = {
    cyan: "from-cyan-400/20 to-blue-500/10 text-cyan-300 border-cyan-400/30",
    emerald: "from-emerald-400/20 to-teal-500/10 text-emerald-300 border-emerald-400/30",
    amber: "from-amber-400/20 to-orange-500/10 text-amber-300 border-amber-400/30",
    rose: "from-rose-400/20 to-pink-500/10 text-rose-300 border-rose-400/30",
    violet: "from-violet-400/20 to-indigo-500/10 text-violet-300 border-violet-400/30",
  };
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass rounded-xl p-5 relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-40 ${accents[accent]}`} />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-glow">{value}</div>
          {delta && (
            <div className="mt-1 text-xs text-muted-foreground">
              <span className={delta.startsWith("+") ? "text-emerald-400" : delta.startsWith("-") ? "text-rose-400" : ""}>
                {delta}
              </span>
            </div>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-gradient-to-br ${accents[accent]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export function TrustScoreRing({ score, size = 120, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const level = trustLevel(score);
  const stroke = {
    high: "oklch(0.75 0.17 155)",
    medium: "oklch(0.82 0.15 200)",
    low: "oklch(0.8 0.17 80)",
    critical: "oklch(0.65 0.24 25)",
  }[level];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`grad-${size}-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.9" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="oklch(0.3 0.03 240 / 0.4)" strokeWidth="6" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#grad-${size}-${score})`}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${stroke})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-3xl font-bold tabular-nums ${trustColor(score)}`}>{score}</div>
        {label && <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>}
      </div>
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "success" | "warning" | "danger" | "info" }) {
  const styles = {
    default: "bg-white/5 text-slate-300 border-white/10",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    info: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
