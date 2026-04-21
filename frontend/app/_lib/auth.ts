import { apiRequest, setToken, getToken, removeToken } from "./api";

const REMEMBERED_EMAIL_KEY = "remembered_email";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
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
export async function login(
  credentials: LoginRequest,
  rememberMe = true,
): Promise<TokenResponse> {
  const response = await apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    skipAuth: true,
  });

  setToken(response.access_token, rememberMe);

  if (typeof window !== "undefined") {
    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, credentials.email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  }

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

  const token = getToken();
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

export async function requestPasswordReset(
  payload: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<{ detail: string }> {
  return apiRequest<{ detail: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export function getRememberedEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";
}

export function clearRememberedEmail(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
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
