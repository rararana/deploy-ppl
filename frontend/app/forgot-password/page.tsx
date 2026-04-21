"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import FormField from "../_components/FormField";
import PrimaryButton from "../_components/PrimaryButton";
import Logo from "../_components/Logo";
import Icon from "../_components/Icon";
import { requestPasswordReset, resetPassword } from "../_lib/auth";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const tokenFromQuery = searchParams.get("token") || "";
  
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
    if (tokenFromQuery) {
      setResetToken(tokenFromQuery);
    }
  }, [emailFromQuery, tokenFromQuery]);

  const hasResetToken = Boolean(resetToken);

  async function handleRequestReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsRequesting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await requestPasswordReset({ email });
      setMessage(response.message);
      // Clear the form
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request password reset.");
    } finally {
      setIsRequesting(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsResetting(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setIsResetting(false);
      return;
    }

    try {
      const response = await resetPassword({ token: resetToken, new_password: newPassword });
      setSuccessMessage(response.detail);
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full overflow-hidden pb-[env(safe-area-inset-bottom)] md:h-screen">
      <div className="flex w-full shrink-0 flex-col items-center justify-center bg-white px-6 py-10 sm:px-10 md:w-[60%] md:px-16 md:py-0 lg:px-20">
        <Logo className="mb-10 text-brand" />

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-ink md:text-4xl">Reset your password</h1>
          <p className="mt-2 text-sm text-text-secondary">
            {hasResetToken ? "Create a new password for your account." : "Enter your email to receive a reset link."}
          </p>
        </div>

        <div className="w-full max-w-md space-y-6 touch-manipulation md:max-w-xl">
          {!hasResetToken && !successMessage && (
            <form onSubmit={handleRequestReset} className="space-y-4 rounded-xl border border-n-200 bg-surface p-5">
              <div>
                <h2 className="text-lg font-semibold text-ink mb-4">Request password reset</h2>
                <p className="text-sm text-text-secondary mb-4">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <FormField
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              {message && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <PrimaryButton type="submit" disabled={isRequesting}>
                {isRequesting ? "Sending..." : "Send reset link"}
              </PrimaryButton>
            </form>
          )}

          {hasResetToken && (
            <form onSubmit={handleResetPassword} className="space-y-4 rounded-xl border border-n-200 bg-surface p-5">
              <h2 className="text-lg font-semibold text-ink">Create new password</h2>
              <p className="text-sm text-text-secondary">
                Enter your new password below to complete the password reset.
              </p>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="relative">
                <FormField
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  <Icon k={showNewPassword ? "eyeOff" : "eye"} size={18} />
                </button>
              </div>
              <div className="relative">
                <FormField
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  <Icon k={showConfirmPassword ? "eyeOff" : "eye"} size={18} />
                </button>
              </div>
              <PrimaryButton type="submit" disabled={isResetting}>
                {isResetting ? "Resetting..." : "Reset password"}
              </PrimaryButton>
            </form>
          )}

          {successMessage && (
            <div className="rounded-xl border border-n-200 bg-surface p-5 space-y-4">
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                <p className="font-semibold mb-2">Success!</p>
                <p>{successMessage}</p>
              </div>
              <p className="text-sm text-text-secondary">
                You can now log in with your new password.
              </p>
              <Link href="/login" className="inline-block">
                <PrimaryButton type="button">Back to login</PrimaryButton>
              </Link>
            </div>
          )}

          {!successMessage && (
            <div className="text-center">
              <Link href="/login" className="text-sm font-medium underline text-ink hover:opacity-70">
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>

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
          Recover access securely and keep your workflows moving.
        </p>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}