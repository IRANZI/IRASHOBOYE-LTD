"use client"

import { Copy, Trash2, CheckCircle2, Circle } from "lucide-react"

interface Code {
  id: string
  code: string
  used: boolean
  createdAt: Date
}

interface CodeListProps {
  codes: Code[]
  copiedIndex: number | null
  selectedForPrint: string[]
  onCopy: (code: string, index: number) => Promise<void>
  onDelete: (id: string) => void
  onMarkUsed: (id: string) => void
  onTogglePrintSelection: (id: string) => void
}

export default function CodeList({
  codes,
  copiedIndex,
  selectedForPrint,
  onCopy,
  onDelete,
  onMarkUsed,
  onTogglePrintSelection,
}: CodeListProps) {
  if (codes.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-12 shadow-md text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-slate-500 dark:text-slate-400 mb-2">No codes generated yet</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">Click "Generate Code" to create your first code</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
        <h2 className="font-semibold text-slate-900 dark:text-white">All Codes ({codes.length})</h2>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
        {codes.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 transition-colors ${
              item.used
                ? "bg-orange-50 dark:bg-orange-900/10"
                : selectedForPrint.includes(item.id)
                  ? "bg-blue-50 dark:bg-blue-900/10"
                  : copiedIndex === index
                    ? "bg-green-50 dark:bg-green-900/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
            }`}
          >
            {/* Selection Checkbox */}
            <button
              onClick={() => onTogglePrintSelection(item.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title={selectedForPrint.includes(item.id) ? "Deselect for print" : "Select for print"}
            >
              {selectedForPrint.includes(item.id) ? (
                <CheckCircle2 size={20} className="text-blue-600" />
              ) : (
                <Circle size={20} />
              )}
            </button>

            {/* Used Badge */}
            <button
              onClick={() => onMarkUsed(item.id)}
              className="flex-shrink-0 text-slate-400 hover:text-orange-600 transition-colors"
              title={item.used ? "Mark as available" : "Mark as used"}
            >
              {item.used ? <CheckCircle2 size={20} className="text-orange-600" /> : <Circle size={20} />}
            </button>

            {/* Code Display */}
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xl font-bold text-slate-900 dark:text-white tracking-widest">
                {item.code}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {item.createdAt.toLocaleTimeString()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onCopy(item.code, index)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={18} className="text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete code"
              >
                <Trash2 size={18} className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
