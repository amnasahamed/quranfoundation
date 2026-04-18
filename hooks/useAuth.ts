"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generatePKCE, getAuthUrl } from "@/lib/auth";

interface User {
  sub: string;
  name?: string;
  email?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      }
    } catch {
      // Not authenticated
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async () => {
    try {
      const { verifier, challenge, state } = await generatePKCE();
      sessionStorage.setItem("pkce_verifier", verifier);
      sessionStorage.setItem("oauth_state", state);

      const redirectUri = `${window.location.origin}/api/auth/callback`;

      const authUrl = getAuthUrl({
        codeChallenge: challenge,
        state,
        clientId: process.env.NEXT_PUBLIC_QF_CLIENT_ID!,
        redirectUri,
      });

      window.location.href = authUrl;
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to start login. Please try again.");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return { user, loading, login, logout, checkAuth };
}
