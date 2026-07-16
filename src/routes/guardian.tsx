import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Brain, ShieldAlert, CheckCircle2, Lightbulb, TrendingDown, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { GlassCard, Badge } from "@/components/ui-blocks";

export const Route = createFileRoute("/guardian")({
  head: () => ({
    meta: [
      { title: "AI Guardian — SentinelDNA" },
      { name: "description", content: "AI security copilot that explains every trust decision with evidence and recommendations." },
    ],
  }),
  component: GuardianPage,
});

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
  evidence?: string[];
  recommendation?: string;
  impact?: string;
};

const seed: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "Trust dropped 32 points for Riya Patel. I detected an impossible-travel event combined with a keystroke biometric mismatch. Session has been isolated pending review.",
    evidence: [
      "Login from Singapore 12 min after Mumbai session (geo distance: 13,600 km)",
      "Typing dwell time deviates 84% from 30-day baseline",
      "Device fingerprint absent from MDM inventory",
      "Attempted access to /finance/2024-audit (never accessed before)",
    ],
    recommendation: "Isolate session, revoke active tokens, initiate incident IR-4821, and require in-person identity verification before restoring access.",
    impact: "Prevents potential exfiltration of ~12GB regulated financial data. Blocking now avoids an estimated $2.4M breach cost vs. detected within 24h.",
  },
];

const suggested = [
  "Why did Kiran Iyer's trust score drop?",
  "Summarize today's critical incidents",
  "Predict impact of granting admin access to Vikram Nair",
  "Which department has the highest anomaly rate?",
];

function GuardianPage() {
  const [messages, setMessages] = useState<Message[]>(seed);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "ai",
          text: `Analyzing behavioral evidence for "${text}"… I've cross-referenced 12 DNA dimensions and 30-day baselines to construct this response.`,
          evidence: [
            "Cross-referenced 42 employee profiles",
            "Analyzed 947 active sessions against baselines",
            "Consulted 3,201 historical trust events",
            "AI confidence: 96.4% (high)",
          ],
          recommendation: "Review the highlighted anomalies and apply the suggested adaptive access policy for at-risk users.",
          impact: "Applying the recommendation reduces attack surface by ~38% and avoids projected 4.2 hours of SOC investigation time.",
        },
      ]);
    }, 800);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Guardian"
        subtitle="Your AI security copilot — every trust decision explained"
        actions={<Badge variant="info"><Brain className="h-3 w-3" /> Model: SentinelDNA-Guardian v4.2</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <GlassCard className="lg:col-span-3 flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "ai" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 glow-cyan">
                      <Sparkles className="h-4 w-4 text-slate-950" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${m.role === "user" ? "order-first" : ""}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm ${
                      m.role === "ai" ? "glass border border-cyan-400/20" : "bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-medium"
                    }`}>
                      {m.text}
                    </div>
                    {m.evidence && (
                      <div className="mt-2 space-y-2">
                        <div className="glass rounded-xl p-3">
                          <div className="text-[10px] uppercase tracking-widest text-cyan-300 flex items-center gap-1.5"><ShieldAlert className="h-3 w-3" /> Evidence</div>
                          <ul className="mt-1.5 space-y-1 text-xs">
                            {m.evidence.map((e, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 h-1 w-1 rounded-full bg-cyan-400 shrink-0" />
                                <span className="text-slate-300">{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {m.recommendation && (
                          <div className="glass rounded-xl p-3 border border-amber-400/20">
                            <div className="text-[10px] uppercase tracking-widest text-amber-300 flex items-center gap-1.5"><Lightbulb className="h-3 w-3" /> Recommended Action</div>
                            <p className="mt-1 text-xs text-slate-300">{m.recommendation}</p>
                          </div>
                        )}
                        {m.impact && (
                          <div className="glass rounded-xl p-3 border border-violet-400/20">
                            <div className="text-[10px] uppercase tracking-widest text-violet-300 flex items-center gap-1.5"><TrendingDown className="h-3 w-3" /> Predicted Business Impact</div>
                            <p className="mt-1 text-xs text-slate-300">{m.impact}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="mt-4 flex gap-2 border-t border-white/5 pt-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Guardian anything — 'Why did trust change for…'"
              className="flex-1 h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-cyan-400/40"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </form>
        </GlassCard>

        <div className="space-y-3">
          <GlassCard>
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-cyan-300" /> Suggested prompts</h3>
            <div className="space-y-2">
              {suggested.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full text-left text-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 hover:border-cyan-400/30 transition flex items-center justify-between group"
                >
                  <span>{s}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-cyan-300 transition" />
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> AI Health</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Confidence</span><span className="font-semibold text-emerald-400">96.4%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Baselines synced</span><span className="font-semibold">1,284 / 1,284</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Decisions / min</span><span className="font-semibold">2,140</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Model version</span><span className="font-mono">v4.2.7</span></div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
