interface CodeStatsProps {
  totalCodes: number
  usedCodes: number
  availableCodes: number
}

export default function CodeStats({ totalCodes, usedCodes, availableCodes }: CodeStatsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Statistics</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">Total Codes</span>
          <span className="font-bold text-lg text-slate-900 dark:text-white">{totalCodes}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">Available</span>
          <span className="font-bold text-lg text-green-600">{availableCodes}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">Used</span>
          <span className="font-bold text-lg text-orange-600">{usedCodes}</span>
        </div>
      </div>

      {totalCodes > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500">Usage</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {Math.round((usedCodes / totalCodes) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${(usedCodes / totalCodes) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
