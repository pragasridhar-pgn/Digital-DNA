export interface AuthUser {
  email: string;
  password?: string;
  name: string;
  department: string;
  role: string;
  provider?: "google" | "microsoft" | "local";
}

export const roleOptionsByDepartment: Record<string, string[]> = {
  Executive: ["Super Admin", "Director"],
  Security: ["Security Analyst", "SOC Operator", "Incident Commander"],
  Operations: ["SOC Operator", "Incident Commander", "Manager"],
  Engineering: ["Senior Engineer", "Architect", "Lead"],
  Finance: ["Analyst", "Manager"],
  HR: ["Specialist", "Manager"],
  Legal: ["Director", "Manager"],
  Product: ["Architect", "Lead", "Manager"],
  Marketing: ["Manager", "Specialist"],
};

export const authUsers: AuthUser[] = [
  {
    email: "arjun.sharma@sentineldna.io",
    password: "Sentinel!2026",
    name: "Arjun Sharma",
    department: "Executive",
    role: "Super Admin",
    provider: "local",
  },
  {
    email: "riya.patel@sentineldna.io",
    password: "TrustScore#42",
    name: "Riya Patel",
    department: "Security",
    role: "Security Analyst",
    provider: "local",
  },
  {
    email: "kiran.iyer@sentineldna.io",
    password: "MFA@Secure9",
    name: "Kiran Iyer",
    department: "Operations",
    role: "SOC Operator",
    provider: "local",
  },
  {
    email: "neha.agarwal@sentineldna.io",
    password: "ZeroTrust$1",
    name: "Neha Agarwal",
    department: "Security",
    role: "Incident Commander",
    provider: "local",
  },
  {
    email: "arjun.google@sentineldna.io",
    name: "Arjun Sharma",
    department: "Security",
    role: "Security Analyst",
    provider: "google",
  },
  {
    email: "arjun.microsoft@sentineldna.io",
    name: "Arjun Sharma",
    department: "Executive",
    role: "Super Admin",
    provider: "microsoft",
  },
];

const LOCAL_USERS_KEY = "sentineldna_local_users";

export const getDepartments = (): string[] => Object.keys(roleOptionsByDepartment);

export const getRolesByDepartment = (department: string) => roleOptionsByDepartment[department] ?? [];

export const getRegisteredUsers = (): AuthUser[] => {
  if (typeof window === "undefined") return [];
  const saved = window.localStorage.getItem(LOCAL_USERS_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as AuthUser[];
  } catch {
    return [];
  }
};

export const saveLocalUser = (user: AuthUser): void => {
  if (typeof window === "undefined") return;
  const users = getRegisteredUsers();
  window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([...users, user]));
};

export const findUserByEmail = (email: string): AuthUser | undefined => {
  const normalizedEmail = email.toLowerCase();
  return (
    authUsers.find((user) => user.email.toLowerCase() === normalizedEmail) ??
    getRegisteredUsers().find((user) => user.email.toLowerCase() === normalizedEmail)
  );
};

export const findProviderUser = (provider: "Google" | "Microsoft"): AuthUser | undefined => {
  return authUsers.find((user) => user.provider?.toLowerCase() === provider.toLowerCase());
};
