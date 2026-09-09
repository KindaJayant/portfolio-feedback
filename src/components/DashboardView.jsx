import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Circle,
  Star, 
  Search, 
  Filter, 
  ChevronRight, 
  FileText, 
  AlertCircle, 
  Lightbulb, 
  Share2, 
  Check,
  Building2,
  Trash2
} from 'lucide-react';
import { PAIN_POINTS_LIST, IMPROVEMENTS_LIST } from '../data/powerUsers';

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
  const [copiedLinkUserId, setCopiedLinkUserId] = useState(null);

  const totalUsers = users.length;
  const completedCount = users.filter(u => u.checked).length;
  const pendingCount = totalUsers - completedCount;
  const completionPercentage = totalUsers > 0 ? Math.round((completedCount / totalUsers) * 100) : 0;

  // Real data calculations (STRICTLY NO DUMMY DATA)
  const totalFeedbackCount = feedbackList.length;
  const validRatings = feedbackList.filter(f => f.satisfactionScore > 0);
  const avgSatisfaction = validRatings.length > 0
    ? (validRatings.reduce((acc, f) => acc + f.satisfactionScore, 0) / validRatings.length).toFixed(1)
    : null;

  // Real aggregated pain points from recorded responses
  const realPainPointCounts = PAIN_POINTS_LIST.map(label => {
    const count = feedbackList.filter(f => (f.painPoints || []).includes(label)).length;
    return { label, count };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

  // Real aggregated improvements from recorded responses
  const realImprovementCounts = IMPROVEMENTS_LIST.map(label => {
    const count = feedbackList.filter(f => (f.improvements || []).includes(label)).length;
    return { label, count };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

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

  const copyPersonalizedLink = (e, user) => {
    e.stopPropagation();
    const origin = window.location.origin;
    const url = `${origin}/?uid=${encodeURIComponent(user.id)}&name=${encodeURIComponent(user.name)}&phone=${encodeURIComponent(user.phone)}&email=${encodeURIComponent(user.email || '')}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkUserId(user.id);
    setTimeout(() => setCopiedLinkUserId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. Header Progress Tracker */}
      <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
                Portfolio Feedback Tracker
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                10 Power Users
              </span>
            </div>
            <p className="text-sm text-charcoal-500 mt-1">
              Click on any user's name to open their questions and log feedback on pain points & improvements.
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

                      {/* Satisfaction Score if recorded */}
                      {userFeedback && userFeedback.satisfactionScore > 0 && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{userFeedback.satisfactionScore}/5</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-charcoal-500 font-mono">
                      <span>Phone: <strong className="text-charcoal-800">{user.phone}</strong></span>
                      {userFeedback?.brokers && userFeedback.brokers.length > 0 && (
                        <span className="text-blue-700">Brokers: {userFeedback.brokers.join(', ')}</span>
                      )}
                    </div>

                    {/* Brief preview of recorded pain points / notes if any */}
                    {userFeedback && (userFeedback.painPoints?.length > 0 || userFeedback.notes) && (
                      <div className="mt-2 text-xs text-charcoal-600 bg-white/80 p-2 rounded-lg border border-charcoal-200/70 max-w-2xl">
                        {userFeedback.painPoints?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {userFeedback.painPoints.map((pp, pIdx) => (
                              <span key={pIdx} className="px-1.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[10px] font-medium">
                                {pp}
                              </span>
                            ))}
                          </div>
                        )}
                        {userFeedback.notes && (
                          <p className="italic text-charcoal-700 line-clamp-1">
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
                    <span>{userFeedback ? 'Edit Feedback' : 'Open Questions'}</span>
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
              <span>Aggregated Feedback Summary</span>
              <span className="text-xs font-mono font-normal text-charcoal-500">
                ({totalFeedbackCount} responses recorded)
              </span>
            </h2>
            <p className="text-xs text-charcoal-500 font-mono mt-0.5">
              Strictly calculated from the interviews you log above
            </p>
          </div>
        </div>

        {totalFeedbackCount === 0 ? (
          <div className="text-center py-10 px-4 bg-[#FAF8F5] rounded-xl border border-dashed border-charcoal-300">
            <AlertCircle className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-charcoal-700">No interviews recorded yet</div>
            <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
              Click on any user's name above (e.g. Gaurav Agrawal, Paresh shah) to open the questions and record their portfolio feedback.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Real Pain Points Tally */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Reported Pain Points ({realPainPointCounts.length})</span>
              </h3>
              {realPainPointCounts.length === 0 ? (
                <div className="text-xs text-charcoal-400 italic p-3 bg-oat-50 rounded-lg">No specific pain points logged yet</div>
              ) : (
                <div className="space-y-2">
                  {realPainPointCounts.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/50 flex items-center justify-between text-xs">
                      <span className="font-medium text-charcoal-900">{item.label}</span>
                      <span className="font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                        {item.count} {item.count === 1 ? 'user' : 'users'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Real Improvements Tally */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>Requested Improvements ({realImprovementCounts.length})</span>
              </h3>
              {realImprovementCounts.length === 0 ? (
                <div className="text-xs text-charcoal-400 italic p-3 bg-oat-50 rounded-lg">No feature requests logged yet</div>
              ) : (
                <div className="space-y-2">
                  {realImprovementCounts.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/50 flex items-center justify-between text-xs">
                      <span className="font-medium text-charcoal-900">{item.label}</span>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                        {item.count} {item.count === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verbatim Quotes Feed */}
            <div className="md:col-span-2 pt-4 border-t border-charcoal-100 space-y-3">
              <h3 className="text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider">
                Recent User Notes & Quotes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {feedbackList.filter(f => f.notes).map(entry => (
                  <div key={entry.id} className="p-3 bg-[#FAF8F5] border border-charcoal-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-charcoal-900">{entry.userName}</span>
                      {entry.satisfactionScore > 0 && (
                        <span className="text-[11px] font-mono font-bold text-amber-700">★ {entry.satisfactionScore}/5</span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal-700 italic">"{entry.notes}"</p>
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
