const AUTH_KEY = "sentineldna_authenticated";
const AUTH_USER_KEY = "sentineldna_user";

export interface AuthSession {
  email: string;
  name: string;
  role: string;
  department: string;
  provider: string;
}

export const isAuthenticated = (): boolean => {
  return typeof window !== "undefined" && window.localStorage.getItem(AUTH_KEY) === "true";
};

export const getAuthUser = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(AUTH_USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    return null;
  }
};

export const signIn = (user: AuthSession): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_KEY, "true");
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const signOut = (): void => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
  }
};
