"use client";

import { createContext, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  LayoutDashboard,
  Medal,
  QrCode,
  Search,
  Settings,
  Users,
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [showNotifications, setShowNotifications] = useState(false);
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

  return (
    <ShellContext.Provider value={contextValue}>
      <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
            <Link href="/dashboard" className="flex items-center">
              <div>
                <p className="text-sm font-bold leading-tight">Kolorex</p>
                <p className="mt-1 text-xs text-slate-500">Establishment Limited</p>
              </div>
            </Link>
            <button className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-7 px-3 py-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
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
                          "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition",
                          active
                            ? "bg-indigo-50 text-indigo-700"
                            : "hover:bg-slate-50 hover:text-slate-950",
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

          <div className="m-3 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{t.helpTitle}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {t.helpBody}
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex min-h-16 flex-wrap items-center gap-3 px-3 py-3 sm:flex-nowrap sm:px-6 sm:py-0">
            <Link href="/dashboard" className="flex items-center lg:hidden">
              <span className="font-bold">Kolorex</span>
            </Link>
            <div className="ml-auto flex flex-1 flex-wrap items-center justify-end gap-2 sm:flex-nowrap sm:gap-3">
              <div className="order-last flex h-10 w-full min-w-[180px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:order-none sm:max-w-md">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder={t.searchPlaceholder}
                />
              </div>
              <button
                onClick={() => setLanguage(language === "en" ? "rw" : "en")}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <span className="hidden sm:inline">{t.language}</span>
                <span className="sm:hidden">{language === "en" ? "RW" : "EN"}</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications((value) => !value)}
                  className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  aria-label={t.notifications}
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <p className="text-sm font-semibold text-slate-950">{t.notifications}</p>
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        {notifications.length}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      {notifications.length === 0 ? (
                        <p className="py-4 text-center text-sm text-slate-500">{t.noNotifications}</p>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification} className="rounded-md bg-slate-50 p-3 text-sm leading-5 text-slate-600">
                            {notification}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden h-10 items-center rounded-lg border border-slate-200 bg-white px-3 sm:flex">
                <span className="hidden pr-1 text-sm font-medium text-slate-700 sm:block">{t.admin}</span>
              </div>
            </div>
          </div>
        </header>
        <nav className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
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
                      active ? "bg-indigo-50 text-indigo-700" : "border border-slate-200 text-slate-600",
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
    </div>
    </ShellContext.Provider>
  );
}
