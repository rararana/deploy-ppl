"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../Icon";
import LogoMark from "../LogoMark";
import { DRAWER_MAIN, DRAWER_MGMT, DrawerItem } from "./nav-data";

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function DrawerNavItem({
  item,
  active,
  onClose,
}: {
  item: DrawerItem;
  active: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={[
        "flex items-center gap-3 mx-2 px-3 h-[50px] rounded-[10px] no-underline transition-colors duration-150",
        active
          ? "bg-ds-50 text-brand"
          : "text-text-secondary hover:bg-n-100 hover:text-ink",
      ].join(" ")}
    >
      <div
        className={[
          "w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0",
          active ? "bg-white text-brand" : "bg-n-100 text-n-600",
        ].join(" ")}
      >
        <Icon k={item.iconKey} size={16} />
      </div>
      <span className="text-[14px] font-medium flex-1">{item.label}</span>
      {item.badge && (
        <span className="text-[10px] font-semibold bg-brand text-white px-[7px] py-[2px] rounded-full leading-none">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export default function NavDrawer({ open, onClose, onLogout }: NavDrawerProps) {
  const pathname = usePathname();

  // TODO: Replace hardcoded user display with data decoded from JWT
  // or fetched from GET /auth/me. See getCurrentRole() in _lib/auth.ts for
  // the token-decode pattern.
  const userInitials = "AR";
  const userDisplayName = "Ahmad Rizky";
  const userRole = "Admin · IT Division";

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          "md:hidden fixed inset-0 z-50 bg-black/30 transition-opacity duration-[250ms]",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Panel — 285px, ≤78% screen width per Apple HIG */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          "md:hidden fixed inset-y-0 left-0 w-[285px] bg-surface z-[60] flex flex-col overflow-hidden",
          "transition-transform duration-[280ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)]",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="relative bg-ds-700 px-5 pt-14 pb-5 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg border-none bg-white/10 flex items-center justify-center cursor-pointer text-white/65 hover:bg-white/20 transition-colors duration-150"
          >
            <Icon k="close" size={14} />
          </button>

          {/* Logo row */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-[9px] bg-white/12 border border-white/18 flex items-center justify-center shrink-0">
              <LogoMark size={20} />
            </div>
            <div>
              <p className="text-[18px] font-bold text-white tracking-[0.04em] leading-none">
                DITDIK
              </p>
              <p className="text-[11px] text-white/45 font-normal mt-0.5">Workflow Platform</p>
            </div>
          </div>

          {/* User identity chip */}
          <div className="flex items-center gap-2.5 bg-white/8 rounded-[10px] px-3 py-2.5">
            <div className="w-[34px] h-[34px] rounded-full bg-ds-100 flex items-center justify-center text-[12px] font-bold text-ds-700 shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white leading-none">{userDisplayName}</p>
              <p className="text-[11px] text-white/45 mt-0.5">{userRole}</p>
            </div>
            <Icon k="chevRight" size={14} className="text-white/35 shrink-0" />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2" aria-label="Drawer navigation">
          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-n-400 px-5 pt-3 pb-1">
            Main
          </p>
          {DRAWER_MAIN.map((item) => (
            <DrawerNavItem
              key={item.label}
              item={item}
              active={pathname === item.href}
              onClose={onClose}
            />
          ))}

          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-n-400 px-5 pt-4 pb-1">
            Management
          </p>
          {DRAWER_MGMT.map((item) => (
            <DrawerNavItem
              key={item.label}
              item={item}
              active={pathname === item.href}
              onClose={onClose}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 pt-3 pb-6 border-t border-n-100 shrink-0">
          <button
            onClick={onLogout}
            className="w-full h-[46px] rounded-[10px] border border-n-200 bg-n-50 font-sans text-[14px] font-medium text-text-secondary cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 hover:bg-n-100 hover:text-ink"
          >
            <Icon k="logOut" size={15} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
