import React, { useState } from 'react';
import { 
  Star, 
  Check, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { PAIN_POINT_CATEGORIES, FEATURE_WISHLIST, BROKERS } from '../data/powerUsers';
import confetti from 'canvas-confetti';

export default function PublicQuestionnaireView({ onSaveFeedback }) {
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    satisfactionScore: 4,
    frequency: 'Daily (Market hours)',
    brokers: [],
    painPoints: [],
    missingAiInsights: '',
    featureRequests: [],
    verbatimFeedback: '',
    mode: 'Self-Serve Public Form'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleBroker = (b) => {
    setFormData(prev => ({
      ...prev,
      brokers: prev.brokers.includes(b)
        ? prev.brokers.filter(item => item !== b)
        : [...prev.brokers, b]
    }));
  };

  const togglePainPoint = (p) => {
    setFormData(prev => ({
      ...prev,
      painPoints: prev.painPoints.includes(p)
        ? prev.painPoints.filter(item => item !== p)
        : [...prev.painPoints, p]
    }));
  };

  const toggleFeature = (f) => {
    setFormData(prev => ({
      ...prev,
      featureRequests: prev.featureRequests.includes(f)
        ? prev.featureRequests.filter(item => item !== f)
        : [...prev.featureRequests, f]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName) {
      alert('Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveFeedback({
        ...formData,
        submittedAt: new Date().toISOString()
      });

      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (err) {
      alert('Error submitting feedback: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal-900 font-sans">Thank You for Shaping SuperInvesting!</h2>
        <p className="text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
          Your feedback has been recorded directly with our product team. We are actively incorporating these improvements into the new Portfolio release.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              userName: '',
              userPhone: '',
              userEmail: '',
              satisfactionScore: 4,
              frequency: 'Daily (Market hours)',
              brokers: [],
              painPoints: [],
              missingAiInsights: '',
              featureRequests: [],
              verbatimFeedback: '',
              mode: 'Self-Serve Public Form'
            });
          }}
          className="px-5 py-2.5 bg-[#014828] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#01381f] transition-all"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
      
      {/* Questionnaire Header */}
      <div className="bg-[#012414] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#01381f] relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>SuperInvesting Product Research</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Help Us Build the Ultimate Portfolio Section</h1>
          <p className="text-xs sm:text-sm text-emerald-100/70 max-w-xl leading-relaxed">
            We are redesigning the Portfolio experience for serious investors. Tell us what frustrates you today and what features you need most. (Takes ~3 minutes)
          </p>
        </div>
      </div>

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-200 shadow-sm space-y-8">
        
        {/* Step 1: User Profile */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-charcoal-900 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">1</span>
            <span>Your Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-charcoal-600 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="e.g. Gaurav Agrawal"
                className="w-full bg-[#FAF8F5] border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-600 mb-1">Phone Number (Optional)</label>
              <input
                type="text"
                value={formData.userPhone}
                onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full bg-[#FAF8F5] border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-600 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                placeholder="you@email.com"
                className="w-full bg-[#FAF8F5] border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-charcoal-900 focus:outline-none focus:border-forest-600"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Satisfaction & Frequency */}
        <div className="space-y-4 pt-6 border-t border-charcoal-100">
          <h3 className="text-sm font-mono font-bold text-charcoal-900 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">2</span>
            <span>Current Experience</span>
          </h3>

          <div>
            <label className="block text-xs font-mono text-charcoal-600 mb-2">
              How would you rate the current Portfolio section? (1 = Frustrating, 5 = Exceptional)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setFormData({ ...formData, satisfactionScore: score })}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-1 transition-all ${
                    formData.satisfactionScore === score
                      ? 'bg-[#014828] text-white shadow-md scale-105 border border-emerald-500'
                      : 'bg-[#FAF8F5] hover:bg-oat-100 text-charcoal-700 border border-charcoal-200'
                  }`}
                >
                  <Star className={`w-4 h-4 ${formData.satisfactionScore >= score ? 'fill-amber-400 text-amber-400' : 'text-charcoal-300'}`} />
                  <span>{score}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-charcoal-600 mb-2">Which broker(s) do you use for investing?</label>
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
                        : 'bg-[#FAF8F5] hover:bg-oat-100 text-charcoal-700 border-charcoal-200'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Pain Points */}
        <div className="space-y-4 pt-6 border-t border-charcoal-100">
          <h3 className="text-sm font-mono font-bold text-charcoal-900 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">3</span>
            <span>What are your biggest pain points? (Select all that apply)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PAIN_POINT_CATEGORIES.map(p => {
              const isSelected = formData.painPoints.includes(p.label);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePainPoint(p.label)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#014828] bg-emerald-50/80 shadow-sm' 
                      : 'border-charcoal-200 bg-[#FAF8F5] hover:border-charcoal-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-charcoal-900">{p.label}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ml-2 ${
                      isSelected ? 'bg-[#014828] border-[#014828] text-white' : 'border-charcoal-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Missing Insights & Feature Wishlist */}
        <div className="space-y-4 pt-6 border-t border-charcoal-100">
          <h3 className="text-sm font-mono font-bold text-charcoal-900 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">4</span>
            <span>Feature Wishlist & AI Diagnostics</span>
          </h3>

          <div>
            <label className="block text-xs font-mono text-charcoal-600 mb-1">
              When you click "Analyse Portfolio with AI", what insight did you expect that is currently missing?
            </label>
            <textarea
              rows={2}
              value={formData.missingAiInsights}
              onChange={(e) => setFormData({ ...formData, missingAiInsights: e.target.value })}
              placeholder="e.g. Expected actionable rebalancing suggestions or deep sector overlap breakdown..."
              className="w-full bg-[#FAF8F5] border border-charcoal-200 rounded-xl p-3 text-sm text-charcoal-900 focus:outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-charcoal-600 mb-2">Which new features would deliver the highest value to you?</label>
            <div className="space-y-2">
              {FEATURE_WISHLIST.map(f => {
                const isSelected = formData.featureRequests.includes(f.label);
                return (
                  <div
                    key={f.id}
                    onClick={() => toggleFeature(f.label)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm'
                        : 'bg-[#FAF8F5] hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold">{f.label}</span>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-charcoal-500'}`}>{f.desc}</p>
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

          <div>
            <label className="block text-xs font-mono text-charcoal-600 mb-1">
              If you had a magic wand, what ONE thing would you change about SuperInvesting's Portfolio section?
            </label>
            <textarea
              rows={3}
              value={formData.verbatimFeedback}
              onChange={(e) => setFormData({ ...formData, verbatimFeedback: e.target.value })}
              placeholder="Your honest thoughts, ideas, or frustrations..."
              className="w-full bg-[#FAF8F5] border border-charcoal-200 rounded-xl p-3 text-sm text-charcoal-900 focus:outline-none focus:border-forest-600"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#014828] hover:bg-[#01381f] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting Feedback...' : 'Submit Portfolio Feedback'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
