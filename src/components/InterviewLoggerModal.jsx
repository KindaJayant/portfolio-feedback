import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Star, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  Lightbulb, 
  Save, 
  User,
  Plus,
  ExternalLink
} from 'lucide-react';
import { PAIN_POINT_CATEGORIES, FEATURE_WISHLIST, BROKERS } from '../data/powerUsers';
import confetti from 'canvas-confetti';

export default function InterviewLoggerModal({ 
  isOpen, 
  onClose, 
  selectedUser, 
  allUsers, 
  onSaveFeedback,
  teamMembers 
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    userId: selectedUser ? selectedUser.id : '',
    userName: selectedUser ? selectedUser.name : '',
    userPhone: selectedUser ? selectedUser.phone : '',
    userEmail: selectedUser ? selectedUser.email : '',
    interviewerName: teamMembers[0] || 'Jayant',
    callStatus: 'Completed',
    satisfactionScore: 3,
    brokers: [],
    painPoints: [],
    customPainPoint: '',
    featureRequests: [],
    missingAiInsights: '',
    verbatimFeedback: '',
    actionItems: '',
    mode: 'Team Interview Call'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setFormData(prev => ({
        ...prev,
        userId: selectedUser.id,
        userName: selectedUser.name,
        userPhone: selectedUser.phone,
        userEmail: selectedUser.email
      }));
    }
  }, [selectedUser]);

  const handleUserSelect = (e) => {
    const uid = e.target.value;
    const user = allUsers.find(u => u.id === uid);
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        userEmail: user.email
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        userId: '',
        userName: '',
        userPhone: '',
        userEmail: ''
      }));
    }
  };

  const toggleBroker = (broker) => {
    setFormData(prev => ({
      ...prev,
      brokers: prev.brokers.includes(broker)
        ? prev.brokers.filter(b => b !== broker)
        : [...prev.brokers, broker]
    }));
  };

  const togglePainPoint = (painPointId) => {
    setFormData(prev => ({
      ...prev,
      painPoints: prev.painPoints.includes(painPointId)
        ? prev.painPoints.filter(p => p !== painPointId)
        : [...prev.painPoints, painPointId]
    }));
  };

  const toggleFeature = (featureId) => {
    setFormData(prev => ({
      ...prev,
      featureRequests: prev.featureRequests.includes(featureId)
        ? prev.featureRequests.filter(f => f !== featureId)
        : [...prev.featureRequests, featureId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName) {
      alert('Please select or specify a user name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveFeedback({
        ...formData,
        submittedAt: new Date().toISOString()
      });
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onClose();
    } catch (err) {
      alert('Error saving feedback: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-charcoal-200 max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#012414] text-white flex items-center justify-between border-b border-[#01381f]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 border border-emerald-400/30 rounded-lg text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log User Interview & Feedback</h2>
              <p className="text-xs text-emerald-200/70 font-mono">Structured call notes & portfolio diagnostics capture</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-200/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. User & Contact Info Section */}
          <div className="bg-[#FAF8F5] p-4.5 rounded-xl border border-oat-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-xs font-mono font-bold text-charcoal-600 uppercase tracking-wider mb-1">
                  Select User (10 Power Users or Custom)
                </label>
                <select
                  value={formData.userId}
                  onChange={handleUserSelect}
                  className="w-full bg-white border border-charcoal-300 rounded-lg px-3 py-2 text-sm font-semibold text-charcoal-900 focus:outline-none focus:border-forest-600 shadow-sm"
                >
                  <option value="">-- Choose Power User or Type Custom Below --</option>
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.phone}) — {u.tier}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-48">
                <label className="block text-xs font-mono font-bold text-charcoal-600 uppercase tracking-wider mb-1">
                  Interviewer
                </label>
                <select
                  value={formData.interviewerName}
                  onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                  className="w-full bg-white border border-charcoal-300 rounded-lg px-3 py-2 text-sm font-semibold text-charcoal-900 focus:outline-none focus:border-forest-600 shadow-sm"
                >
                  {teamMembers.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-charcoal-500 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="e.g. Gaurav Agrawal"
                  className="w-full bg-white border border-charcoal-200 rounded-lg px-3 py-1.5 text-sm font-medium text-charcoal-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-charcoal-500 mb-1">Phone Number</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="text"
                    value={formData.userPhone}
                    onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-white border border-charcoal-200 rounded-lg px-3 py-1.5 text-sm font-mono text-charcoal-800"
                  />
                  {formData.userPhone && (
                    <a
                      href={`tel:${formData.userPhone.replace(/\s+/g, '')}`}
                      title="Call directly"
                      className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-charcoal-500 mb-1">Call Outcome</label>
                <select
                  value={formData.callStatus}
                  onChange={(e) => setFormData({ ...formData, callStatus: e.target.value })}
                  className="w-full bg-white border border-charcoal-200 rounded-lg px-3 py-1.5 text-sm font-medium text-charcoal-800"
                >
                  <option value="Completed">Call Completed</option>
                  <option value="Follow-up Needed">Follow-up Needed</option>
                  <option value="Scheduled">Call Scheduled</option>
                  <option value="Declined">Declined / Unreachable</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Satisfaction Score */}
          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider mb-2">
              Portfolio Section Satisfaction Rating (1 to 5)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setFormData({ ...formData, satisfactionScore: score })}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-1.5 transition-all ${
                    formData.satisfactionScore === score
                      ? 'bg-[#014828] text-white shadow-md scale-105 border border-emerald-500'
                      : 'bg-oat-100 hover:bg-oat-200 text-charcoal-700 border border-oat-300'
                  }`}
                >
                  <Star className={`w-4 h-4 ${formData.satisfactionScore >= score ? 'fill-amber-400 text-amber-400' : 'text-charcoal-400'}`} />
                  <span>{score}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[11px] font-mono text-charcoal-400 mt-1 px-1">
              <span>1 - Very Frustrating</span>
              <span>3 - Neutral / OK</span>
              <span>5 - Exceptional</span>
            </div>
          </div>

          {/* 3. Primary Brokers Used */}
          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider mb-2">
              Broker(s) Used by User
            </label>
            <div className="flex flex-wrap gap-2">
              {BROKERS.map(b => {
                const isSelected = formData.brokers.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBroker(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-white hover:bg-oat-50 text-charcoal-700 border-charcoal-200'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Core Pain Points Checklist */}
          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Identified Pain Points & Friction</span>
              <span className="text-emerald-700 font-normal">Select all that apply</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
              {PAIN_POINT_CATEGORIES.map(p => {
                const isSelected = formData.painPoints.includes(p.label);
                return (
                  <div
                    key={p.id}
                    onClick={() => togglePainPoint(p.label)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[#014828] bg-emerald-50/70 shadow-sm' 
                        : 'border-oat-300 bg-white hover:border-charcoal-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-charcoal-900">{p.label}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-[#014828] border-[#014828] text-white' : 'border-charcoal-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1 leading-snug">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Missing AI Insights & Diagnostics */}
          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              What AI Diagnostics Were Missing / Disappointing?
            </label>
            <textarea
              rows={2}
              value={formData.missingAiInsights}
              onChange={(e) => setFormData({ ...formData, missingAiInsights: e.target.value })}
              placeholder="e.g. User said 'It told me XYZ stock is weak, but didn't tell me what exact basket or stock to buy instead'..."
              className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-sm text-charcoal-800 focus:outline-none focus:border-forest-600"
            />
          </div>

          {/* 6. Feature Wishlist Voting */}
          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider mb-2">
              Features User Strongly Wants (Wishlist)
            </label>
            <div className="space-y-2">
              {FEATURE_WISHLIST.map(f => {
                const isSelected = formData.featureRequests.includes(f.label);
                return (
                  <div
                    key={f.id}
                    onClick={() => toggleFeature(f.label)}
                    className={`p-2.5 px-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm'
                        : 'bg-white hover:bg-oat-50 text-charcoal-800 border-charcoal-200'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold">{f.label}</span>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-charcoal-500'}`}>
                        {f.desc}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ml-3 ${
                      isSelected ? 'bg-white text-emerald-900 border-white' : 'border-charcoal-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7. Verbatim Feedback & Next Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Direct User Quote / Key Verbatim Takeaway
              </label>
              <textarea
                rows={3}
                value={formData.verbatimFeedback}
                onChange={(e) => setFormData({ ...formData, verbatimFeedback: e.target.value })}
                placeholder="Exact quotes from user during the interview..."
                className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-sm text-charcoal-800 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Action Items / Product Team Follow-Up
              </label>
              <textarea
                rows={3}
                value={formData.actionItems}
                onChange={(e) => setFormData({ ...formData, actionItems: e.target.value })}
                placeholder="e.g. Schedule design demo for new Rebalancer with Gaurav next Friday..."
                className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-sm text-charcoal-800 focus:outline-none focus:border-forest-600"
              />
            </div>
          </div>

        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-oat-300 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-[#014828] hover:bg-[#01381f] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save Feedback & Update Status'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
