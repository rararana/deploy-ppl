"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormField from "../_components/FormField";
import PrimaryButton from "../_components/PrimaryButton";
import Logo from "../_components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // TODO: auth
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password.");
      setIsLoading(false);
    }
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Left panel */}
      <div className="flex flex-col items-center justify-center bg-white px-20 shrink-0 w-[60%]">
        <Logo className="mb-10 text-brand" />

        <h1 className="text-4xl font-semibold text-ink mb-20">Welcome, user!</h1>

        <form onSubmit={handleLogin} className="w-full max-w-xl space-y-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="sr-only">Email address</label>
            <FormField
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="sr-only">Password</label>
            <FormField
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label htmlFor="remember-me" className="flex items-center gap-3 text-sm font-normal text-ink opacity-50 cursor-pointer select-none">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded shrink-0 w-4 h-4 border-2 border-field-border accent-brand"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => alert("Forgot password")}
              className="text-sm font-medium underline text-ink hover:opacity-70"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-500 text-center -mb-2">
              {error}
            </p>
          )}

          <PrimaryButton type="submit" disabled={isLoading} className="mt-16">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </PrimaryButton>
        </form>
      </div>

      {/* Right panel */}
      <div
        className="flex flex-col items-center justify-center px-16 text-white shrink-0 w-[40%]"
        style={{ background: "var(--theme-panel-bg)" }}
      >
        <Image
          src="/right_logo.svg"
          alt="Automation icon"
          width={264}
          height={264}
          className="mb-20 opacity-80"
          draggable={false}
        />
        <p className="text-center text-2xl font-normal text-white opacity-80 leading-[194%]">
          Build, manage, and automate your workflows in one place.
        </p>
      </div>
    </main>
  );
}

