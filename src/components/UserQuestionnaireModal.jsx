import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Star, 
  Check, 
  Trash2, 
  Sparkles,
  HelpCircle,
  Zap,
  Leaf,
  Layers,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { 
  COMMON_QUESTIONS, 
  HEAVY_USER_QUESTIONS, 
  LIGHT_USER_QUESTIONS 
} from '../data/questionnaireData';
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

  // Segment: default to 'heavy' for power users, but allows toggling to 'light'
  const [userType, setUserType] = useState(existingFeedback?.userType || 'heavy');
  const [satisfactionScore, setSatisfactionScore] = useState(existingFeedback?.satisfactionScore || 0);

  // Common answers state
  const [reviewFrequency, setReviewFrequency] = useState(existingFeedback?.reviewFrequency || '');
  const [currentTrackingTools, setCurrentTrackingTools] = useState(existingFeedback?.currentTrackingTools || []);
  const [customTrackingTools, setCustomTrackingTools] = useState(existingFeedback?.customTrackingTools || '');
  const [lastInvestmentDecision, setLastInvestmentDecision] = useState(existingFeedback?.lastInvestmentDecision || '');
  const [hardestPartManaging, setHardestPartManaging] = useState(existingFeedback?.hardestPartManaging || '');
  const [firstThingToKnow, setFirstThingToKnow] = useState(existingFeedback?.firstThingToKnow || '');
  const [pastRegretMistake, setPastRegretMistake] = useState(existingFeedback?.pastRegretMistake || '');

  // Heavy user answers state
  const [returnFrequencyTrigger, setReturnFrequencyTrigger] = useState(existingFeedback?.returnFrequencyTrigger || '');
  const [missingThing, setMissingThing] = useState(existingFeedback?.missingThing || '');
  const [whyExplanationImportance, setWhyExplanationImportance] = useState(existingFeedback?.whyExplanationImportance || '');
  const [aiRecommendationTrust, setAiRecommendationTrust] = useState(existingFeedback?.aiRecommendationTrust || '');
  const [rebalancingHandling, setRebalancingHandling] = useState(existingFeedback?.rebalancingHandling || '');
  const [desiredAlerts, setDesiredAlerts] = useState(existingFeedback?.desiredAlerts || []);
  const [customDesiredAlerts, setCustomDesiredAlerts] = useState(existingFeedback?.customDesiredAlerts || '');
  const [familyPortfolios, setFamilyPortfolios] = useState(existingFeedback?.familyPortfolios || '');
  const [mostAnnoyingThing, setMostAnnoyingThing] = useState(existingFeedback?.mostAnnoyingThing || '');
  const [toolSwitchingMoment, setToolSwitchingMoment] = useState(existingFeedback?.toolSwitchingMoment || '');

  // Light user answers state
  const [lightWhyNotUsed, setLightWhyNotUsed] = useState(existingFeedback?.lightWhyNotUsed || '');
  const [syncAttemptExperience, setSyncAttemptExperience] = useState(existingFeedback?.syncAttemptExperience || '');
  const [expectationVsReality, setExpectationVsReality] = useState(existingFeedback?.expectationVsReality || '');
  const [idealAiPicture, setIdealAiPicture] = useState(existingFeedback?.idealAiPicture || '');
  const [usefulInsightsElsewhere, setUsefulInsightsElsewhere] = useState(existingFeedback?.usefulInsightsElsewhere || '');
  const [preferWhatsappSummary, setPreferWhatsappSummary] = useState(existingFeedback?.preferWhatsappSummary || '');

  // General notes & status
  const [notes, setNotes] = useState(existingFeedback?.notes || '');
  const [markChecked, setMarkChecked] = useState(user.checked ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever selected user or existing feedback changes
  useEffect(() => {
    setUserType(existingFeedback?.userType || 'heavy');
    setSatisfactionScore(existingFeedback?.satisfactionScore || 0);

    // Common
    setReviewFrequency(existingFeedback?.reviewFrequency || '');
    setCurrentTrackingTools(existingFeedback?.currentTrackingTools || []);
    setCustomTrackingTools(existingFeedback?.customTrackingTools || '');
    setLastInvestmentDecision(existingFeedback?.lastInvestmentDecision || '');
    setHardestPartManaging(existingFeedback?.hardestPartManaging || '');
    setFirstThingToKnow(existingFeedback?.firstThingToKnow || '');
    setPastRegretMistake(existingFeedback?.pastRegretMistake || '');

    // Heavy
    setReturnFrequencyTrigger(existingFeedback?.returnFrequencyTrigger || '');
    setMissingThing(existingFeedback?.missingThing || '');
    setWhyExplanationImportance(existingFeedback?.whyExplanationImportance || '');
    setAiRecommendationTrust(existingFeedback?.aiRecommendationTrust || '');
    setRebalancingHandling(existingFeedback?.rebalancingHandling || '');
    setDesiredAlerts(existingFeedback?.desiredAlerts || []);
    setCustomDesiredAlerts(existingFeedback?.customDesiredAlerts || '');
    setFamilyPortfolios(existingFeedback?.familyPortfolios || '');
    setMostAnnoyingThing(existingFeedback?.mostAnnoyingThing || '');
    setToolSwitchingMoment(existingFeedback?.toolSwitchingMoment || '');

    // Light
    setLightWhyNotUsed(existingFeedback?.lightWhyNotUsed || '');
    setSyncAttemptExperience(existingFeedback?.syncAttemptExperience || '');
    setExpectationVsReality(existingFeedback?.expectationVsReality || '');
    setIdealAiPicture(existingFeedback?.idealAiPicture || '');
    setUsefulInsightsElsewhere(existingFeedback?.usefulInsightsElsewhere || '');
    setPreferWhatsappSummary(existingFeedback?.preferWhatsappSummary || '');

    setNotes(existingFeedback?.notes || '');
    setMarkChecked(user.checked ?? true);
  }, [user, existingFeedback]);

  const toggleArrayItem = (list, setList, item) => {
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
        userType,
        satisfactionScore,

        // Common
        reviewFrequency,
        currentTrackingTools,
        customTrackingTools,
        lastInvestmentDecision,
        hardestPartManaging,
        firstThingToKnow,
        pastRegretMistake,

        // Heavy
        returnFrequencyTrigger,
        missingThing,
        whyExplanationImportance,
        aiRecommendationTrust,
        rebalancingHandling,
        desiredAlerts,
        customDesiredAlerts,
        familyPortfolios,
        mostAnnoyingThing,
        toolSwitchingMoment,

        // Light
        lightWhyNotUsed,
        syncAttemptExperience,
        expectationVsReality,
        idealAiPicture,
        usefulInsightsElsewhere,
        preferWhatsappSummary,

        notes,
        isMarkedChecked: markChecked
      });

      if (markChecked !== user.checked) {
        onToggleChecked(user.id, markChecked);
      }

      confetti({
        particleCount: 65,
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
    `Hi ${user.name}, this is Jayant from SuperInvesting.ai. We're redesigning our Portfolio section and would love 5 minutes of your feedback. Are you free for a quick call?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-charcoal-200 max-w-4xl w-full overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#012414] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#01381f]">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-300 text-sm shrink-0">
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
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

          <div className="flex items-center space-x-2 self-end sm:self-center">
            {/* Direct Call Link */}
            {user.phone && (
              <a
                href={`tel:${cleanPhone}`}
                title="Call Directly"
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-emerald-300 rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            )}

            {/* Direct WhatsApp Link */}
            {user.phone && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open WhatsApp chat"
                className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            <button 
              onClick={onClose}
              className="text-emerald-200/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Persona Selector & Quick CSAT Banner */}
        <div className="bg-[#FAF8F5] px-6 py-3 border-b border-charcoal-200 flex flex-wrap items-center justify-between gap-3">
          
          {/* Persona Switch: Heavy vs Light User */}
          <div className="flex items-center space-x-1 bg-charcoal-200/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setUserType('heavy')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userType === 'heavy'
                  ? 'bg-[#014828] text-white shadow-xs'
                  : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Heavy User Set</span>
              <span className="text-[10px] opacity-80">(Power User)</span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('light')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userType === 'light'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-300" />
              <span>Light User Set</span>
              <span className="text-[10px] opacity-80">(Low Activity)</span>
            </button>
          </div>

          {/* Quick CSAT Rating */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-charcoal-700 uppercase">Portfolio Rating:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setSatisfactionScore(score)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                    satisfactionScore >= score
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-white text-charcoal-400 border border-charcoal-200 hover:bg-oat-100'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${satisfactionScore >= score ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* ========================================================= */}
          {/* SECTION 1: COMMON SET (ASKED TO BOTH SETS) */}
          {/* ========================================================= */}
          <div className="space-y-6">
            <div className="pb-2 border-b border-charcoal-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-charcoal-900 text-white font-mono font-bold text-xs">
                  PART 1
                </span>
                <h3 className="text-sm font-black text-charcoal-900 uppercase tracking-wider">
                  Common Set (Ask to both sets)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-charcoal-500">6 Core Questions</span>
            </div>

            {/* Q1: Review Frequency */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-charcoal-200 space-y-2">
              <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                1. How often do you review or think about your portfolio — daily, weekly, monthly?
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Daily / Multiple times a day', 'Weekly', 'Bi-weekly / Monthly', 'Rarely / Market volatility only'].map(freq => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setReviewFrequency(freq)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      reviewFrequency === freq
                        ? 'bg-[#014828] text-white border-emerald-900 shadow-xs'
                        : 'bg-white hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={reviewFrequency}
                onChange={(e) => setReviewFrequency(e.target.value)}
                placeholder="Or type specific frequency details..."
                className="w-full mt-1.5 bg-white border border-charcoal-200 rounded-lg px-3 py-1.5 text-xs text-charcoal-800 focus:outline-none focus:border-forest-600"
              />
            </div>

            {/* Q2: Current Tracking Tools */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-charcoal-200 space-y-2">
              <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                2. What tools, apps, or spreadsheets do you currently use to track and analyse your portfolio?
                <span className="block text-[11px] font-normal text-charcoal-500 mt-0.5">
                  Or basically how do you track and analyse your portfolio as of now / before SuperInvesting?
                </span>
              </label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Excel / Google Sheets', 'Zerodha Console / Kite', 'Groww', 'Tickertape', 'Moneycontrol', 'Trendlyne', 'Value Research', 'Dhan / AngelOne'].map(tool => {
                  const isSelected = currentTrackingTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleArrayItem(currentTrackingTools, setCurrentTrackingTools, tool)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-blue-800 text-white border-blue-900 shadow-xs'
                          : 'bg-white hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                      }`}
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={customTrackingTools}
                onChange={(e) => setCustomTrackingTools(e.target.value)}
                placeholder="Other tools, proprietary sheets, or tracking methods..."
                className="w-full mt-1.5 bg-white border border-charcoal-200 rounded-lg px-3 py-1.5 text-xs text-charcoal-800 focus:outline-none focus:border-forest-600"
              />
            </div>

            {/* Q3: Last Investment Decision */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                3. Walk me through the last investment decision you made — buying or selling a stock.
                <span className="block text-[11px] font-normal text-charcoal-500 mt-0.5">
                  What triggered it? What information did you look at before deciding?
                </span>
              </label>
              <textarea
                rows={2}
                value={lastInvestmentDecision}
                onChange={(e) => setLastInvestmentDecision(e.target.value)}
                placeholder="Trigger (e.g. quarterly results, price dip, rebalancing, tip) and what metrics/news they checked..."
                className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-forest-600"
              />
            </div>

            {/* Q4: Hardest Part Managing Today */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                4. What's the hardest part about managing your portfolio today?
              </label>
              <textarea
                rows={2}
                value={hardestPartManaging}
                onChange={(e) => setHardestPartManaging(e.target.value)}
                placeholder="e.g. Knowing when to sell/cut losses, calculating true returns across brokers, avoiding overlap..."
                className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-forest-600"
              />
            </div>

            {/* Q5: First Thing Want to Know */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                5. When you look at your portfolio, what's the first thing you want to know?
              </label>
              <textarea
                rows={2}
                value={firstThingToKnow}
                onChange={(e) => setFirstThingToKnow(e.target.value)}
                placeholder="e.g. Am I beating Nifty? Which stocks are underperforming? Is my money safe from market crash?..."
                className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-forest-600"
              />
            </div>

            {/* Q6: Past Portfolio Mistake */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                6. Have you ever made a portfolio mistake you regretted? What happened, and what information could have prevented it?
              </label>
              <textarea
                rows={2}
                value={pastRegretMistake}
                onChange={(e) => setPastRegretMistake(e.target.value)}
                placeholder="e.g. Held a falling stock for 2 years hoping it will bounce; if SIA showed promoter selling or debt deterioration early..."
                className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-forest-600"
              />
            </div>

          </div>

          {/* ========================================================= */}
          {/* SECTION 2A: HEAVY USERS ONLY (ACTIVE IF USERTYPE === 'heavy') */}
          {/* ========================================================= */}
          {userType === 'heavy' && (
            <div className="space-y-6 pt-6 border-t-2 border-emerald-800/30">
              
              <div className="pb-2 border-b border-charcoal-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-800 text-white font-mono font-bold text-xs flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-amber-300" />
                    <span>PART 2</span>
                  </span>
                  <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                    Heavy Users Only Set
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 font-bold">9 Deep-Dive Questions</span>
              </div>

              {/* H1: Return Frequency Trigger */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  1. How often do you come back to the portfolio analysis screen? What triggers you to open it?
                </label>
                <textarea
                  rows={2}
                  value={returnFrequencyTrigger}
                  onChange={(e) => setReturnFrequencyTrigger(e.target.value)}
                  placeholder="e.g. Every market close, after reading market news, or before putting fresh capital..."
                  className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-forest-600"
                />
              </div>

              {/* H2: One Missing Thing */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  2. What's the one thing you wish the portfolio analysis showed you that it currently doesn't?
                </label>
                <textarea
                  rows={2}
                  value={missingThing}
                  onChange={(e) => setMissingThing(e.target.value)}
                  placeholder="e.g. Clear buy/sell replacement suggestions, Mutual Funds tracking, tax calculation..."
                  className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-forest-600"
                />
              </div>

              {/* H3: Importance of "Why" */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-charcoal-200 space-y-2">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  3. How important is it for you to understand the "why" behind a recommendation? Do you want a short verdict or a detailed rationale with data?
                </label>
                <div className="space-y-1.5 pt-1">
                  {[
                    'Short verdict is enough (Action-oriented)',
                    'Detailed rationale with complete data (Need full proof)',
                    'Both: 1-line verdict upfront + expandable deep-dive breakdown'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWhyExplanationImportance(opt)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                        whyExplanationImportance === opt
                          ? 'bg-[#014828] text-white border-emerald-900 shadow-xs'
                          : 'bg-white hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {whyExplanationImportance === opt && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* H4: Trust in AI Sell X Buy Y */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-charcoal-200 space-y-2">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  4. If our AI told you "Sell Stock X and Buy Stock Y" — would that be helpful? Would you trust the recommendation directly or will you need the detailed analysis behind recommendation?
                </label>
                <div className="space-y-1.5 pt-1">
                  {[
                    'Extremely helpful — would trust directly if past track record is strong',
                    'Helpful, but I must see the detailed thesis & comparative data before executing',
                    'Would only take it as an idea and do my own manual research'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAiRecommendationTrust(opt)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                        aiRecommendationTrust === opt
                          ? 'bg-[#014828] text-white border-emerald-900 shadow-xs'
                          : 'bg-white hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {aiRecommendationTrust === opt && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* H5: Rebalancing Handling */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-charcoal-200 space-y-2">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  5. How do you currently handle rebalancing? Is it something you do actively? Would you want AI to tell you when and how to rebalance?
                </label>
                <div className="space-y-1.5 pt-1">
                  {[
                    'I do it actively (quarterly/annually based on allocation)',
                    'Rarely / Never rebalance currently (too tedious)',
                    'Yes, strongly want AI to alert me when and give exact step-by-step rebalancing'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRebalancingHandling(opt)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                        rebalancingHandling === opt
                          ? 'bg-[#014828] text-white border-emerald-900 shadow-xs'
                          : 'bg-white hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {rebalancingHandling === opt && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* H6: Desired Alerts */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-charcoal-200 space-y-2">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  6. What kind of alerts would you want?
                  <span className="block text-[11px] font-normal text-charcoal-500 mt-0.5">
                    Important news regarding your stock? Valuation dropping / increasing? Or something else?
                  </span>
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Breaking news on holdings',
                    'Valuation drop / surge triggers',
                    'Earnings scorecard & guidance warnings',
                    'Overconcentration / Sector risk alert',
                    'Trim / Exit target reached'
                  ].map(alertType => {
                    const isSelected = desiredAlerts.includes(alertType);
                    return (
                      <button
                        key={alertType}
                        type="button"
                        onClick={() => toggleArrayItem(desiredAlerts, setDesiredAlerts, alertType)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                            : 'bg-white hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                        }`}
                      >
                        {alertType}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={customDesiredAlerts}
                  onChange={(e) => setCustomDesiredAlerts(e.target.value)}
                  placeholder="Other specific alert triggers..."
                  className="w-full mt-1.5 bg-white border border-charcoal-200 rounded-lg px-3 py-1.5 text-xs text-charcoal-800 focus:outline-none focus:border-forest-600"
                />
              </div>

              {/* H7: Family Portfolios */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-charcoal-200 space-y-2">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  7. Do you manage portfolios for family members as well? Would multi-portfolio support matter to you?
                </label>
                <div className="space-y-1.5 pt-1">
                  {[
                    'Yes, manage for family (Multi-portfolio is high priority)',
                    'Only manage my own personal portfolio',
                    'Manage for friends / informal clients'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFamilyPortfolios(opt)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                        familyPortfolios === opt
                          ? 'bg-[#014828] text-white border-emerald-900 shadow-xs'
                          : 'bg-white hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {familyPortfolios === opt && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* H8: Most Annoying Thing */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-rose-950 leading-snug flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>8. What's the most annoying thing about the current portfolio feature? Something that makes you think "why can't they just fix this?"</span>
                </label>
                <textarea
                  rows={2}
                  value={mostAnnoyingThing}
                  onChange={(e) => setMostAnnoyingThing(e.target.value)}
                  placeholder="e.g. Holdings take hours to sync, XIRR doesn't match broker, generic commentary..."
                  className="w-full bg-white border border-rose-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* H9: Tool Switching Moment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  9. Is there a moment where you leave our app and go to another tool to get something our portfolio analysis doesn't provide? What is it?
                </label>
                <textarea
                  rows={2}
                  value={toolSwitchingMoment}
                  onChange={(e) => setToolSwitchingMoment(e.target.value)}
                  placeholder="e.g. Go to Screener for 10-year financials, Tickertape for peer charts, Excel for taxation..."
                  className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-forest-600"
                />
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 2B: LIGHT USERS ONLY (ACTIVE IF USERTYPE === 'light') */}
          {/* ========================================================= */}
          {userType === 'light' && (
            <div className="space-y-6 pt-6 border-t-2 border-blue-800/30">
              
              <div className="pb-2 border-b border-charcoal-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-blue-800 text-white font-mono font-bold text-xs flex items-center space-x-1">
                    <Leaf className="w-3 h-3 text-emerald-300" />
                    <span>PART 2</span>
                  </span>
                  <h3 className="text-sm font-black text-blue-950 uppercase tracking-wider">
                    Light Users Only Set
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-blue-800 font-bold">6 Discovery Questions</span>
              </div>

              {/* L1: Why Not Used Much */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  1. You signed up for SuperInvestingAI but haven't used the portfolio analysis much. Can you tell me why?
                  <span className="block text-[11px] font-normal text-charcoal-500 mt-0.5">
                    (Let them talk freely — don't lead.)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={lightWhyNotUsed}
                  onChange={(e) => setLightWhyNotUsed(e.target.value)}
                  placeholder="Record user's spontaneous explanation without prompting..."
                  className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* L2: Sync Attempt */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-charcoal-200 space-y-2">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  2. Did you try syncing your portfolio at any point? If yes, what happened? If no, what stopped you?
                </label>
                <div className="space-y-1.5 pt-1">
                  {[
                    'Tried syncing — failed / showed error / broker timeout',
                    'Did not sync — privacy / security hesitation about connecting broker',
                    'Did not sync — didn\'t notice feature / too lazy / busy',
                    'Synced once, but never checked back'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSyncAttemptExperience(opt)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                        syncAttemptExperience === opt
                          ? 'bg-blue-800 text-white border-blue-900 shadow-xs'
                          : 'bg-white hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {syncAttemptExperience === opt && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* L3: Expectation vs Reality */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  3. What were you expecting the feature to do when you first heard about it? Did reality match the expectation?
                  <span className="block text-[11px] font-normal text-charcoal-500 mt-0.5">
                    (If synced at least once)
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={expectationVsReality}
                  onChange={(e) => setExpectationVsReality(e.target.value)}
                  placeholder="e.g. Expected automatic trading, expected hedge-fund style risk metrics, reality felt too basic..."
                  className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* L4: Ideal AI Picture */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  4. When you think of "AI analysing your portfolio" — what do you imagine it should do? Paint me the ideal picture.
                </label>
                <textarea
                  rows={2}
                  value={idealAiPicture}
                  onChange={(e) => setIdealAiPicture(e.target.value)}
                  placeholder="Their ideal vision: 'Like a private wealth manager who warns me in advance when...'"
                  className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* L5: Useful Insights Elsewhere */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  5. Have you gotten portfolio insights from anywhere else that you found genuinely useful? From where, what was it, and what made it good?
                </label>
                <textarea
                  rows={2}
                  value={usefulInsightsElsewhere}
                  onChange={(e) => setUsefulInsightsElsewhere(e.target.value)}
                  placeholder="e.g. Morningstar X-Ray report, Zerodha Coin statement, specific advisor/CA advice..."
                  className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* L6: Prefer WhatsApp Summary */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-charcoal-200 space-y-2">
                <label className="block text-xs font-bold text-charcoal-900 leading-snug">
                  6. Would you prefer a WhatsApp summary of your portfolio analysis rather than opening the app?
                </label>
                <div className="space-y-1.5 pt-1">
                  {[
                    'Yes, strongly prefer weekly WhatsApp summary over opening app',
                    'Prefer opening app for interactive drill-down',
                    'Both: WhatsApp alert with 1-click link into the app'
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPreferWhatsappSummary(opt)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                        preferWhatsappSummary === opt
                          ? 'bg-blue-800 text-white border-blue-900 shadow-xs'
                          : 'bg-white hover:bg-oat-100 text-charcoal-800 border-charcoal-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {preferWhatsappSummary === opt && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 3: GENERAL NOTES & CALL SUMMARY */}
          {/* ========================================================= */}
          <div className="space-y-2 pt-4 border-t border-charcoal-200">
            <label className="block text-xs font-mono font-bold text-charcoal-800 uppercase tracking-wider">
              General Call Notes & Verbatim Quotes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional call context, specific stock tickers mentioned, follow-up requests..."
              className="w-full bg-white border border-charcoal-200 rounded-xl p-3 text-xs text-charcoal-900 focus:outline-none focus:border-forest-600 font-sans"
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
            <span className="text-[11px] font-mono text-emerald-800 font-semibold">
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
