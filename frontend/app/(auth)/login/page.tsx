"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.login({ email, password });
      window.location.href = "/dashboard";  // ✅
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Admin Login</h1>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <Button onClick={handleLogin} disabled={loading} className="w-full">
        {loading ? "Logging in..." : "Login"}
      </Button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <p className="text-center text-sm">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 underline">
          Register
        </a>
      </p>
    </div>
  );
}