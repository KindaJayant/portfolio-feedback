import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Star, 
  Search, 
  ChevronRight, 
  FileText, 
  AlertCircle, 
  Zap,
  Leaf,
  Check,
  Building2,
  Clock,
  Layers,
  HelpCircle,
  BarChart2
} from 'lucide-react';

export default function DashboardView({ 
  users, 
  feedbackList, 
  onSelectUser, 
  onToggleUserChecked,
  onDeleteFeedback,
  onOpenExport
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Pending' | 'Checked'

  const totalUsers = users.length;
  const completedCount = users.filter(u => u.checked).length;
  const pendingCount = totalUsers - completedCount;
  const completionPercentage = totalUsers > 0 ? Math.round((completedCount / totalUsers) * 100) : 0;

  // Real statistics (STRICTLY NO DUMMY DATA)
  const totalFeedbackCount = feedbackList.length;
  const validRatings = feedbackList.filter(f => f.satisfactionScore > 0);
  const avgSatisfaction = validRatings.length > 0
    ? (validRatings.reduce((acc, f) => acc + f.satisfactionScore, 0) / validRatings.length).toFixed(1)
    : null;

  // Aggregated review frequencies
  const reviewFreqCounts = {};
  feedbackList.forEach(f => {
    if (f.reviewFrequency) {
      reviewFreqCounts[f.reviewFrequency] = (reviewFreqCounts[f.reviewFrequency] || 0) + 1;
    }
  });

  // Aggregated tools
  const toolsCounts = {};
  feedbackList.forEach(f => {
    (f.currentTrackingTools || []).forEach(tool => {
      toolsCounts[tool] = (toolsCounts[tool] || 0) + 1;
    });
  });

  // Filter users based on search & filter tab
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchesFilter = 
      activeFilter === 'All' ? true :
      activeFilter === 'Checked' ? u.checked :
      !u.checked;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. Header Progress Tracker */}
      <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
                Portfolio Interview Tracker
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                10 Priority Users
              </span>
            </div>
            <p className="text-sm text-charcoal-500 mt-1">
              Click on any user's name to open the questionnaire (Common, Heavy User, & Light User question sets).
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-[#FAF8F5] border border-charcoal-200 px-4 py-2.5 rounded-xl text-center min-w-[100px]">
              <div className="text-xs font-mono font-bold text-charcoal-500 uppercase">Checked</div>
              <div className="text-2xl font-black text-emerald-800">
                {completedCount} <span className="text-sm font-normal text-charcoal-400">/ {totalUsers}</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-charcoal-200 px-4 py-2.5 rounded-xl text-center min-w-[100px]">
              <div className="text-xs font-mono font-bold text-charcoal-500 uppercase">Avg CSAT</div>
              <div className="text-2xl font-black text-amber-600">
                {avgSatisfaction !== null ? `${avgSatisfaction}★` : '—'}
              </div>
            </div>

            <button
              onClick={onOpenExport}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 h-full"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-mono font-bold text-charcoal-600">
            <span>Interview Completion: {completionPercentage}%</span>
            <span>{completedCount} of {totalUsers} users checked</span>
          </div>
          <div className="w-full bg-oat-200 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-700 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. The 10 Power Users List */}
      <div className="bg-white rounded-2xl border border-charcoal-200 shadow-sm overflow-hidden">
        
        {/* List Controls: Search & Filter */}
        <div className="p-4 sm:p-5 border-b border-charcoal-100 bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'All' 
                  ? 'bg-emerald-900 text-white shadow-sm' 
                  : 'bg-white text-charcoal-700 hover:bg-oat-100 border border-charcoal-200'
              }`}
            >
              All Users ({totalUsers})
            </button>

            <button
              onClick={() => setActiveFilter('Pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'Pending' 
                  ? 'bg-emerald-900 text-white shadow-sm' 
                  : 'bg-white text-charcoal-700 hover:bg-oat-100 border border-charcoal-200'
              }`}
            >
              Pending ({pendingCount})
            </button>

            <button
              onClick={() => setActiveFilter('Checked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'Checked' 
                  ? 'bg-emerald-900 text-white shadow-sm' 
                  : 'bg-white text-charcoal-700 hover:bg-oat-100 border border-charcoal-200'
              }`}
            >
              Checked ({completedCount})
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name or phone..."
              className="pl-9 pr-3 py-1.5 bg-white border border-charcoal-300 rounded-lg text-xs font-medium text-charcoal-800 focus:outline-none focus:border-forest-600 w-full sm:w-64"
            />
          </div>

        </div>

        {/* Users Checklist Rows */}
        <div className="divide-y divide-charcoal-100">
          {filteredUsers.map((user, idx) => {
            const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hi ${user.name}, this is Jayant from SuperInvesting.ai. We're redesigning our Portfolio section and would love 5 minutes of your feedback. Are you free for a quick call?`
            )}`;
            
            const userFeedback = feedbackList.find(f => f.userId === user.id);

            return (
              <div 
                key={user.id}
                className={`p-4 sm:p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  user.checked ? 'bg-emerald-50/30 hover:bg-emerald-50/50' : 'hover:bg-[#FAF8F5]'
                }`}
              >
                
                {/* Left: Checkbox + User Info & Clickable Name */}
                <div className="flex items-start sm:items-center space-x-3.5 flex-1 min-w-0">
                  
                  {/* Clickable Checkbox */}
                  <button
                    type="button"
                    onClick={() => onToggleUserChecked(user.id)}
                    title={user.checked ? 'Mark as Pending' : 'Mark as Checked'}
                    className={`mt-1 sm:mt-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 border ${
                      user.checked
                        ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                        : 'border-charcoal-300 bg-white hover:border-emerald-600 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  {/* Name (Click to open questions) & Contact details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onSelectUser(user)}
                        className="text-base font-black text-charcoal-900 hover:text-emerald-800 transition-colors text-left flex items-center group"
                      >
                        <span className="group-hover:underline">{user.name}</span>
                        <ChevronRight className="w-4 h-4 ml-1 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-700" />
                      </button>

                      {/* Status Tag */}
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        user.checked 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-oat-200 text-charcoal-600'
                      }`}>
                        {user.checked ? '✓ Checked' : 'Pending'}
                      </span>

                      {/* Persona Badge if filled */}
                      {userFeedback && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center space-x-1 ${
                          userFeedback.userType === 'light'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {userFeedback.userType === 'light' ? (
                            <>
                              <Leaf className="w-3 h-3 text-blue-700" />
                              <span>Light User</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 text-amber-700" />
                              <span>Heavy User</span>
                            </>
                          )}
                        </span>
                      )}

                      {/* Satisfaction Score if recorded */}
                      {userFeedback && userFeedback.satisfactionScore > 0 && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{userFeedback.satisfactionScore}/5</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-charcoal-500 font-mono">
                      <span>Phone: <strong className="text-charcoal-800">{user.phone}</strong></span>
                      {userFeedback?.reviewFrequency && (
                        <span className="text-emerald-800">Frequency: <strong>{userFeedback.reviewFrequency}</strong></span>
                      )}
                    </div>

                    {/* Brief preview of recorded feedback if any */}
                    {userFeedback && (
                      <div className="mt-2 text-xs text-charcoal-700 bg-white/80 p-2.5 rounded-lg border border-charcoal-200/80 max-w-2xl space-y-1">
                        {userFeedback.hardestPartManaging && (
                          <div>
                            <span className="font-bold text-charcoal-900">Hardest Part:</span> "{userFeedback.hardestPartManaging}"
                          </div>
                        )}
                        {userFeedback.mostAnnoyingThing && (
                          <div className="text-rose-900">
                            <span className="font-bold text-rose-950">Most Annoying:</span> "{userFeedback.mostAnnoyingThing}"
                          </div>
                        )}
                        {userFeedback.missingThing && (
                          <div className="text-emerald-950">
                            <span className="font-bold">Missing:</span> "{userFeedback.missingThing}"
                          </div>
                        )}
                        {userFeedback.notes && (
                          <p className="italic text-charcoal-500 line-clamp-1 border-t border-charcoal-100 pt-1 mt-1">
                            "{userFeedback.notes}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Right: Outreach & Form Trigger Actions */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  
                  {/* Call */}
                  <a
                    href={`tel:${cleanPhone}`}
                    title="Call user"
                    className="p-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-charcoal-200 rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Call</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open WhatsApp"
                    className="p-2 bg-white hover:bg-green-50 text-green-700 border border-charcoal-200 rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">WhatsApp</span>
                  </a>

                  {/* Open Questions Button */}
                  <button
                    onClick={() => onSelectUser(user)}
                    className="px-3.5 py-2 bg-[#014828] hover:bg-[#01381f] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
                  >
                    <span>{userFeedback ? 'Edit Answers' : 'Ask Questions'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 3. Real Insights Section (ONLY RENDERED FROM GENUINE RECORDED RESPONSES) */}
      <div className="bg-white rounded-2xl border border-charcoal-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-charcoal-100">
          <div>
            <h2 className="text-base font-bold text-charcoal-900 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-emerald-700" />
              <span>Interview Insights & Patterns</span>
              <span className="text-xs font-mono font-normal text-charcoal-500">
                ({totalFeedbackCount} responses recorded)
              </span>
            </h2>
            <p className="text-xs text-charcoal-500 font-mono mt-0.5">
              Calculated live and strictly from real recorded responses (Zero dummy data)
            </p>
          </div>
        </div>

        {totalFeedbackCount === 0 ? (
          <div className="text-center py-10 px-4 bg-[#FAF8F5] rounded-xl border border-dashed border-charcoal-300">
            <AlertCircle className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-charcoal-700">No interviews recorded yet</div>
            <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
              Click on any user's name above (e.g. Gaurav Agrawal, Paresh shah) to start logging responses to the questionnaire.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Review Frequency breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Review Frequency</span>
              </h3>
              <div className="space-y-2">
                {Object.entries(reviewFreqCounts).map(([freq, count], i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40 flex items-center justify-between text-xs">
                    <span className="font-medium text-charcoal-900">{freq}</span>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                      {count} {count === 1 ? 'user' : 'users'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Tools Used */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Current Tools & Spreadsheets Used</span>
              </h3>
              <div className="space-y-2">
                {Object.entries(toolsCounts).map(([tool, count], i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-blue-100 bg-blue-50/40 flex items-center justify-between text-xs">
                    <span className="font-medium text-charcoal-900">{tool}</span>
                    <span className="font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                      {count} {count === 1 ? 'mention' : 'mentions'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Qualitative Snippets Feed */}
            <div className="md:col-span-2 pt-4 border-t border-charcoal-100 space-y-4">
              <h3 className="text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider">
                Logged Interview Insights & Verbatim Quotes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {feedbackList.map(entry => (
                  <div key={entry.id} className="p-4 bg-[#FAF8F5] border border-charcoal-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-charcoal-900">{entry.userName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-charcoal-200 text-charcoal-800">
                        {entry.userType === 'light' ? 'Light User' : 'Heavy User'}
                      </span>
                    </div>

                    {entry.hardestPartManaging && (
                      <div className="text-xs text-charcoal-800">
                        <span className="font-bold text-charcoal-900 block text-[11px] font-mono text-charcoal-500 uppercase">Hardest Part:</span>
                        "{entry.hardestPartManaging}"
                      </div>
                    )}

                    {entry.mostAnnoyingThing && (
                      <div className="text-xs text-rose-900">
                        <span className="font-bold text-rose-950 block text-[11px] font-mono uppercase">Most Annoying:</span>
                        "{entry.mostAnnoyingThing}"
                      </div>
                    )}

                    {entry.notes && (
                      <div className="text-xs text-charcoal-600 italic border-t border-charcoal-200/60 pt-1.5">
                        Notes: "{entry.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
