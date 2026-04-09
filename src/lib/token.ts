const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || '';

const buildApiUrl = (path: string): string => {
  if (!API_URL) {
    return path;
  }

  return `${API_URL.replace(/\/$/, '')}${path}`;
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  accountNumber?: string;
  balance?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

class TokenManager {
  private tokenKey = 'auth-token';
  private userKey = 'user-data';

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
    document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Strict`;
  }

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
    document.cookie = 'auth-token=; path=/; max-age=0';
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.userKey);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse stored user data', error);
      return null;
    }
  }

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}

export const tokenManager = new TokenManager();

async function apiRequest(path: string, init: RequestInit): Promise<any> {
  const url = buildApiUrl(path);

  try {
    const response = await fetch(url, init);
    const data = await response.json();

    if (!response.ok) {
      console.error('API request failed', {
        url,
        status: response.status,
        detail: data?.detail,
        body: init.body,
      });
      throw new ApiError(response.status, data.detail || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error('Network request failed', {
      url,
      method: init.method || 'GET',
      error,
    });
    throw new ApiError(0, 'Unable to reach the server. Please try again in a moment.');
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
}

export async function verifyOtp(email: string, otp: string): Promise<AuthResponse> {
  return apiRequest('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
}

export async function resendOtp(email: string): Promise<AuthResponse> {
  return apiRequest('/api/auth/resend-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutUser(): Promise<void> {
  tokenManager.clear();
}

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.name = 'ApiError';
  }
}
