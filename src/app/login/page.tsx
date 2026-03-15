"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setIsLoading(false);

    if (!res.ok) {
      let payload: any = null;
      try {
        payload = await res.json();
      } catch {
        // No JSON body returned
      }
      setError(payload?.error ?? "Unable to login");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-sm animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <Image src="/logo.png" alt="AfriFlow" width={40} height={40} className="drop-shadow-sm" />
            <span
              className="text-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #15803d, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AfriFlow
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-3xl"
          style={{
            background: "var(--surface-0)",
            border: "1px solid var(--surface-border)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to continue to your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-green-700 hover:text-green-800">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm text-red-700 animate-scale-in"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all relative overflow-hidden"
              style={{
                background: isLoading
                  ? "linear-gradient(135deg, #4ade80, #86efac)"
                  : "linear-gradient(135deg, #16a34a, #15803d)",
                boxShadow: isLoading ? "none" : "0 4px 16px rgba(22,163,74,0.35)",
                opacity: isLoading ? 0.75 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--surface-border)" }} />
            <span className="text-xs text-slate-400">New to AfriFlow?</span>
            <div className="flex-1 h-px" style={{ background: "var(--surface-border)" }} />
          </div>

          <Link
            href="/register"
            className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold text-green-700 transition-all hover:bg-green-50"
            style={{ border: "1.5px solid rgba(22,163,74,0.25)" }}
          >
            Create a free account →
          </Link>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-slate-600">Terms</a> and{" "}
          <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
