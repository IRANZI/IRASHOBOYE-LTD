"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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

export default function UserLeaderboard() {
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
    return <span className="text-gray-500 font-bold">{rank}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No rankings yet. Register users for codes to see rankings.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          User Rankings
        </h2>
        <p className="text-blue-100 text-sm mt-1">Ranked by number of codes used</p>
      </div>

      <div className="divide-y divide-gray-200">
        {rankings.map((user) => (
          <div
            key={user.id}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              user.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-transparent" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(user.rank)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                    {user.rank <= 3 && (
                      <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                        Top {user.rank}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Registered: {user.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{user.codeCount}</div>
                <div className="text-xs text-gray-500">codes used</div>
              </div>
            </div>

            {user.codes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Codes Used:</p>
                <div className="flex flex-wrap gap-2">
                  {user.codes.map((codeUsage, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-mono"
                    >
                      {codeUsage.code}
                      <span className="ml-2 text-gray-500 text-xs">
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

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <button
          onClick={fetchRankings}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Refresh Rankings
        </button>
      </div>
    </div>
  );
}

