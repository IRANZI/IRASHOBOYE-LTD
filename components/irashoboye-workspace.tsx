"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  FileText,
  Loader2,
  Plus,
  Printer,
  RefreshCw,
  Trash2,
  Trophy,
  UserPlus,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import RegisterUserModal from "@/components/register-user-modal";
import UserLeaderboard from "@/components/user-leaderboard";
import { useAppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";

type WorkspaceView = "dashboard" | "codes" | "rankings" | "customers" | "reports" | "settings";

type Code = {
  id: string;
  code: string;
  used: boolean;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type RegisterState = {
  isOpen: boolean;
  codeId: string;
  code: string;
};

const viewCopy: Record<"en" | "rw", Record<WorkspaceView, { eyebrow: string; title: string; description: string }>> = {
  en: {
    dashboard: {
      eyebrow: "Overview",
      title: "Dashboard",
      description: "Track generated codes, usage, registrations, and the latest activity in one calm workspace.",
    },
    codes: {
      eyebrow: "Code operations",
      title: "Generated codes",
      description: "Generate, copy, print, register, and clean up all codes from a focused table.",
    },
    rankings: {
      eyebrow: "Performance",
      title: "Rankings",
      description: "See which customers have used the most codes and review their usage history.",
    },
    customers: {
      eyebrow: "People",
      title: "Customers",
      description: "A customer-focused view powered by the ranking records already captured by the system.",
    },
    reports: {
      eyebrow: "Insights",
      title: "Reports",
      description: "Simple operational reporting for stock, usage, and printing readiness.",
    },
    settings: {
      eyebrow: "Workspace",
      title: "Settings",
      description: "Quick reference for the current code workflow and contact details.",
    },
  },
  rw: {
    dashboard: {
      eyebrow: "Incamake",
      title: "Ahabanza",
      description: "Kurikirana kode zakozwe, izakoreshejwe, abakiriya banditswe, n'ibikorwa biheruka.",
    },
    codes: {
      eyebrow: "Ibikorwa bya kode",
      title: "Kode zakozwe",
      description: "Kora kode, koporora, capa, andika umukiriya, kandi ucunge kode zose byoroshye.",
    },
    rankings: {
      eyebrow: "Imyitwarire",
      title: "Urutonde",
      description: "Reba abakiriya bakoresheje kode nyinshi n'amateka y'uko bazikoresheje.",
    },
    customers: {
      eyebrow: "Abantu",
      title: "Abakiriya",
      description: "Reba amakuru y'abakiriya hashingiwe ku kode bandikiwe.",
    },
    reports: {
      eyebrow: "Raporo",
      title: "Raporo",
      description: "Incamake y'ibikorwa, kode zisigaye, n'iziteguye gucapwa.",
    },
    settings: {
      eyebrow: "Umwanya w'akazi",
      title: "Igenamiterere",
      description: "Amakuru y'ingenzi ku mikorere ya kode n'uko zikoreshwa.",
    },
  },
};

const text = {
  en: {
    refresh: "Refresh",
    generate: "Generate code",
    generated: "Generated",
    loadingFailed: "Failed to load codes",
    totalCodes: "Total codes",
    available: "Available",
    used: "Used",
    usageRate: "Usage rate",
    totalDetail: "All generated codes in the system.",
    availableDetail: "Ready to sell, print, or assign.",
    usedDetail: "Marked as used or already registered.",
    usageDetail: "Used codes compared with all codes.",
    activity: "Code activity",
    activityDetail: "Recent generated codes by status.",
    lastTen: "Last 10",
    noData: "No data yet",
    quickActions: "Quick actions",
    clearSelection: "Clear selection",
    selectAllCodes: "Select all codes",
    printSelected: "Print selected",
    printOneOnly: "Select only one code to print",
    printPreview: "Print preview",
    printNow: "Print now",
    close: "Close",
    front: "Front",
    back: "Back",
    cardFront: "Code front",
    cardBack: "Card back",
    markSelectedUsed: "Mark selected used",
    exportReport: "Export report",
    latestCodes: "Latest codes",
    allCodes: "All generated codes",
    tableHelp: "Select rows for printing or open registration when a code is used.",
    markUsed: "Mark used",
    deselect: "Deselect",
    selectAll: "Select all",
    print: "Print",
    code: "Code",
    status: "Status",
    created: "Created",
    usedDate: "Used date",
    actions: "Actions",
    noCodes: "No codes match your search.",
    noCodesEmpty: "No codes yet. Generate the first one to start.",
    notUsed: "Not used",
    copied: "Copied",
    copyFailed: "Failed to copy code",
    selectOne: "Select one code first",
    selectOnlyOne: "Select only one code when registering a user",
    nowRegister: "Now register who used",
    availableAgain: "is available again",
    deleteQuestion: "Delete code",
    codeDeleted: "Code deleted",
    printTemplate: "Print template",
    printTemplateBody: "Printed cards show the business name, generated code, contact number, and price. Select codes from the table before printing.",
    rankingRule: "Ranking rule",
    rankingRuleBody: "Customers are ranked by the number of used codes registered to their phone number.",
  },
  rw: {
    refresh: "Vugurura",
    generate: "Kora kode",
    generated: "Kode yakozwe",
    loadingFailed: "Kode ntizashoboye gufunguka",
    totalCodes: "Kode zose",
    available: "Zitarakoreshwa",
    used: "Zakoreshejwe",
    usageRate: "Igipimo cy'izakoreshejwe",
    totalDetail: "Kode zose zakozwe muri sisitemu.",
    availableDetail: "Ziteguye kugurishwa, gucapwa, cyangwa guhabwa umukiriya.",
    usedDetail: "Zashyizweho nk'izakoreshejwe cyangwa zanditswe ku mukiriya.",
    usageDetail: "Kode zakoreshejwe ugereranyije na kode zose.",
    activity: "Imikorere ya kode",
    activityDetail: "Kode ziheruka uko zihagaze.",
    lastTen: "10 ziheruka",
    noData: "Nta makuru arahari",
    quickActions: "Ibikorwa byihuse",
    clearSelection: "Kuraho amahitamo",
    selectAllCodes: "Hitamo kode zose",
    printSelected: "Capa izatoranyijwe",
    printOneOnly: "Hitamo kode imwe gusa yo gucapa",
    printPreview: "Reba mbere yo gucapa",
    printNow: "Capa nonaha",
    close: "Funga",
    front: "Imbere",
    back: "Inyuma",
    cardFront: "Imbere ya kode",
    cardBack: "Inyuma y'ikarita",
    markSelectedUsed: "Shyira iyo kode nk'iyakoreshejwe",
    exportReport: "Sohora raporo",
    latestCodes: "Kode ziheruka",
    allCodes: "Kode zose zakozwe",
    tableHelp: "Hitamo kode yo gucapa cyangwa kwandika umukiriya wayikoresheje.",
    markUsed: "Yakoreshejwe",
    deselect: "Kuraho",
    selectAll: "Hitamo zose",
    print: "Capa",
    code: "Kode",
    status: "Uko ihagaze",
    created: "Yakozwe",
    usedDate: "Itariki yakoreshejwe",
    actions: "Ibikorwa",
    noCodes: "Nta kode ihuye n'ubushakashatsi.",
    noCodesEmpty: "Nta kode irakorwa. Banza ukore iya mbere.",
    notUsed: "Ntiyakoreshejwe",
    copied: "Yakopiwe",
    copyFailed: "Gukoporora kode byanze",
    selectOne: "Banza uhitemo kode imwe",
    selectOnlyOne: "Hitamo kode imwe gusa igihe wandika umukiriya",
    nowRegister: "Andika uwakoresheje",
    availableAgain: "yongeye kuba itarakoreshwa",
    deleteQuestion: "Siba kode",
    codeDeleted: "Kode yasibwe",
    printTemplate: "Ifishi yo gucapa",
    printTemplateBody: "Amakarita acapwa agaragaza izina ry'ikigo, kode, telefone, n'igiciro. Hitamo kode mbere yo gucapa.",
    rankingRule: "Uko urutonde rukorwa",
    rankingRuleBody: "Abakiriya batondekwa hakurikijwe umubare wa kode zanditswe kuri telefone yabo.",
  },
} as const;

function formatDate(value: string | null, language: "en" | "rw") {
  if (!value) return language === "rw" ? "Ntiyakoreshejwe" : "Not used";
  return new Intl.DateTimeFormat(language === "rw" ? "rw-RW" : "en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function StatCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  tone: "indigo" | "emerald" | "rose" | "amber";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold", tones[tone])}>
          Live
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

export default function IrashoboyeWorkspace({ view }: { view: WorkspaceView }) {
  const { searchQuery, language } = useAppShell();
  const t = text[language];
  const [codes, setCodes] = useState<Code[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [printCode, setPrintCode] = useState<Code | null>(null);
  const [registerModal, setRegisterModal] = useState<RegisterState>({
    isOpen: false,
    codeId: "",
    code: "",
  });

  const fetchCodes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/codes", { cache: "no-store" });
      if (!response.ok) throw new Error(t.loadingFailed);
      const data = await response.json();
      setCodes(data);
    } catch (error: any) {
      toast.error(error.message || t.loadingFailed);
    } finally {
      setIsLoading(false);
    }
  }, [t.loadingFailed]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const stats = useMemo(() => {
    const total = codes.length;
    const used = codes.filter((code) => code.used).length;
    const unused = total - used;
    const usageRate = total ? Math.round((used / total) * 100) : 0;
    return { total, used, unused, usageRate };
  }, [codes]);

  const selectedCodes = useMemo(
    () => codes.filter((code) => selected.includes(code.id)),
    [codes, selected],
  );
  const firstSelectedCode = selectedCodes[0];

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const visibleCodes = useMemo(() => {
    if (!normalizedSearch) return codes;
    return codes.filter((code) => {
      const haystack = [
        code.code,
        code.used ? t.used : t.available,
        code.createdAt,
        code.usedAt ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [codes, normalizedSearch, t.available, t.used]);

  const latestCodes = visibleCodes.slice(0, view === "dashboard" ? 7 : visibleCodes.length);
  const chartData = useMemo(() => {
    const newest = [...codes].slice(0, 10).reverse();
    return newest.map((code, index) => ({
      label: `${index + 1}`,
      active: code.used ? 78 : 28,
      soft: code.used ? 22 : 72,
    }));
  }, [codes]);

  const generateCode = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAsUsed: false }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to generate code");
      setCodes((previous) => [data.data, ...previous]);
      toast.success(`${t.generated}: ${data.data.code}`);
    } catch (error: any) {
      toast.error(error.message || t.loadingFailed);
    } finally {
      setIsGenerating(false);
    }
  };

  const setCodeUsed = async (code: Code, used: boolean) => {
    const response = await fetch(`/api/codes/${code.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ used }),
    });
    const updated = await response.json();
    if (!response.ok) throw new Error(updated.error || "Failed to update code");
    setCodes((previous) => previous.map((item) => (item.id === code.id ? updated : item)));
    return updated as Code;
  };

  const markAvailableCodeAsUsed = async (code: Code) => {
    try {
      const updated = code.used ? code : await setCodeUsed(code, true);
      setRegisterModal({ isOpen: true, codeId: updated.id, code: updated.code });
      toast.success(`${t.nowRegister} ${updated.code}`);
    } catch (error: any) {
      toast.error(error.message || t.loadingFailed);
    }
  };

  const markCodeAvailable = async (code: Code) => {
    try {
      const updated = await setCodeUsed(code, false);
      toast.success(`${updated.code} ${t.availableAgain}`);
    } catch (error: any) {
      toast.error(error.message || t.loadingFailed);
    }
  };

  const deleteCode = async (code: Code) => {
    if (!confirm(`${t.deleteQuestion} ${code.code}?`)) return;
    try {
      const response = await fetch(`/api/codes/${code.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to delete code");
      setCodes((previous) => previous.filter((item) => item.id !== code.id));
      setSelected((previous) => previous.filter((id) => id !== code.id));
      toast.success(t.codeDeleted);
    } catch (error: any) {
      toast.error(error.message || t.loadingFailed);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      toast.success(`${t.copied} ${code}`);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.error(t.copyFailed);
    }
  };

  const printSelected = () => {
    if (!firstSelectedCode) {
      toast.error(t.selectOne);
      return;
    }
    if (selectedCodes.length > 1) {
      toast.error(t.printOneOnly);
      return;
    }
    setPrintCode(firstSelectedCode);
  };

  const selectAll = () => {
    const visibleIds = visibleCodes.map((code) => code.id);
    setSelected((previous) => {
      const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => previous.includes(id));
      if (allVisibleSelected) {
        return previous.filter((id) => !visibleIds.includes(id));
      }
      return Array.from(new Set([...previous, ...visibleIds]));
    });
  };

  const allVisibleSelected =
    visibleCodes.length > 0 && visibleCodes.every((code) => selected.includes(code.id));

  const markSelectedAsUsed = () => {
    if (!firstSelectedCode) {
      toast.error(t.selectOne);
      return;
    }

    if (selectedCodes.length > 1) {
      toast.error(t.selectOnlyOne);
      return;
    }

    markAvailableCodeAsUsed(firstSelectedCode);
  };

  const copy = viewCopy[language][view];

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-lg bg-indigo-600 text-white shadow-sm">
          <div className="relative px-5 py-5 sm:px-7">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top,#ffffff55,transparent_45%)]" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-100">{copy.eyebrow}</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{copy.title}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">{copy.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={fetchCodes} variant="secondary" className="h-10 bg-white text-indigo-700 hover:bg-indigo-50">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t.refresh}
                </Button>
                <Button onClick={generateCode} disabled={isGenerating} className="h-10 bg-slate-950 text-white hover:bg-slate-800">
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {t.generate}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="grid min-h-[360px] place-items-center rounded-lg border border-slate-200 bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {(view === "dashboard" || view === "reports") && (
              <>
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard label={t.totalCodes} value={stats.total} detail={t.totalDetail} tone="indigo" />
                  <StatCard label={t.available} value={stats.unused} detail={t.availableDetail} tone="emerald" />
                  <StatCard label={t.used} value={stats.used} detail={t.usedDetail} tone="rose" />
                  <StatCard label={t.usageRate} value={`${stats.usageRate}%`} detail={t.usageDetail} tone="amber" />
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
                  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold text-slate-950">{t.activity}</h2>
                        <p className="mt-1 text-sm text-slate-500">{t.activityDetail}</p>
                      </div>
                      <span className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500">{t.lastTen}</span>
                    </div>
                    <div className="mt-6 flex h-56 items-end gap-3">
                      {chartData.length === 0 ? (
                        <div className="grid h-full flex-1 place-items-center rounded-lg bg-slate-50 text-sm text-slate-400">{t.noData}</div>
                      ) : (
                        chartData.map((item) => (
                          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                            <div className="flex h-44 w-full max-w-12 flex-col justify-end overflow-hidden rounded-lg bg-slate-100">
                              <div className="bg-indigo-500" style={{ height: `${item.active}%` }} />
                              <div className="bg-slate-200" style={{ height: `${item.soft}%` }} />
                            </div>
                            <span className="text-xs text-slate-400">{item.label}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-950">{t.quickActions}</h2>
                    <div className="mt-4 grid gap-3">
                      <Button onClick={selectAll} variant="outline" className="justify-start">
                        <Check className="mr-2 h-4 w-4" />
                        {allVisibleSelected ? t.clearSelection : t.selectAllCodes}
                      </Button>
                      <Button onClick={printSelected} variant="outline" className="justify-start">
                        <Printer className="mr-2 h-4 w-4" />
                        {t.printSelected} ({selected.length})
                      </Button>
                      <Button
                        onClick={markSelectedAsUsed}
                        disabled={selected.length !== 1}
                        variant="outline"
                        className="justify-start disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        {t.markSelectedUsed}
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        {t.exportReport}
                      </Button>
                    </div>
                  </div>
                </section>
              </>
            )}

            {(view === "codes" || view === "dashboard" || view === "reports") && (
              <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">{view === "dashboard" ? t.latestCodes : t.allCodes}</h2>
                    <p className="mt-1 text-sm text-slate-500">{t.tableHelp}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={markSelectedAsUsed}
                      disabled={selected.length !== 1}
                      className="disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {t.markUsed}
                    </Button>
                    <Button variant="outline" onClick={selectAll}>{allVisibleSelected ? t.deselect : t.selectAll}</Button>
                    <Button variant="outline" onClick={printSelected}>
                      <Printer className="mr-2 h-4 w-4" />
                      {t.print}
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      <tr>
                        <th className="w-12 px-5 py-3"></th>
                        <th className="px-5 py-3">{t.code}</th>
                        <th className="px-5 py-3">{t.status}</th>
                        <th className="px-5 py-3">{t.created}</th>
                        <th className="px-5 py-3">{t.usedDate}</th>
                        <th className="px-5 py-3 text-right">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {latestCodes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                            {codes.length === 0 ? t.noCodesEmpty : t.noCodes}
                          </td>
                        </tr>
                      ) : (
                        latestCodes.map((code) => (
                          <tr key={code.id} className="hover:bg-slate-50/70">
                            <td className="px-5 py-4">
                              <input
                                type="checkbox"
                                checked={selected.includes(code.id)}
                                onChange={() =>
                                  setSelected((previous) =>
                                    previous.includes(code.id)
                                      ? previous.filter((id) => id !== code.id)
                                      : [...previous, code.id],
                                  )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                              />
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-md bg-slate-100 px-3 py-1.5 font-mono text-sm font-semibold text-slate-900">
                                {code.code}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                                  code.used ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700",
                                )}
                              >
                                {code.used ? t.used : t.available}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-500">{formatDate(code.createdAt, language)}</td>
                            <td className="px-5 py-4 text-slate-500">{code.usedAt ? formatDate(code.usedAt, language) : t.notUsed}</td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-1">
                                <button onClick={() => copyCode(code.code)} className="grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100">
                                  {copied === code.code ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                                </button>
                                <button
                                  onClick={() => (code.used ? markCodeAvailable(code) : markAvailableCodeAsUsed(code))}
                                  title={code.used ? "Mark available" : "Mark used and register user"}
                                  className="grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => markAvailableCodeAsUsed(code)}
                                  title="Register user for this code"
                                  className="grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                                >
                                  <UserPlus className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteCode(code)} className="grid h-9 w-9 place-items-center rounded-md text-rose-500 hover:bg-rose-50">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {(view === "rankings" || view === "customers") && <UserLeaderboard language={language} searchQuery={searchQuery} />}

            {view === "settings" && (
              <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    {t.printTemplate}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {t.printTemplateBody}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
                    <Trophy className="h-4 w-4 text-indigo-600" />
                    {t.rankingRule}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {t.rankingRuleBody}
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <RegisterUserModal
        codeId={registerModal.codeId}
        code={registerModal.code}
        isOpen={registerModal.isOpen}
        language={language}
        onClose={() => setRegisterModal({ isOpen: false, codeId: "", code: "" })}
        onSuccess={() => {
          setSelected([]);
          fetchCodes();
        }}
      />
      {printCode && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 px-3 py-4 backdrop-blur-sm print:static print:block print:bg-white print:p-0">
          <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl print:max-w-none print:rounded-none print:border-0 print:shadow-none">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{t.printPreview}</h2>
                <p className="mt-1 font-mono text-sm text-slate-500">{printCode.code}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setPrintCode(null)}>
                  {t.close}
                </Button>
                <Button onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  {t.printNow}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 print:block print:p-0">
              <section className="kolorex-print-page grid min-h-[420px] place-items-center rounded-lg border border-slate-200 bg-white p-8 text-center print:min-h-screen print:rounded-none print:border-0">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 print:text-[18pt]">
                    {t.front}
                  </p>
                  <h3 className="mt-8 text-base font-semibold text-slate-500 print:text-[20pt]">
                    Kolorex Establishment Limited
                  </h3>
                  <p className="mt-8 break-all font-mono text-5xl font-black tracking-widest text-slate-950 sm:text-6xl print:text-[72pt]">
                    {printCode.code}
                  </p>
                  <p className="mt-8 text-sm text-slate-500 print:text-[18pt]">{t.cardFront}</p>
                </div>
              </section>

              <section className="kolorex-print-page grid min-h-[420px] place-items-center rounded-lg border border-slate-200 bg-slate-50 p-8 text-center print:min-h-screen print:rounded-none print:border-0 print:bg-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 print:text-[18pt]">
                    {t.back}
                  </p>
                  <h3 className="mt-8 text-base font-semibold text-slate-500 print:text-[20pt]">
                    Kolorex Establishment Limited
                  </h3>
                  <p className="mt-8 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl print:text-[56pt]">
                    +250788873038
                  </p>
                  <p className="mt-8 text-sm text-slate-500 print:text-[18pt]">{t.cardBack}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </>
  );
}
