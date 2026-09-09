import React from 'react';
import { 
  Download, 
  Settings, 
  RotateCcw,
  Users
} from 'lucide-react';

export default function Navbar({ 
  onOpenExport, 
  onOpenSettings,
  onResetData,
  totalUsersCount,
  completedCount
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#012414] text-white border-b border-[#01381f] shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Title */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-400 font-mono text-base">
              SI
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black tracking-tight text-white text-base">SuperInvesting</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/20">
                  Portfolio Research
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/60 font-mono hidden sm:block">
                Top 10 Power Users Direct Interview Tracker
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Progress Pill */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/25 rounded-lg border border-white/10 text-xs font-mono">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-bold">{completedCount}/{totalUsersCount}</span>
              <span className="text-emerald-300/70 hidden sm:inline">Checked</span>
            </div>

            {/* Export CSV */}
            <button
              onClick={onOpenExport}
              title="Export CSV"
              className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              title="Google Sheets / Supabase Webhook Settings"
              className="p-2 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Reset Data */}
            <button
              onClick={onResetData}
              title="Reset all test responses and restore fresh 0/10 checklist"
              className="p-2 text-emerald-200/50 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
