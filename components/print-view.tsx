"use client"

import { forwardRef, useEffect } from "react"
import { X } from "lucide-react"

interface Code {
  id: string
  code: string
  used: boolean
  createdAt: Date
}

interface PrintViewProps {
  codes: Code[]
  onClose: () => void
}

const PrintView = forwardRef<HTMLDivElement, PrintViewProps>(({ codes, onClose }, ref) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />

      {/* Print Preview Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto md:hidden">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Print Preview</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div ref={ref} className="print:block">
                <style>{`
                  @media print {
                    body {
                      margin: 0;
                      padding: 0;
                    }
                    .print-container {
                      display: grid;
                      grid-template-columns: repeat(3, 1fr);
                      gap: 12px;
                      padding: 20px;
                    }
                    .print-label {
                      width: 100%;
                      height: auto;
                      page-break-inside: avoid;
                    }
                  }
                `}</style>

                <div className="grid grid-cols-3 gap-3 print-container">
                  {codes.map((code) => (
                    <div
                      key={code.id}
                      className="border-2 border-slate-900 rounded p-4 text-center print-label"
                      style={{ minHeight: "80px", display: "flex", flexDirection: "column", justifyContent: "center" }}
                    >
                      <div className="font-mono font-bold text-2xl text-slate-900 tracking-widest">{code.code}</div>
                      <div className="text-xs text-slate-600 mt-2">{code.createdAt.toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Print
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

PrintView.displayName = "PrintView"
export default PrintView
