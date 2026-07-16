import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Shield, User } from "lucide-react";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "SentinelDNA - Continuous Trust Security" },
      { name: "description", content: "SentinelDNA landing page for secure enterprise access with sign in and sign up." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_28%)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-2xl shadow-slate-900/30 backdrop-blur-xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6 text-white">
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.3em] text-cyan-200">
              <Shield className="h-5 w-5 text-cyan-300" />
              SentinelDNA
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Continuous trust for every enterprise login.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                SentinelDNA combines adaptive authentication, behavioral risk signals, and real-time session intelligence to secure your workforce from the first access attempt.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                to="/login"
                search="?mode=signin"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-105"
              >
                <ShieldCheck className="h-4 w-4" />
                Sign in
              </Link>
              <Link
                to="/login"
                search="?mode=signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                Sign up
              </Link>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">What you get</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" /> Continuous identity verification</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" /> Adaptive trust-based access decisions</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" /> Enterprise-grade incident and risk analytics</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
            <div className="space-y-5">
              <div className="rounded-3xl bg-slate-950/80 p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">SentinelDNA</div>
                <h2 className="mt-4 text-2xl font-semibold text-white">Secure access on day one</h2>
                <p className="mt-3 text-sm text-slate-400">Start signing in with your corporate account or register a new enterprise profile to access the SentinelDNA dashboard.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">Trusted by operations</div>
                <div className="mt-4 grid gap-3">
                  <Feature label="Identity-driven sessions" />
                  <Feature label="Behavioral risk scoring" />
                  <Feature label="Adaptive zero trust" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-cyan-400 text-slate-950">+</span>
      <span>{label}</span>
    </div>
  );
}
