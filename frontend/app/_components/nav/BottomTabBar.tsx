"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../Icon";
import { NAV_ITEMS } from "./nav-data";

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div
      aria-label="Tab bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex items-start bg-white/[0.92] backdrop-blur-md border-t border-n-200 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+8px)]"
    >
      {NAV_ITEMS.map(({ label, href, iconKey }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={[
              "flex-1 flex flex-col items-center justify-center gap-[3px] min-h-11 no-underline",
              active ? "text-brand" : "text-n-400",
            ].join(" ")}
          >
            <Icon k={iconKey} size={22} />
            <span className="text-[10px] font-medium font-sans text-center">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
