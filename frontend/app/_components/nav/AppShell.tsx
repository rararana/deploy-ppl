"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../_lib/auth";
import DesktopNavbar from "./DesktopNavbar";
import NavDrawer from "./NavDrawer";
import BottomTabBar from "./BottomTabBar";

interface AppShellProps {
  // Displayed in the mobile 44px compact top bar.
  title: string;
  // Optional slot for a right-side action in the mobile top bar (e.g. a
  // settings icon button). A blank spacer is rendered when omitted so the
  // title stays centered.
  mobileHeaderRight?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({
  title,
  mobileHeaderRight,
  children,
}: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      // TODO: If POST /auth/logout returns 401 (token already
      // expired), logout() in _lib/auth.ts may throw before removeToken()
      // runs. The finally block guarantees the redirect regardless, but
      // consider calling removeToken() here as an explicit fallback.
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen bg-page-bg">
      {/* ── Desktop: sticky top navbar ───────────────────────────────────── */}
      <DesktopNavbar onLogout={handleLogout} />

      {/* ── Mobile: compact 44px top bar (Apple HIG standard height) ─────── */}
      <div className="md:hidden sticky top-0 z-40 h-11 bg-surface border-b border-n-200 flex items-center justify-between px-4">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          className="w-9 h-9 flex flex-col justify-center items-center gap-[4px] border-none bg-transparent cursor-pointer p-[6px] shrink-0"
        >
          <span className="w-[18px] h-[1.5px] bg-brand rounded-sm block" />
          <span className="w-[13px] h-[1.5px] bg-brand rounded-sm block self-start" />
          <span className="w-[18px] h-[1.5px] bg-brand rounded-sm block" />
        </button>

        <span className="text-[17px] font-semibold text-ink tracking-[-0.01em]">{title}</span>

        {/* Right slot — keeps title centered when empty */}
        <div className="w-9 h-9 shrink-0 flex items-center justify-center">
          {mobileHeaderRight ?? null}
        </div>
      </div>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      {children}

      {/* ── Navigation drawer (mobile) ────────────────────────────────────── */}
      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={handleLogout}
      />

      {/* ── Bottom tab bar (mobile, fixed) ───────────────────────────────── */}
      <BottomTabBar />
    </div>
  );
}
