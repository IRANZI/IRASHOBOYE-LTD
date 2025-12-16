"use client"

import { forwardRef, useEffect } from "react"
import { X, Check } from "lucide-react"

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

const PHONE_NUMBER = "+250788873038"

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
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Print Preview Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 print:hidden">
              <h3 className="font-semibold text-slate-900 dark:text-white">Print Preview</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
              <div ref={ref} className="print:block">
                <style>{`
                  @media print {
                    @page {
                      size: A4;
                      margin: 1cm;
                    }
                    body {
                      margin: 0;
                      padding: 0;
                      background: white;
                    }
                    .no-print {
                      display: none !important;
                    }
                    .print-container {
                      display: block;
                      width: 100%;
                    }
                    .print-card {
                      width: 100%;
                      min-height: 10cm;
                      page-break-after: always;
                      page-break-inside: avoid;
                      border: 2px solid #000;
                      margin-bottom: 1cm;
                      position: relative;
                    }
                    .card-section {
                      width: 100%;
                      min-height: 9cm;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      padding: 1.5cm;
                      box-sizing: border-box;
                    }
                    .card-front {
                      border-bottom: 3px dashed #666;
                    }
                    .card-back {
                      background: #f9f9f9;
                    }
                    .section-label {
                      position: absolute;
                      top: 0.3cm;
                      left: 0.5cm;
                      font-size: 0.6cm;
                      color: #666;
                      font-weight: bold;
                    }
                    .used-badge {
                      position: absolute;
                      top: 0.3cm;
                      right: 0.5cm;
                      background: #ef4444;
                      color: white;
                      padding: 0.2cm 0.4cm;
                      border-radius: 0.2cm;
                      font-size: 0.6cm;
                      font-weight: bold;
                      z-index: 10;
                    }
                    .print-card:last-child {
                      page-break-after: auto;
                    }
                  }
                  @media screen {
                    .print-container {
                      display: block;
                      width: 100%;
                      padding: 1rem;
                    }
                    .print-card {
                      width: 100%;
                      min-height: 400px;
                      border: 2px solid #000;
                      border-radius: 8px;
                      margin-bottom: 2rem;
                      position: relative;
                      background: white;
                    }
                    .card-section {
                      width: 100%;
                      min-height: 180px;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      padding: 2rem;
                      box-sizing: border-box;
                    }
                    .card-front {
                      border-bottom: 3px dashed #ccc;
                    }
                    .card-back {
                      background: #f9f9f9;
                    }
                    .section-label {
                      position: absolute;
                      top: 0.75rem;
                      left: 1rem;
                      font-size: 0.75rem;
                      color: #666;
                      font-weight: bold;
                    }
                    .used-badge {
                      position: absolute;
                      top: 0.75rem;
                      right: 1rem;
                      background: #ef4444;
                      color: white;
                      padding: 0.25rem 0.5rem;
                      border-radius: 0.25rem;
                      font-size: 0.75rem;
                      font-weight: bold;
                      z-index: 10;
                      display: flex;
                      align-items: center;
                      gap: 0.25rem;
                    }
                  }
                `}</style>

                <div className="print-container">
                  {codes.map((code) => (
                    <div
                      key={code.id}
                      className="print-card"
                    >
                      {code.used && (
                        <div className="used-badge">
                          <Check size={14} />
                          USED
                        </div>
                      )}
                      
                      {/* Front Side - Code */}
                      <div className="card-section card-front">
                        <div className="section-label print:hidden">FRONT</div>
                        <div className="text-center w-full">
                          <div className="text-xs text-gray-500 mb-3 print:text-[0.6cm] print:mb-0.5cm">
                            KOLOREX ESTABLISHMENTS LIMITED
                          </div>
                          <div className="font-mono font-bold text-5xl text-slate-900 tracking-widest print:text-[2cm] print:mb-0.5cm">
                            {code.code}
                          </div>
                          <div className="text-sm text-gray-600 mt-4 print:text-[0.5cm] print:mt-0.3cm">
                            {new Date(code.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Back Side - Phone Number */}
                      <div className="card-section card-back">
                        <div className="section-label print:hidden">BACK</div>
                        <div className="text-center w-full">
                          <div className="text-xs text-gray-500 mb-4 print:text-[0.6cm] print:mb-0.5cm">
                            Contact Us
                          </div>
                          <div className="font-bold text-4xl text-slate-900 print:text-[1.5cm]">
                            {PHONE_NUMBER}
                          </div>
                          <div className="text-xs text-gray-500 mt-6 print:text-[0.5cm] print:mt-0.5cm">
                            Code: {code.code}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 p-4 border-t border-slate-200 dark:border-slate-700 print:hidden no-print">
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
