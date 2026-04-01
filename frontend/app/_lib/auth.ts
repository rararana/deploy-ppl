import { apiRequest, setToken, removeToken } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AccountResponse {
  account_id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

type JwtPayload = {
  role?: string;
};

/**
 * Login with email and password
 * @returns TokenResponse with access_token
 */
export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const response = await apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    skipAuth: true,
  });

  // Store token in localStorage
  setToken(response.access_token);

  return response;
}

/**
 * Logout - remove token from storage
 */
export async function logout(): Promise<void> {
  try {
    await apiRequest<{ detail: string }>("/auth/logout", {
      method: "POST",
    });
  } finally {
    removeToken();
  }
}

export function getCurrentRole(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as JwtPayload;
    return payload.role ?? null;
  } catch {
    return null;
  }
}

/**
 * Register a new account
 */
export async function register(data: {
  full_name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<AccountResponse> {
  return apiRequest<AccountResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}
