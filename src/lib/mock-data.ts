// Mock data for SentinelDNA platform
export type TrustLevel = "critical" | "low" | "medium" | "high";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  trustScore: number;
  status: "online" | "offline" | "idle";
  location: string;
  device: string;
  lastActivity: string;
  avatar: string;
  dna: DigitalDNA;
}

export interface DigitalDNA {
  loginPattern: number;
  workHours: number;
  deviceTrust: number;
  browserFingerprint: number;
  geoConsistency: number;
  fileAccess: number;
  appUsage: number;
  navigation: number;
  typingRhythm: number;
  mouseDynamics: number;
  privilegedActions: number;
  sessionDuration: number;
}

export interface TimelineEvent {
  id: string;
  time: string;
  type: "trust_up" | "trust_down" | "alert" | "info" | "critical";
  title: string;
  description: string;
  delta: number;
  evidence: string[];
}

export interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  user: string;
  time: string;
  status: "open" | "investigating" | "resolved";
  description: string;
  trustImpact: number;
}

const firstNames = ["Aarav", "Anaya", "Kiran", "Ishaan", "Neha", "Riya", "Arjun", "Priya", "Dhruv", "Sanya", "Kabir", "Meera", "Raj", "Anjali", "Vikram", "Tara"];
const lastNames = ["Sharma", "Patel", "Gupta", "Iyer", "Reddy", "Singh", "Kumar", "Mehta", "Agarwal", "Das", "Joshi", "Nair"];
const departments = ["Engineering", "Finance", "Executive", "Legal", "Sales", "HR", "Security", "Operations", "Marketing", "Product"];
const roles = ["Senior Engineer", "Analyst", "Director", "VP", "Manager", "Specialist", "Lead", "Architect"];
const locations = ["Mumbai, IN", "Bengaluru, IN", "Delhi, IN", "Chennai, IN", "Hyderabad, IN", "Pune, IN", "Kolkata, IN", "Ahmedabad, IN"];
const devices = ["MacBook Pro M3", "ThinkPad X1", "Surface Laptop 6", "Dell XPS 15", "MacBook Air M2", "iPad Pro"];

function seeded(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

export const employees: Employee[] = Array.from({ length: 42 }, (_, i) => {
  const name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
  const trust = Math.floor(30 + seeded(i + 1) * 70);
  const dept = departments[i % departments.length];
  return {
    id: `EMP-${1000 + i}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@sentineldna.io`,
    department: dept,
    role: roles[i % roles.length],
    trustScore: trust,
    status: (["online", "online", "idle", "offline"] as const)[i % 4],
    location: locations[i % locations.length],
    device: devices[i % devices.length],
    lastActivity: `${(i % 59) + 1}m ago`,
    avatar: name.split(" ").map((n) => n[0]).join(""),
    dna: {
      loginPattern: Math.floor(50 + seeded(i + 2) * 50),
      workHours: Math.floor(50 + seeded(i + 3) * 50),
      deviceTrust: Math.floor(60 + seeded(i + 4) * 40),
      browserFingerprint: Math.floor(70 + seeded(i + 5) * 30),
      geoConsistency: Math.floor(40 + seeded(i + 6) * 60),
      fileAccess: Math.floor(50 + seeded(i + 7) * 50),
      appUsage: Math.floor(60 + seeded(i + 8) * 40),
      navigation: Math.floor(50 + seeded(i + 9) * 50),
      typingRhythm: Math.floor(60 + seeded(i + 10) * 40),
      mouseDynamics: Math.floor(55 + seeded(i + 11) * 45),
      privilegedActions: Math.floor(30 + seeded(i + 12) * 70),
      sessionDuration: Math.floor(50 + seeded(i + 13) * 50),
    },
  };
});

export function trustLevel(score: number): TrustLevel {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  if (score >= 35) return "low";
  return "critical";
}

export function trustColor(score: number): string {
  const l = trustLevel(score);
  return {
    high: "text-emerald-400",
    medium: "text-cyan-400",
    low: "text-amber-400",
    critical: "text-rose-400",
  }[l];
}

export function trustBg(score: number): string {
  const l = trustLevel(score);
  return {
    high: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    medium: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    low: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    critical: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  }[l];
}

export function computeOrgTrustScore(data: Employee[]) {
  if (!data.length) return 0;
  const active = data.filter((user) => user.status !== "offline");
  const target = active.length ? active : data;
  const average = target.reduce((sum, user) => sum + user.trustScore, 0) / target.length;
  return Math.round(average);
}

export function countLiveSessions(data: Employee[]) {
  return data.filter((user) => user.status !== "offline").length;
}

export function countHighRiskUsers(data: Employee[]) {
  return data.filter((user) => {
    const level = trustLevel(user.trustScore);
    return level === "low" || level === "critical";
  }).length;
}

export function computeTrustDistribution(data: Employee[]) {
  if (!data.length) return [];
  const totals = { high: 0, medium: 0, low: 0, critical: 0 };
  data.forEach((user) => {
    totals[trustLevel(user.trustScore)] += 1;
  });
  const build = (name: string, level: keyof typeof totals, color: string) => ({
    name,
    value: Math.round((totals[level] / data.length) * 100),
    color,
  });
  return [
    build("High Trust", "high", "oklch(0.75 0.17 155)"),
    build("Medium Trust", "medium", "oklch(0.82 0.15 200)"),
    build("Low Trust", "low", "oklch(0.8 0.17 80)"),
    build("Critical", "critical", "oklch(0.65 0.24 25)"),
  ];
}

export function accessPolicy(score: number): { level: string; description: string; color: string } {
  if (score >= 80) return { level: "Full Access", description: "All resources granted", color: "emerald" };
  if (score >= 60) return { level: "MFA Challenge", description: "Step-up authentication required", color: "cyan" };
  if (score >= 35) return { level: "Read-Only", description: "Write operations blocked", color: "amber" };
  return { level: "Session Isolation", description: "Account locked, security team notified", color: "rose" };
}

export const trustHistory: { time: string; org: number; ai: number; anomaly: number }[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  org: Math.floor(75 + Math.sin(i / 2) * 8 + seeded(i + 20) * 5),
  ai: Math.floor(90 + Math.sin(i / 3) * 4 + seeded(i + 30) * 3),
  anomaly: Math.floor(seeded(i + 40) * 20 + (i > 14 && i < 19 ? 30 : 0)),
}));

