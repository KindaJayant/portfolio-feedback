import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Star, 
  Check, 
  Trash2, 
  Sparkles,
  AlertCircle,
  Lightbulb,
  Building2,
  FileText
} from 'lucide-react';
import { PAIN_POINTS_LIST, IMPROVEMENTS_LIST, BROKERS_LIST } from '../data/powerUsers';
import confetti from 'canvas-confetti';

export default function UserQuestionnaireModal({
  isOpen,
  onClose,
  user,
  existingFeedback,
  onSaveFeedback,
  onDeleteFeedback,
  onToggleChecked
}) {
  if (!isOpen || !user) return null;

  const [satisfactionScore, setSatisfactionScore] = useState(existingFeedback?.satisfactionScore || 0);
  const [selectedPainPoints, setSelectedPainPoints] = useState(existingFeedback?.painPoints || []);
  const [customPainPoint, setCustomPainPoint] = useState(existingFeedback?.customPainPoint || '');
  const [selectedImprovements, setSelectedImprovements] = useState(existingFeedback?.improvements || []);
  const [customImprovement, setCustomImprovement] = useState(existingFeedback?.customImprovement || '');
  const [selectedBrokers, setSelectedBrokers] = useState(existingFeedback?.brokers || []);
  const [notes, setNotes] = useState(existingFeedback?.notes || '');
  const [markChecked, setMarkChecked] = useState(user.checked ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever the selected user or their existing feedback changes
  useEffect(() => {
    setSatisfactionScore(existingFeedback?.satisfactionScore || 0);
    setSelectedPainPoints(existingFeedback?.painPoints || []);
    setCustomPainPoint(existingFeedback?.customPainPoint || '');
    setSelectedImprovements(existingFeedback?.improvements || []);
    setCustomImprovement(existingFeedback?.customImprovement || '');
    setSelectedBrokers(existingFeedback?.brokers || []);
    setNotes(existingFeedback?.notes || '');
    setMarkChecked(user.checked ?? true);
  }, [user, existingFeedback]);

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSaveFeedback({
        id: existingFeedback?.id,
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        userEmail: user.email,
        satisfactionScore,
        painPoints: selectedPainPoints,
        customPainPoint,
        improvements: selectedImprovements,
        customImprovement,
        brokers: selectedBrokers,
        notes,
        isMarkedChecked: markChecked
      });

      if (markChecked !== user.checked) {
        onToggleChecked(user.id, markChecked);
      }

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      onClose();
    } catch (err) {
      alert('Error saving feedback: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi ${user.name}, this is Jayant from SuperInvesting.ai Product Team. We noticed you're one of our top active members on the platform. We are redesigning the Portfolio section and would love 5 minutes of your feedback to build what you need. Are you free for a quick call?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-charcoal-200 max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#012414] text-white flex items-center justify-between border-b border-[#01381f]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-300 text-sm">
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  user.checked 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                    : 'bg-white/10 text-white/70'
                }`}>
                  {user.checked ? '✓ Checked' : 'Pending'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/70 font-mono">{user.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Direct Call Link */}
            {user.phone && (
              <a
                href={`tel:${cleanPhone}`}
                title="Call Directly"
                className="p-2 bg-white/10 hover:bg-white/20 text-emerald-300 rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call</span>
              </a>
            )}

            {/* Direct WhatsApp Link */}
            {user.phone && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open WhatsApp chat"
                className="p-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}

            <button 
              onClick={onClose}
              className="text-emerald-200/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Question 1: Overall Satisfaction */}
          <div className="bg-[#FAF8F5] p-4.5 rounded-xl border border-charcoal-200">
            <label className="block text-xs font-mono font-bold text-charcoal-700 uppercase tracking-wider mb-2">
              1. Overall Portfolio Section Satisfaction (1 to 5 Stars)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setSatisfactionScore(score)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-1.5 transition-all ${
                    satisfactionScore === score
                      ? 'bg-[#014828] text-white shadow-md scale-105 border border-emerald-500'
                      : 'bg-white hover:bg-oat-100 text-charcoal-700 border border-charcoal-200'
                  }`}
                >
                  <Star className={`w-4 h-4 ${satisfactionScore >= score ? 'fill-amber-400 text-amber-400' : 'text-charcoal-300'}`} />
                  <span>{score}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[11px] font-mono text-charcoal-500 mt-2 px-1">
              <span>1 - Frustrating / Broken</span>
              <span>3 - Average / OK</span>
              <span>5 - Exceptional</span>
            </div>
          </div>

          {/* Question 2: Pain Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-charcoal-800 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>2. What pain points do they face in the Portfolio section?</span>
              </label>
              <span className="text-[11px] font-mono text-charcoal-500">Select all that apply</span>
            </div>

            <div className="space-y-2">
              {PAIN_POINTS_LIST.map((painPoint, index) => {
                const isSelected = selectedPainPoints.includes(painPoint);
                return (
                  <div
                    key={index}
                    onClick={() => toggleItem(selectedPainPoints, setSelectedPainPoints, painPoint)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-rose-300 bg-rose-50/70 text-rose-950 shadow-sm'
                        : 'border-charcoal-200 bg-white hover:border-charcoal-300 text-charcoal-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-charcoal-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-medium">{painPoint}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5">
              <input
                type="text"
                value={customPainPoint}
                onChange={(e) => setCustomPainPoint(e.target.value)}
                placeholder="Other specific pain points or complaints mentioned by user..."
                className="w-full bg-white border border-charcoal-200 rounded-lg px-3 py-2 text-xs font-medium text-charcoal-800 focus:outline-none focus:border-forest-600"
              />
            </div>
          </div>

          {/* Question 3: Improvements / Wishlist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-charcoal-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>3. How can we improve it? (Feature Wishlist)</span>
              </label>
              <span className="text-[11px] font-mono text-charcoal-500">Select all that apply</span>
            </div>

            <div className="space-y-2">
              {IMPROVEMENTS_LIST.map((improvement, index) => {
                const isSelected = selectedImprovements.includes(improvement);
                return (
                  <div
                    key={index}
                    onClick={() => toggleItem(selectedImprovements, setSelectedImprovements, improvement)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 shadow-sm'
                        : 'border-charcoal-200 bg-white hover:border-charcoal-300 text-charcoal-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        isSelected ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-charcoal-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-medium">{improvement}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5">
              <input
                type="text"
                value={customImprovement}
                onChange={(e) => setCustomImprovement(e.target.value)}
                placeholder="Other feature requests or suggestions from user..."
                className="w-full bg-white border border-charcoal-200 rounded-lg px-3 py-2 text-xs font-medium text-charcoal-800 focus:outline-none focus:border-forest-600"
              />
            </div>
          </div>

          {/* Question 4: Primary Brokers Used */}
          <div>
            <label className="text-xs font-mono font-bold text-charcoal-800 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>4. Which broker(s) do they currently use?</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {BROKERS_LIST.map(broker => {
                const isSelected = selectedBrokers.includes(broker);
                return (
                  <button
                    key={broker}
                    type="button"
                    onClick={() => toggleItem(selectedBrokers, setSelectedBrokers, broker)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                        : 'bg-white hover:bg-oat-50 text-charcoal-700 border-charcoal-200'
                    }`}
                  >
                    {broker}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 5: Verbatim User Notes */}
          <div>
            <label className="text-xs font-mono font-bold text-charcoal-800 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>5. Call Notes & Verbatim Quotes</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record exact comments, verbatim quotes, specific stocks they were having issues with, or team action items..."
              className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-forest-600 leading-relaxed font-sans"
            />
          </div>

          {/* Tracking Checkbox */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={markChecked}
                onChange={(e) => setMarkChecked(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-950">
                Mark {user.name} as Checked / Completed
              </span>
            </label>
            <span className="text-[11px] font-mono text-emerald-800">
              Updates team progress
            </span>
          </div>

        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 bg-[#FAF8F5] border-t border-charcoal-200 flex items-center justify-between">
          <div>
            {existingFeedback && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete recorded feedback for this user?')) {
                    onDeleteFeedback(existingFeedback.id);
                    onClose();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Feedback</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-oat-100 text-charcoal-700 rounded-lg text-xs font-semibold border border-charcoal-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#014828] hover:bg-[#01381f] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Feedback'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
