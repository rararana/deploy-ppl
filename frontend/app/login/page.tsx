"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormField from "../_components/FormField";
import PrimaryButton from "../_components/PrimaryButton";
import Logo from "../_components/Logo";
import Icon from "../_components/Icon";
import { clearRememberedEmail, getRememberedEmail, login } from "../_lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login({ email, password }, rememberMe);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
      setIsLoading(false);
    } finally {
      if (!rememberMe) {
        clearRememberedEmail();
      }
    }
  }

  return (
    <main className="flex min-h-screen w-full overflow-hidden pb-[env(safe-area-inset-bottom)] md:h-screen">
      {/* Left panel */}
      <div className="flex w-full shrink-0 flex-col items-center justify-center bg-white px-6 py-10 sm:px-10 md:w-[60%] md:px-16 md:py-0 lg:px-20">
        <Logo className="mb-10 text-brand" />

        <h1 className="mb-10 text-3xl font-semibold text-ink md:mb-20 md:text-4xl">Welcome, user!</h1>

        <form onSubmit={handleLogin} className="w-full max-w-md space-y-5 touch-manipulation md:max-w-xl">
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
          <div className="relative flex flex-col gap-1">
            <label htmlFor="password" className="sr-only">Password</label>
            <FormField
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="pr-20"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center text-text-secondary hover:text-ink"
            >
              <Icon k={showPassword ? "eyeOff" : "eye"} size={18} />
            </button>
          </div>

          <div className="flex flex-col justify-between gap-2 pt-1 sm:flex-row sm:items-center">
            <label htmlFor="remember-me" className="flex min-h-11 items-center gap-3 px-1 text-sm font-normal text-ink opacity-70 cursor-pointer select-none">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-5 w-5 shrink-0 rounded border-2 border-field-border accent-brand"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="min-h-11 self-start px-2 text-sm font-medium underline text-ink hover:opacity-70 sm:self-auto"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-500 text-center -mb-2">
              {error}
            </p>
          )}

          <PrimaryButton type="submit" disabled={isLoading} className="mt-10 md:mt-16">
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
        className="hidden shrink-0 flex-col items-center justify-center px-16 text-white md:flex md:w-[40%]"
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

