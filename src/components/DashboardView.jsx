import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Star, 
  ExternalLink, 
  Copy, 
  ChevronRight,
  TrendingUp,
  Filter,
  Search,
  Check,
  Trash2,
  Share2
} from 'lucide-react';
import { PAIN_POINT_CATEGORIES, FEATURE_WISHLIST } from '../data/powerUsers';

export default function DashboardView({ 
  users, 
  feedbackList, 
  onSelectUserForCall, 
  onUpdateUserStatus,
  onDeleteFeedback 
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedLinkUserId, setCopiedLinkUserId] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', phone: '', email: '', tier: 'Yearly Plan' });

  // Statistics
  const totalUsers = users.length;
  const completedUsers = users.filter(u => u.status === 'Completed').length;
  const inProgressUsers = users.filter(u => u.status === 'In Progress').length;
  const pendingUsers = users.filter(u => u.status === 'Pending').length;

  const totalFeedbackCount = feedbackList.length;
  const avgSatisfaction = totalFeedbackCount > 0
    ? (feedbackList.reduce((acc, f) => acc + (f.satisfactionScore || 0), 0) / totalFeedbackCount).toFixed(1)
    : '4.2';

  // Aggregate pain points from live feedback + defaults
  const painPointStats = PAIN_POINT_CATEGORIES.map(p => {
    const count = feedbackList.filter(f => (f.painPoints || []).includes(p.label)).length;
    return { ...p, count };
  }).sort((a, b) => b.count - a.count);

  // Aggregate feature requests
  const featureStats = FEATURE_WISHLIST.map(f => {
    const loggedVotes = feedbackList.filter(fb => (fb.featureRequests || []).includes(f.label)).length;
    const totalVotes = f.votes + loggedVotes;
    return { ...f, totalVotes };
  }).sort((a, b) => b.totalVotes - a.totalVotes);

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.phone.includes(searchQuery) ||
                          u.tier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || u.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const copyWhatsAppScript = (user) => {
    const text = `Hi ${user.name}, this is Jayant from SuperInvesting.ai Product Team. We noticed you're among our top active members on the platform. We are redesigning the Portfolio section and would love 5 minutes of your feedback to build what you need. Are you free for a quick call today?`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyPersonalizedLink = (user) => {
    const origin = window.location.origin;
    const url = `${origin}/?uid=${encodeURIComponent(user.id)}&name=${encodeURIComponent(user.name)}&phone=${encodeURIComponent(user.phone)}&email=${encodeURIComponent(user.email || '')}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkUserId(user.id);
    setTimeout(() => setCopiedLinkUserId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* 1. Header Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-charcoal-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold text-charcoal-500 uppercase tracking-wider">Target Power Users</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black text-charcoal-900">{totalUsers}</span>
            <span className="text-xs font-mono font-semibold text-forest-600">Top 0.1%</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-charcoal-400">High-intent investors</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-charcoal-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold text-charcoal-500 uppercase tracking-wider">Interviews Completed</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-800">{completedUsers}</span>
            <span className="text-xs font-mono font-bold text-emerald-600">
              {Math.round((completedUsers / totalUsers) * 100)}% done
            </span>
          </div>
          <div className="mt-3 w-full bg-oat-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#014828] h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedUsers / totalUsers) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-charcoal-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold text-charcoal-500 uppercase tracking-wider">Avg Portfolio CSAT</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-600">{avgSatisfaction}</span>
            <span className="text-xs font-mono font-bold text-charcoal-500">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-charcoal-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold text-charcoal-500 uppercase tracking-wider">Total Feedback Logs</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black text-charcoal-900">{totalFeedbackCount}</span>
            <span className="text-xs font-mono font-bold text-blue-600">Live Entries</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-charcoal-400">Stored locally & synced</div>
        </div>
      </div>

      {/* 2. Power Users Outreach Tracker (CRM Table) */}
      <div className="bg-white rounded-2xl border border-charcoal-200 shadow-sm overflow-hidden">
        
        {/* Table Top Controls */}
        <div className="p-5 sm:p-6 border-b border-charcoal-100 bg-[#FAF8F5] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-charcoal-900 flex items-center space-x-2">
              <span>Power Users Interview Queue</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 font-mono font-bold">
                10 Priority Contacts
              </span>
            </h3>
            <p className="text-xs text-charcoal-500 font-mono mt-0.5">Direct outreach list for portfolio feedback calls</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone..."
                className="pl-9 pr-3 py-1.5 bg-white border border-charcoal-300 rounded-lg text-xs font-medium text-charcoal-800 focus:outline-none focus:border-forest-600 w-44 sm:w-56"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-oat-200 p-1 rounded-lg text-xs font-semibold">
              {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeFilter === status
                      ? 'bg-white text-charcoal-900 shadow-sm font-bold'
                      : 'text-charcoal-600 hover:text-charcoal-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-oat-50 text-[11px] font-mono text-charcoal-500 uppercase tracking-wider border-b border-charcoal-200">
                <th className="py-3.5 px-5 font-bold">User</th>
                <th className="py-3.5 px-4 font-bold">Subscription Tier</th>
                <th className="py-3.5 px-4 font-bold">Contact Info</th>
                <th className="py-3.5 px-4 font-bold">Outreach Status</th>
                <th className="py-3.5 px-5 text-right font-bold">Outreach Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-sm font-medium">
              {filteredUsers.map((user, idx) => {
                const phoneClean = user.phone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(`Hi ${user.name}, this is Jayant from SuperInvesting.ai Product Team. We noticed you are among our top active investors on the platform. We are redesigning the Portfolio section and would love 5 minutes of your feedback. Are you free for a quick call today?`)}`;

                return (
                  <tr key={user.id} className="hover:bg-oat-50/70 transition-colors">
                    
                    {/* User Profile */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full ${user.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                          {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-charcoal-900">{user.name}</div>
                          <div className="text-[11px] font-mono text-charcoal-400">ID: {user.id.substring(0, 10)}...</div>
                        </div>
                      </div>
                    </td>

                    {/* Subscription */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                        {user.tier}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4">
                      <div className="font-mono text-xs font-bold text-charcoal-800">{user.phone}</div>
                      <div className="text-[11px] text-charcoal-400 truncate max-w-[180px]">{user.email}</div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={user.status}
                        onChange={(e) => onUpdateUserStatus(user.id, e.target.value)}
                        className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          user.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : user.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Call Button */}
                        <a
                          href={`tel:${user.phone.replace(/\s+/g, '')}`}
                          title={`Call ${user.name}`}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors border border-emerald-200 flex items-center space-x-1 text-xs font-bold"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Call</span>
                        </a>

                        {/* WhatsApp Button */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open WhatsApp chat"
                          className="p-2 bg-green-50 hover:bg-green-100 text-green-800 rounded-lg transition-colors border border-green-200 flex items-center space-x-1 text-xs font-bold"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WA</span>
                        </a>

                        {/* Copy Script Button */}
                        <button
                          onClick={() => copyWhatsAppScript(user)}
                          title="Copy WhatsApp invitation text"
                          className="p-2 bg-oat-100 hover:bg-oat-200 text-charcoal-700 rounded-lg transition-colors border border-oat-300"
                        >
                          {copiedId === user.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {/* Copy User Personal Link Button */}
                        <button
                          onClick={() => copyPersonalizedLink(user)}
                          title="Copy pre-filled personalized questionnaire link"
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg transition-colors border border-blue-200 flex items-center space-x-1 text-xs font-bold"
                        >
                          {copiedLinkUserId === user.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                          <span className="hidden md:inline">{copiedLinkUserId === user.id ? 'Copied' : 'Link'}</span>
                        </button>

                        {/* Log Interview Modal Trigger */}
                        <button
                          onClick={() => onSelectUserForCall(user)}
                          className="px-3 py-1.5 bg-[#014828] hover:bg-[#01381f] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
                        >
                          <span>Log Call</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* 3. Deep Dive Analytics & Pain Points Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pain Points Severity Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-charcoal-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-charcoal-100">
            <div>
              <h3 className="text-sm font-bold font-mono text-charcoal-900 uppercase tracking-wider">
                Ranked Pain Points in Portfolio
              </h3>
              <p className="text-xs text-charcoal-500 font-mono mt-0.5">Top reported friction areas from user interviews</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Friction Areas
            </span>
          </div>

          <div className="space-y-3">
            {painPointStats.map((item, i) => (
              <div key={item.id} className="p-3 rounded-xl border border-oat-200 bg-oat-50/50 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-charcoal-200 text-charcoal-800 text-[10px] font-mono font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-charcoal-900">{item.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {item.count} reports
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-500 mt-1 pl-7 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Request Demand Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-charcoal-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-charcoal-100">
            <div>
              <h3 className="text-sm font-bold font-mono text-charcoal-900 uppercase tracking-wider">
                Feature Wishlist Leaderboard
              </h3>
              <p className="text-xs text-charcoal-500 font-mono mt-0.5">High-demand roadmap features voted by power users</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Roadmap Votes
            </span>
          </div>

          <div className="space-y-4">
            {featureStats.map((item, i) => {
              const maxVotes = Math.max(...featureStats.map(f => f.totalVotes), 10);
              const pct = Math.round((item.totalVotes / maxVotes) * 100);

              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-charcoal-900 flex items-center space-x-1.5">
                      <span className="text-emerald-700 font-mono">#{i + 1}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono font-bold text-charcoal-800">{item.totalVotes} votes</span>
                  </div>

                  <div className="w-full bg-oat-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-700 to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-charcoal-500 font-mono">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. Logged Feedback Feed & Verbatim Quotes */}
      {feedbackList.length > 0 && (
        <div className="bg-white rounded-2xl border border-charcoal-200 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-charcoal-100">
            <div>
              <h3 className="text-sm font-bold font-mono text-charcoal-900 uppercase tracking-wider">
                Recent User Interview Logs & Quotes
              </h3>
              <p className="text-xs text-charcoal-500 font-mono mt-0.5">Direct insights captured by the team</p>
            </div>
            <span className="text-xs font-mono text-charcoal-500">{feedbackList.length} submissions recorded</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbackList.map(entry => (
              <div key={entry.id} className="p-4 rounded-xl border border-oat-300 bg-[#FAF8F5] space-y-3 relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-charcoal-900 text-sm">{entry.userName}</span>
                    <div className="text-[11px] font-mono text-charcoal-500">
                      Logged by {entry.interviewerName || 'Team'} on {entry.createdAt ? entry.createdAt.split('T')[0] : 'Recent'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-xs font-bold font-mono">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{entry.satisfactionScore || 3}/5</span>
                    </div>

                    <button
                      onClick={() => onDeleteFeedback(entry.id)}
                      title="Delete entry"
                      className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 p-1 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {entry.verbatimFeedback && (
                  <div className="p-2.5 rounded-lg bg-white border border-charcoal-100 text-xs italic text-charcoal-800">
                    "{entry.verbatimFeedback}"
                  </div>
                )}

                {entry.painPoints && entry.painPoints.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {entry.painPoints.map((p, idx) => (
                      <span key={idx} className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-900">
                        {p}
                      </span>
                    ))}
                  </div>
                )}

                {entry.actionItems && (
                  <div className="text-xs text-emerald-900 font-mono pt-2 border-t border-charcoal-100 flex items-center space-x-1.5">
                    <span className="font-bold">Next Action:</span>
                    <span>{entry.actionItems}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
