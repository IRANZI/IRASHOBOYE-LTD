"use client";

import { createContext, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Medal,
  Moon,
  QrCode,
  Search,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export type Language = "en" | "rw";

type ShellContextValue = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  language: Language;
  setLanguage: (value: Language) => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export function useAppShell() {
  const context = useContext(ShellContext);
  if (!context) {
    return {
      searchQuery: "",
      setSearchQuery: () => {},
      language: "en" as Language,
      setLanguage: () => {},
    };
  }
  return context;
}

const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/generated-codes", label: "Generated codes", icon: QrCode },
      { href: "/rankings", label: "Rankings", icon: Medal },
      { href: "/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const shellText = {
  en: {
    searchPlaceholder: "Search codes, status, dates...",
    notifications: "Notifications",
    noNotifications: "You are all caught up.",
    language: "Kinyarwanda",
    helpTitle: "Need help?",
    helpBody: "Keep codes clean, registered, and ready for printing.",
    admin: "Admin",
    logout: "Logout",
    theme: "Theme",
    confirmLogoutTitle: "Logout?",
    confirmLogoutBody: "Are you sure you want to logout?",
    cancel: "Cancel",
    logoutSuccess: "Logged out successfully",
    nav: {
      Dashboard: "Dashboard",
      "Generated codes": "Generated codes",
      Rankings: "Rankings",
      Customers: "Customers",
      Reports: "Reports",
      Settings: "Settings",
      Main: "Main",
      Tools: "Tools",
    },
  },
  rw: {
    searchPlaceholder: "Shaka kode, uko zihagaze, amatariki...",
    notifications: "Amatangazo",
    noNotifications: "Nta tangazo rishya rihari.",
    language: "English",
    helpTitle: "Ukeneye ubufasha?",
    helpBody: "Gumana kode zitunganye, zanditswe, kandi ziteguye gucapwa.",
    admin: "Umuyobozi",
    logout: "Sohoka",
    theme: "Insanganyamatsiko",
    confirmLogoutTitle: "Gusohoka?",
    confirmLogoutBody: "Uremeza ko ushaka gusohoka?",
    cancel: "Bireke",
    logoutSuccess: "Wasohotse neza",
    nav: {
      Dashboard: "Ahabanza",
      "Generated codes": "Kode zakozwe",
      Rankings: "Urutonde",
      Customers: "Abakiriya",
      Reports: "Raporo",
      Settings: "Igenamiterere",
      Main: "Iby'ingenzi",
      Tools: "Ibikoresho",
    },
  },
} as const;

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/" || pathname === "/dashboard";
  }
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = shellText[language];
  const contextValue = useMemo(
    () => ({ searchQuery, setSearchQuery, language, setLanguage }),
    [searchQuery, language],
  );

  const notifications = [
    language === "en"
      ? "Codes marked used will ask for name and phone before ranking."
      : "Kode ikoreshejwe isaba izina na telefone mbere yo kujya ku rutonde.",
    language === "en"
      ? "Rankings update after a user is registered to a used code."
      : "Urutonde ruvugururwa nyuma yo kwandika umukiriya kuri kode yakoreshejwe.",
  ];

  const logout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success(t.logoutSuccess);
    setShowLogoutConfirm(false);
    router.push("/login");
    router.refresh();
    setIsLoggingOut(false);
  };

  const darkMode = resolvedTheme === "dark";

  return (
    <ShellContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
            <Link href="/dashboard" className="flex items-center">
              <div>
                <p className="text-sm font-bold leading-tight text-slate-950 dark:text-white">Kolorex</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Establishment Limited</p>
              </div>
            </Link>
            <button className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-7 px-3 py-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  {t.nav[group.label as keyof typeof t.nav]}
                </p>
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition dark:text-slate-300",
                          active
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200"
                            : "hover:bg-slate-50 hover:text-slate-950 dark:hover:bg-slate-900 dark:hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {t.nav[item.label as keyof typeof t.nav]}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="m-3 rounded-lg border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-400/20 dark:bg-indigo-400/10">
            <p className="text-sm font-semibold text-slate-900 dark:text-indigo-100">{t.helpTitle}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {t.helpBody}
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex min-h-16 flex-wrap items-center gap-3 px-3 py-3 sm:flex-nowrap sm:px-6 sm:py-0">
            <Link href="/dashboard" className="flex items-center lg:hidden">
              <span className="font-bold text-slate-950 dark:text-white">Kolorex</span>
            </Link>
            <div className="ml-auto flex flex-1 flex-wrap items-center justify-end gap-2 sm:flex-nowrap sm:gap-3">
              <div className="order-last flex h-10 w-full min-w-[180px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:order-none sm:max-w-md dark:border-slate-800 dark:bg-slate-900">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder={t.searchPlaceholder}
                />
              </div>
              <button
                onClick={() => setLanguage(language === "en" ? "rw" : "en")}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span className="hidden sm:inline">{t.language}</span>
                <span className="sm:hidden">{language === "en" ? "RW" : "EN"}</span>
              </button>
              <button
                onClick={() => setTheme(darkMode ? "light" : "dark")}
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label={t.theme}
                title={t.theme}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications((value) => !value)}
                  className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  aria-label={t.notifications}
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">{t.notifications}</p>
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-200">
                        {notifications.length}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      {notifications.length === 0 ? (
                        <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">{t.noNotifications}</p>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification} className="rounded-md bg-slate-50 p-3 text-sm leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {notification}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden h-10 items-center rounded-lg border border-slate-200 bg-white px-3 sm:flex dark:border-slate-800 dark:bg-slate-900">
                <span className="hidden pr-1 text-sm font-medium text-slate-700 sm:block dark:text-slate-200">{t.admin}</span>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label={t.logout}
                title={t.logout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
        <nav className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {navGroups.flatMap((group) =>
              group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold",
                      active
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200"
                        : "border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.nav[item.label as keyof typeof t.nav]}
                  </Link>
                );
              }),
            )}
          </div>
        </nav>
        <main className="px-3 py-4 sm:px-6 sm:py-5">{children}</main>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950 dark:text-white">{t.confirmLogoutTitle}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{t.confirmLogoutBody}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t.cancel}
              </button>
              <button
                onClick={logout}
                disabled={isLoggingOut}
                className="h-10 rounded-md bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "..." : t.logout}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ShellContext.Provider>
  );
}