export const trustDistribution = computeTrustDistribution(employees);

export const departmentRisk = departments.slice(0, 8).map((d, i) => ({
  department: d,
  risk: Math.floor(20 + seeded(i + 50) * 60),
  users: Math.floor(15 + seeded(i + 60) * 80),
}));

export const timelineEvents: TimelineEvent[] = [
  { id: "e1", time: "2 min ago", type: "trust_down", title: "Unusual file access pattern", description: "Bulk download from finance repository outside typical scope", delta: -18, evidence: ["Downloaded 240 files in 4 min", "First access to /finance/2024-audit", "Behavior deviates 87% from baseline"] },
  { id: "e2", time: "14 min ago", type: "alert", title: "Impossible travel detected", description: "Login from Singapore 12 min after San Francisco session", delta: -32, evidence: ["Geo distance: 13,600 km", "Physical impossibility", "Different device fingerprint"] },
  { id: "e3", time: "28 min ago", type: "trust_up", title: "Consistent typing rhythm confirmed", description: "Biometric keystroke pattern matches baseline with 98% confidence", delta: 6, evidence: ["Dwell time within 2ms of baseline", "Flight time consistent", "1,240 keystrokes analyzed"] },
  { id: "e4", time: "1 hour ago", type: "critical", title: "Privileged action from unmanaged device", description: "Admin role assumed from device not in MDM inventory", delta: -45, evidence: ["Device fingerprint unknown", "No EDR agent detected", "Bypassed VPN"] },
  { id: "e5", time: "2 hours ago", type: "info", title: "MFA challenge completed", description: "Step-up authentication successful", delta: 8, evidence: ["Biometric match", "Hardware key verified"] },
  { id: "e6", time: "3 hours ago", type: "trust_up", title: "Baseline reinforced", description: "Working hours and location match 30-day pattern", delta: 4, evidence: ["Login at 9:02 AM (baseline: 9:04 AM ±12m)", "Office IP range confirmed"] },
];

export const incidents: Incident[] = [
  { id: "INC-4821", title: "Insider threat: bulk data exfiltration", severity: "critical", user: "Sage Weber", time: "3 min ago", status: "open", description: "Employee downloaded 12GB of customer PII outside baseline behavior. Session isolated automatically.", trustImpact: -68 },
  { id: "INC-4820", title: "Compromised credentials suspected", severity: "high", user: "Kai Patel", time: "22 min ago", status: "investigating", description: "Impossible travel + unfamiliar device + failed keystroke biometric match.", trustImpact: -52 },
  { id: "INC-4819", title: "Privilege escalation attempt", severity: "high", user: "Milo Rivera", time: "1 hour ago", status: "investigating", description: "Attempted access to admin console outside role scope.", trustImpact: -34 },
  { id: "INC-4818", title: "Anomalous API usage", severity: "medium", user: "Eden Kim", time: "2 hours ago", status: "open", description: "Service account making 40x normal request volume.", trustImpact: -22 },
  { id: "INC-4817", title: "Unusual after-hours access", severity: "medium", user: "Nova Chen", time: "4 hours ago", status: "resolved", description: "Confirmed legitimate — deadline work approved by manager.", trustImpact: -14 },
  { id: "INC-4816", title: "Shadow IT detected", severity: "low", user: "Theo Costa", time: "6 hours ago", status: "resolved", description: "Unsanctioned SaaS tool blocked at gateway.", trustImpact: -8 },
];

export const threatTimeline = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i * 2}:00`,
  low: Math.floor(2 + seeded(i + 100) * 6),
  medium: Math.floor(1 + seeded(i + 110) * 4),
  high: Math.floor(seeded(i + 120) * 3),
  critical: i === 7 || i === 9 ? 1 : 0,
}));

export const orgMetrics = {
  orgTrustScore: computeOrgTrustScore(employees),
  activeUsers: employees.length,
  liveSessions: countLiveSessions(employees),
  highRiskUsers: countHighRiskUsers(employees),
  aiConfidence: 96.4,
  criticalIncidents: incidents.filter((incident) => incident.severity === "critical").length,
  securityHealth: Math.max(65, 100 - countHighRiskUsers(employees) * 2),
};
