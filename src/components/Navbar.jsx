import React from 'react';
import { 
  PhoneCall, 
  BarChart3, 
  FileText, 
  Download, 
  Settings, 
  Plus, 
  ExternalLink,
  Sparkles,
  Users
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  onOpenLogger, 
  onOpenExport, 
  onOpenSettings,
  totalUsersCount,
  completedCount
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#012414] text-white border-b border-[#01381f] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Badge */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-400 font-mono text-lg">
              SI
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-white text-base">SuperInvesting</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/20">
                  Portfolio Research Hub
                </span>
              </div>
              <p className="text-xs text-emerald-200/60 font-mono hidden sm:block">Internal Power-User Feedback & Interview System</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-black/25 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setCurrentTab('team')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'team'
                  ? 'bg-[#014828] text-white shadow-sm font-bold border border-emerald-500/30'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>User Outreach</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-emerald-200">
                {completedCount}/{totalUsersCount}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('insights')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'insights'
                  ? 'bg-[#014828] text-white shadow-sm font-bold border border-emerald-500/30'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Pain Points & Analytics</span>
            </button>

            <button
              onClick={() => setCurrentTab('form')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'form'
                  ? 'bg-[#014828] text-white shadow-sm font-bold border border-emerald-500/30'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">User Form Preview</span>
              <span className="sm:hidden">Form</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenLogger}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Log Call / Feedback</span>
              <span className="md:hidden">Log</span>
            </button>

            <button
              onClick={onOpenExport}
              title="Export CSV & Reports"
              className="p-2 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              title="Settings & Webhook Sync"
              className="p-2 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
