// Navigation structure shared across DesktopNavbar, NavDrawer, and BottomTabBar.
// Update this file when routes or sections change — the three nav components
// stay in sync automatically.

export interface NavItem {
  label: string;
  href: string;
  iconKey: string;
}

export interface DrawerItem extends NavItem {
  badge: string | null;
}

// Top-level destinations shown in the desktop navbar and bottom tab bar.
// TODO: Replace static constant.
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",          href: "/dashboard",           iconKey: "home"     },
  { label: "Triggers & Actions", href: "/catalog",             iconKey: "zap"      },
  { label: "Workflows",          href: "/workflow-management", iconKey: "grid"     },
  { label: "Logs",               href: "/execution-log",       iconKey: "activity" },
  { label: "Team",               href: "/account-management",  iconKey: "users"    },
];

// Drawer — main section
// TODO: Replace hardcoded badges ("9", "3") with live counts fetched from the API
export const DRAWER_MAIN: DrawerItem[] = [
  { label: "Dashboard",          href: "/dashboard",           iconKey: "home",     badge: null },
  { label: "Triggers & Actions", href: "/catalog",             iconKey: "zap",      badge: "9"  },
  { label: "My workflows",       href: "/workflow-management", iconKey: "grid",     badge: "3"  },
  { label: "Requests",           href: "/request-log",         iconKey: "fileText", badge: null },
  { label: "Execution logs",     href: "/execution-log",       iconKey: "activity", badge: null },
];

// Drawer — management section
// TODO: Replace hardcoded badges with live counts fetched from the API
export const DRAWER_MGMT: DrawerItem[] = [
  { label: "Team members",  href: "/account-management", iconKey: "users",    badge: null },
  { label: "Notifications", href: "#",                   iconKey: "bell",     badge: "2"  },
  { label: "Settings",      href: "#",                   iconKey: "settings", badge: null },
];
