"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import Icon from "./Icon";
import BottomTabBar from "./nav/BottomTabBar";
import DesktopNavbar from "./nav/DesktopNavbar";
import NavDrawer from "./nav/NavDrawer";
import { isAuthenticated } from "../_lib/api";
import { useProfile } from "../_lib/useProfile";

interface AuthShellProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = new Set(["/login", "/forgot-password"]);

export default function AuthShell({ children }: AuthShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { profile } = useProfile();

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isPublicRoute = useMemo(() => PUBLIC_ROUTES.has(pathname), [pathname]);

  useEffect(() => {
    if (!isClient) return;

    const loggedIn = isAuthenticated();
    const shouldRedirectToLogin = !loggedIn && !isPublicRoute;
    const shouldRedirectToDashboard = loggedIn && pathname === "/login";

    if (shouldRedirectToLogin) {
      router.replace("/login");
      return;
    }

    if (shouldRedirectToDashboard) {
      router.replace("/dashboard");
    }
  }, [isClient, isPublicRoute, pathname, router]);

  // Prevent hydration mismatch by not rendering protected content until client is ready
  if (!isClient) {
    return <>{children}</>;
  }

  const loggedIn = isAuthenticated();
  if (!loggedIn && !isPublicRoute) {
    return null;
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  const userInitials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "AR";

  async function handleLogout() {
    setDrawerOpen(false);
  }

  return (
    <div className="min-h-screen bg-page-bg">
      <DesktopNavbar profile={profile} />

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

        <span className="text-[17px] font-semibold text-ink tracking-[-0.01em]">DITDIK</span>

        <div className="w-9 h-9 shrink-0 flex items-center justify-center">
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="w-9 h-9 flex items-center justify-center border-none bg-transparent cursor-pointer text-brand rounded-full hover:bg-n-100 transition-colors duration-150"
          >
            <Icon k="bell" size={18} />
          </Link>
        </div>
      </div>

      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={handleLogout}
        profile={profile}
      />

      <main className="pb-[calc(env(safe-area-inset-bottom,0px)+88px)] md:pb-0">{children}</main>

      <BottomTabBar />
    </div>
  );
}
