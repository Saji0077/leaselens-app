// Main layout wrapper for LeaseLens app

import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export function AppLayout({ children, showHeader = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      {showHeader && (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and app name */}
              <div className="flex items-center gap-3">
                {/* Logo icon */}
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                
                {/* App name */}
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LeaseLens</h1>
                  <p className="text-xs text-gray-500 font-medium">Rental Risk Assessment</p>
                </div>
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-green-50 px-3 py-2 rounded-full border border-green-100">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="font-medium">Privacy First</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            This tool provides general rental information support only and is not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
