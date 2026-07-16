import { createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAuthenticated, signIn } from "@/lib/auth";
import { findUserByEmail, findProviderUser, getDepartments, getRolesByDepartment, saveLocalUser } from "@/lib/users";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Secure Login — SentinelDNA" },
      { name: "description", content: "Secure access to the SentinelDNA security console with adaptive authentication." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("arjun.sharma@sentineldna.io");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("Executive");
  const [role, setRole] = useState("Super Admin");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const search = useRouterState({ select: (s) => s.location.search });

  useEffect(() => {
    if (isAuthenticated()) {
      router.navigate({ to: "/" });
    }
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const modeParam = params.get("mode");
    if (modeParam === "signup") {
      setMode("signup");
    } else if (modeParam === "signin") {
      setMode("signin");
    }
  }, [search]);

  const availableRoles = useMemo(() => getRolesByDepartment(department), [department]);
  const selectedRole = availableRoles.includes(role) ? role : availableRoles[0] ?? "Super Admin";

  useEffect(() => {
    if (mode !== "signin") return;
    const normalizedEmail = email.trim().toLowerCase();
    const user = findUserByEmail(normalizedEmail);
    if (user?.provider === "local") {
      setDepartment(user.department);
      setRole(user.role);
    }
  }, [email, mode]);

  const validateEmailAddress = (value: string) => value.trim().length > 0 && /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!validateEmailAddress(normalizedEmail)) {
      setError("Enter a valid corporate email.");
      return;
    }

    if (mode === "signin") {
      const user = findUserByEmail(normalizedEmail);
      if (!user) {
        setError("No account found for that email.");
        return;
      }
      if (user.provider !== "local") {
        setError(`Please sign in with ${user.provider}.`);
        return;
      }
      if (!password) {
        setError("Please enter your password.");
        return;
      }
      if (user.password !== password) {
        setError("Invalid password. Check your credentials and try again.");
        return;
      }
      if (user.department !== department || user.role !== selectedRole) {
        setError("Selected department or role does not match the account.");
        return;
      }
      setLoading(true);
      window.setTimeout(() => {
        signIn({
          email: user.email,
          name: user.name,
          department: user.department,
          role: user.role,
          provider: user.provider,
        });
        router.navigate({ to: "/" });
      }, 450);
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!password) {
        setError("Choose a secure password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (findUserByEmail(normalizedEmail)) {
        setError("An account already exists for that email.");
        return;
      }
      setLoading(true);
      window.setTimeout(() => {
        saveLocalUser({
          email: normalizedEmail,
          password,
          name: name.trim(),
          department,
          role: selectedRole,
          provider: "local",
        });
        signIn({
          email: normalizedEmail,
          name: name.trim(),
          department,
          role: selectedRole,
          provider: "local",
        });
        router.navigate({ to: "/" });
      }, 450);
      return;
    }
  };

  const handleSocial = (provider: "Google" | "Microsoft") => {
    setError(null);
    const user = findProviderUser(provider);
    if (!user) {
      setError(`No ${provider} account is configured for this demo.`);
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      signIn({
        email: user.email,
        name: user.name,
        department: user.department,
        role: user.role,
        provider: user.provider ?? provider.toLowerCase(),
      });
      router.navigate({ to: "/" });
    }, 450);
  };

  const switchMode = (nextMode: "signin" | "signup") => {
    setMode(nextMode);
    setError(null);
    setPassword("");
    setConfirmPassword("");
    if (nextMode === "signup") {
      setName("");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,_rgba(148,163,184,0.08),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(148,163,184,0.06),_transparent_25%),radial-gradient(circle_at_50%_80%,_rgba(203,213,225,0.05),_transparent_40%)] py-16 px-4 sm:py-24">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200/60 bg-white/95 p-6 shadow-2xl shadow-slate-300/10 backdrop-blur-3xl sm:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 text-slate-900">
            <div className="w-full rounded-3xl bg-slate-50 border border-slate-200/70 p-5 backdrop-blur-xl shadow-lg shadow-slate-200/50">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-700">
                <ShieldCheck className="h-4 w-4 text-slate-700" />
                Secure access enforced
              </div>
              <p className="mt-4 text-sm text-slate-600 leading-7">
                SentinelDNA protects your corporate access with enterprise-grade authentication, continuous trust verification, and adaptive session intelligence.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl bg-slate-50 p-6 shadow-[0_30px_80px_-30px_rgba(148,163,184,0.15)] border border-slate-200/70">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {mode === "signin" ? "Sign in to your console" : "Create your SentinelDNA account"}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {mode === "signin"
                    ? "Access the SOC dashboard with your corporate identity and layered authentication."
                    : "Register a secure local account for your enterprise security operations team."}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 border border-slate-200">
                <p className="font-semibold text-slate-900">{mode === "signin" ? "Professional access" : "Enterprise onboarding"}</p>
                <p className="mt-2 text-slate-600">
                  {mode === "signin"
                    ? "Use your company email and secure credentials to maintain trusted access across the platform."
                    : "Register an enterprise account with role-based access and verified session controls."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 border border-slate-200/70">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Enterprise policy</p>
                <p className="mt-3 text-sm text-slate-600 leading-6">Continuous verification, geo-aware session protection, and risk-adaptive MFA reduce attack surface without slowing your team.</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5 border border-slate-200/70">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Compliance ready</p>
                <p className="mt-3 text-sm text-slate-600 leading-6">Audit-ready identity records and access logs are enforced the moment a session starts.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-xl shadow-slate-200/20 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Corporate access</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {mode === "signin" ? "Secure login" : "Professional sign up"}
                </h2>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-700">
                {mode === "signin" ? "Secure" : "Verified"}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2 rounded-3xl border border-slate-200/80 bg-slate-50 p-3 text-sm text-slate-600">
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={`rounded-2xl px-3 py-2 transition ${mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-500 hover:text-slate-900"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`rounded-2xl px-3 py-2 transition ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-500 hover:text-slate-900"}`}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Company Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="analyst@corp.io"
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              {mode === "signup" ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Arjun Sharma"
                    autoComplete="name"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={mode === "signin" ? "Enter your password" : "Choose a secure password"}
                    className="pr-10 pl-10"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === "signup" ? (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat your password"
                    className="pl-3"
                    autoComplete="new-password"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {getDepartments().map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-950 text-slate-50">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {availableRoles.map((option) => (
                    <option key={option} value={option} className="bg-slate-950 text-slate-50">
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {mode === "signin" ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                    <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(Boolean(checked))} />
                    Remember me on this device
                  </label>
                  <button
                    type="button"
                    onClick={() => window.alert("Password recovery is not enabled in this demo.")}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : null}

              {error ? <div className="rounded-xl border border-slate-300/60 bg-slate-50 px-4 py-3 text-sm text-slate-800">{error}</div> : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (mode === "signin" ? "Signing in…" : "Creating account…") : mode === "signin" ? "Sign in" : "Sign up"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
              or continue with
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => handleSocial("Google")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 transition hover:bg-slate-200"
              >
                <span className="h-5 w-5 rounded-full bg-slate-200 grid place-items-center text-slate-700">G</span>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleSocial("Microsoft")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 transition hover:bg-slate-200"
              >
                <span className="h-5 w-5 rounded-full bg-slate-200 grid place-items-center text-slate-700">M</span>
                Continue with Microsoft
              </button>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200/70 pt-5 text-sm text-slate-500">
              <span>{mode === "signin" ? "Need a new account?" : "Already have an account?"}</span>
              <button
                type="button"
                onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-slate-900"
              >
                {mode === "signin" ? "Create account" : "Sign in"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
