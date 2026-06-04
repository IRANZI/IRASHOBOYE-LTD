"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nextPath = useMemo(() => {
    const next = searchParams.get("next");
    return next && next.startsWith("/") ? next : "/dashboard";
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed.");
      }

      toast.success("Login successfully");
      router.push(nextPath);
      router.refresh();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Login failed.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-white/60 bg-white/75 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 md:grid-cols-[0.95fr_1fr]">
      <div className="flex min-h-[420px] flex-col justify-between border-b border-white/50 bg-white/45 p-8 text-slate-950 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/35 dark:text-white md:border-b-0 md:border-r">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/60 bg-white/45 text-indigo-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-indigo-200">
            <Building2 className="h-5 w-5" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-200">
            Kolorex
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
            Establishment Limited
          </h1>
        </div>
        <div className="rounded-lg border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-emerald-400/15 text-emerald-700 dark:text-emerald-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Admin access</p>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                Sign in to manage generated codes and printing.
              </p>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center p-6 sm:p-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Admin login
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Enter your admin credentials to continue.
          </p>

          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
                autoComplete="username"
                placeholder="admin"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
              <div className="mt-2 flex h-11 items-center rounded-md border border-slate-200 bg-white pr-2 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-400/20">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-50"
                  autoComplete="current-password"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
          </div>
          {error && (
            <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/50 dark:text-rose-200">
              {error}
            </p>
          )}
          <Button disabled={isSubmitting} className="mt-6 h-11 w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Login
          </Button>
        </div>
      </form>
    </section>
  );
}
