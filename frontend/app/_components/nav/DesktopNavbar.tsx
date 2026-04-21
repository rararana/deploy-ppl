"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "../Icon";
import LogoMark from "../LogoMark";
import { NAV_ITEMS } from "./nav-data";

import { logout } from "../../_lib/auth";
import { UserProfile } from "../../_lib/useProfile";

interface DesktopNavbarProps {
  profile?: UserProfile | null;
}

export default function DesktopNavbar({ profile }: DesktopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userInitials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "AR";
  const userDisplayName = profile?.full_name || "User";

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  function handleNotificationsClick() {
    router.push("/notifications");
  }

  return (
    <nav
      aria-label="Primary navigation"
      className="hidden md:flex sticky top-0 z-40 h-14 bg-surface border-b border-n-200 items-center px-10 gap-8"
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0 no-underline">
        <div className="w-[30px] h-[30px] bg-brand rounded-lg flex items-center justify-center shrink-0">
          <LogoMark size={17} />
        </div>
        <span className="text-[15px] font-bold text-ink tracking-[0.04em]">DITDIK</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1 flex-1 ml-2">
        {NAV_ITEMS.map(({ label, href, iconKey }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={[
                "text-[13px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 no-underline transition-all duration-150",
                active
                  ? "text-brand font-semibold"
                  : "font-medium text-text-secondary hover:text-ink hover:bg-n-100",
              ].join(" ")}
            >
              <Icon k={iconKey} size={14} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* User + sign out */}
      <div className="flex items-center gap-2 ml-auto shrink-0">

        <button
          aria-label="Notifications"
          onClick={handleNotificationsClick}
          className="w-9 h-9 flex items-center justify-center border-none bg-transparent cursor-pointer text-brand rounded-full hover:bg-n-100 transition-colors duration-150"
        >
          <Icon k="bell" size={18} />
        </button>
        <div className="w-px h-5 bg-n-200 shrink-0" />
        {/* <button className="flex items-center gap-2 px-2.5 py-[5px] rounded-[10px] hover:bg-n-100 border-none bg-transparent cursor-pointer transition-colors duration-150"> */}
          <div className="w-[30px] h-[30px] rounded-full bg-ds-50 flex items-center justify-center text-[11px] font-bold text-ds-700 shrink-0">
            {userInitials}
          </div>
          <span className="text-[13px] font-medium text-ink font-sans">{userDisplayName}</span>
          {/* <Icon k="chevDown" size={14} className="text-n-400" /> */}
        {/* </button> */}

        <div className="w-px h-5 bg-n-200 shrink-0" />

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-[34px] px-4 rounded-lg border border-n-200 bg-surface font-sans text-[13px] font-medium text-text-secondary cursor-pointer hover:border-n-400 hover:text-ink flex items-center gap-1.5 transition-all duration-150"
        >
          <Icon k="logOut" size={13} />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </nav>
  );
}
