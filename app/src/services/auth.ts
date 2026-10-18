import { api } from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

const SESSION_KEY = "jungle-demo-session-v1";

export function getSavedSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function getSavedUser(): AuthUser | null {
  return getSavedSession()?.user ?? null;
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthSession> {
  const response = await api.post<AuthSession>("/auth/signup", input);

  return response.data;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const response = await api.post<AuthSession>("/auth/login", input);

  return response.data;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = getSavedSession();

  if (!session) return null;

  const response = await api.get<AuthUser>("/auth/me", {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
