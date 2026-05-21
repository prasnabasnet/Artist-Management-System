import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN = "access_token";

interface JWTPayload {
  email: string;
  role: string;
  exp: number;
  origIat: number;
}

export const tokenService = {
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN);
  },
  getRole: (): string | null => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return null;
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.role;
    } catch {
      return null;
    }
  },
  setToken: (token: string) => {
    localStorage.setItem(ACCESS_TOKEN, token);
    
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      document.cookie = `access_token=${token}; path=/`;
      document.cookie = `user_role=${decoded.role}; path=/`;
    } catch {
      document.cookie = `access_token=${token}; path=/`;
    }
  },
  clearToken: () => {
    localStorage.removeItem(ACCESS_TOKEN);
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  },
};