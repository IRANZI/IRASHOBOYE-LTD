"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Language = "en" | "rw";

interface UserRanking {
  rank: number;
  id: string;
  name: string;
  phoneNumber: string;
  codeCount: number;
  codes: Array<{
    code: string;
    usedAt: Date;
  }>;
  createdAt: Date;
}

interface UserLeaderboardProps {
  language: Language;
  searchQuery?: string;
}

const leaderboardTranslations: Record<
  Language,
  {
    title: string;
    subtitle: string;
    noRankings: string;
    noMatches: string;
    registeredLabel: string;
    codesUsedShort: string;
    codesUsedLabel: string;
    refresh: string;
    topLabel: (rank: number) => string;
  }
> = {
  en: {
    title: "User Rankings",
    subtitle: "Ranked by number of codes used",
    noRankings: "No rankings yet. Register users for codes to see rankings.",
    noMatches: "No ranking matches your search.",
    registeredLabel: "Registered:",
    codesUsedShort: "codes used",
    codesUsedLabel: "Codes Used:",
    refresh: "Refresh Rankings",
    topLabel: (rank) => `Top ${rank}`,
  },
  rw: {
    title: "Urutonde rw'Abakiriya",
    subtitle: "Bakurikiranye hakurikijwe umubare wa za kode bakoresheje",
    noRankings: "Nta rutonde ruraboneka. Andika abakiriya ku kode kugira ngo ubone urutonde.",
    noMatches: "Nta muntu uhuye n'ubushakashatsi.",
    registeredLabel: "Yanditswe:",
    codesUsedShort: "kode zakoreshejwe",
    codesUsedLabel: "Kode zakoreshejwe:",
    refresh: "Ongera ubone urutonde",
    topLabel: (rank) => `Abambere ${rank}`,
  },
};

export default function UserLeaderboard({ language, searchQuery = "" }: UserLeaderboardProps) {
  const t = leaderboardTranslations[language];
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRankings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users/rankings");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch rankings");
      }

      // Convert date strings to Date objects
      const rankingsWithDates = data.data.map((ranking: any) => ({
        ...ranking,
        createdAt: new Date(ranking.createdAt),
        codes: ranking.codes.map((code: any) => ({
          ...code,
          usedAt: new Date(code.usedAt),
        })),
      }));

      setRankings(rankingsWithDates);
    } catch (error: any) {
      console.error("Error fetching rankings:", error);
      toast.error(error.message || "Failed to load rankings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    } else if (rank === 2) {
      return <Medal className="h-6 w-6 text-gray-400" />;
    } else if (rank === 3) {
      return <Award className="h-6 w-6 text-amber-600" />;
    }
    return <span className="text-gray-500 font-bold dark:text-slate-400">{rank}</span>;
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const visibleRankings = normalizedSearch
    ? rankings.filter((user) => {
        const haystack = [
          user.name,
          user.phoneNumber,
          String(user.rank),
          String(user.codeCount),
          ...user.codes.map((codeUsage) => codeUsage.code),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedSearch);
      })
    : rankings;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow dark:border-slate-800 dark:bg-slate-900">
        <p className="text-gray-500 dark:text-slate-400">{t.noRankings}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow dark:border-slate-800 dark:bg-slate-900">
      <div className="bg-indigo-600 px-6 py-4 dark:bg-indigo-500/20">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          {t.title}
        </h2>
        <p className="text-indigo-100 text-sm mt-1 dark:text-indigo-200">{t.subtitle}</p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-slate-800">
        {visibleRankings.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-slate-400">{t.noMatches}</div>
        ) : visibleRankings.map((user) => (
          <div
            key={user.id}
            className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/70 ${
              user.rank <= 3 ? "bg-yellow-50 dark:bg-amber-400/10" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(user.rank)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{user.name}</h3>
                    {user.rank <= 3 && (
                      <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 dark:bg-amber-400/15 dark:text-amber-200">
                        {t.topLabel(user.rank)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300">{user.phoneNumber}</p>
                  <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                    {t.registeredLabel} {user.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-indigo-300">{user.codeCount}</div>
                <div className="text-xs text-gray-500 dark:text-slate-500">{t.codesUsedShort}</div>
              </div>
            </div>

            {user.codes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-800">
                <p className="text-xs font-medium text-gray-700 mb-2 dark:text-slate-300">{t.codesUsedLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {user.codes.map((codeUsage, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-mono dark:bg-indigo-400/10 dark:text-indigo-200"
                    >
                      {codeUsage.code}
                      <span className="ml-2 text-gray-500 text-xs dark:text-slate-400">
                        ({new Date(codeUsage.usedAt).toLocaleDateString()})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 dark:border-slate-800 dark:bg-slate-950">
        <button
          onClick={fetchRankings}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium dark:text-indigo-300 dark:hover:text-indigo-200"
        >
          {t.refresh}
        </button>
      </div>
    </div>
  );
}

