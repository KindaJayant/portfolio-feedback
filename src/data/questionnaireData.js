// Questionnaire definitions for SuperInvesting.ai Portfolio User Research

export const COMMON_QUESTIONS = [
  {
    id: 'reviewFrequency',
    label: 'How often do you review or think about your portfolio?',
    sublabel: 'Daily, weekly, monthly?',
    options: ['Daily / Multiple times a day', 'Weekly', 'Bi-weekly / Monthly', 'Only during market volatility / quarterly']
  },
  {
    id: 'currentTrackingTools',
    label: 'What tools, apps, or spreadsheets do you currently use to track and analyse your portfolio?',
    sublabel: 'How do you track and analyse your portfolio as of now / before SuperInvesting?',
    options: ['Excel / Google Sheets', 'Zerodha Console / Kite', 'Groww', 'Tickertape', 'Moneycontrol', 'Trendlyne', 'Value Research']
  },
  {
    id: 'lastInvestmentDecision',
    label: 'Walk me through the last investment decision you made — buying or selling a stock.',
    sublabel: 'What triggered it? What information did you look at before deciding?',
    placeholder: 'Trigger (e.g., quarterly earnings, social media tip, valuation drop) & information checked...'
  },
  {
    id: 'hardestPartManaging',
    label: "What's the hardest part about managing your portfolio today?",
    placeholder: 'e.g., Knowing when to exit losers, tracking capital gains tax, rebalancing across accounts...'
  },
  {
    id: 'firstThingToKnow',
    label: "When you look at your portfolio, what's the first thing you want to know?",
    placeholder: 'e.g., Today\'s P&L, are my stocks beating Nifty, which stock is dragging me down, upcoming risks...'
  },
  {
    id: 'pastRegretMistake',
    label: 'Have you ever made a portfolio mistake you regretted? What happened, and what information could have prevented it?',
    placeholder: 'e.g., Held onto a falling stock too long, missed quarterly warning signs, overconcentrated in one sector...'
  }
];

export const HEAVY_USER_QUESTIONS = [
  {
    id: 'returnFrequencyTrigger',
    label: 'How often do you come back to the portfolio analysis screen? What triggers you to open it?',
    placeholder: 'e.g., After market close, when receiving an email/WA alert, or on weekends to plan trades...'
  },
  {
    id: 'missingThing',
    label: "What's the one thing you wish the portfolio analysis showed you that it currently doesn't?",
    placeholder: 'e.g., Exact replacement recommendations, sector overlap matrix, tax loss harvesting calculation...'
  },
  {
    id: 'whyExplanationImportance',
    label: 'How important is it for you to understand the "why" behind a recommendation? Do you want a short verdict or a detailed rationale with data?',
    options: ['Short verdict is enough (Action-oriented)', 'Detailed rationale with complete data (Need full proof)', 'Both: 1-line verdict upfront + expandable deep dive']
  },
  {
    id: 'aiRecommendationTrust',
    label: 'If our AI told you "Sell Stock X and Buy Stock Y" — would that be helpful? Would you trust it directly or need the detailed analysis behind it?',
    options: ['Would trust directly if track record is good', 'Need detailed analysis & thesis before executing', 'Would use only as an idea to do my own research']
  },
  {
    id: 'rebalancingHandling',
    label: 'How do you currently handle rebalancing? Is it something you do actively? Would you want AI to tell you when and how to rebalance?',
    options: ['I do it actively (quarterly/annually)', 'Rarely / Never rebalance currently', 'Yes, strongly want AI to tell me when & exact steps to rebalance']
  },
  {
    id: 'desiredAlerts',
    label: 'What kind of alerts would you want?',
    sublabel: 'Important news regarding your stock? Valuation dropping / increasing? Or something else?',
    options: ['Breaking news & earnings alerts on holdings', 'Valuation / target price triggers', 'Fundamental breakdown warnings', 'Rebalancing & trim alerts']
  },
  {
    id: 'familyPortfolios',
    label: 'Do you manage portfolios for family members as well? Would multi-portfolio support matter to you?',
    options: ['Yes, manage for family (Multi-portfolio is critical)', 'Only manage my own portfolio', 'Manage for friends/clients']
  },
  {
    id: 'mostAnnoyingThing',
    label: 'What\'s the most annoying thing about the current portfolio feature? Something that makes you think "why can\'t they just fix this?"',
    placeholder: 'e.g., Sync delay, missing MF tracking, unclear metrics, confusing XIRR calculation...'
  },
  {
    id: 'toolSwitchingMoment',
    label: 'Is there a moment where you leave our app and go to another tool to get something our portfolio analysis doesn\'t provide? What is it?',
    placeholder: 'e.g., Go to Tickertape for peer comparison, Screener for historical ratios, Excel for tax...'
  }
];

export const LIGHT_USER_QUESTIONS = [
  {
    id: 'lightWhyNotUsed',
    label: "You signed up for SuperInvestingAI but haven't used the portfolio analysis much. Can you tell me why?",
    sublabel: '(Let them talk freely — do not lead.)',
    placeholder: 'e.g., Didn\'t know it existed, security/privacy doubts syncing broker, found it overwhelming...'
  },
  {
    id: 'syncAttemptExperience',
    label: 'Did you try syncing your portfolio at any point? If yes, what happened? If no, what stopped you?',
    options: ['Tried syncing — failed / showed error', 'Did not sync — privacy / security hesitation', 'Did not sync — did not see the option / too lazy', 'Manually entered holdings']
  },
  {
    id: 'expectationVsReality',
    label: 'What were you expecting the feature to do when you first heard about it? Did reality match the expectation?',
    sublabel: '(If synced at least once)',
    placeholder: 'e.g., Expected automated rebalancing, thought it was an automated trader, expected mutual fund analysis...'
  },
  {
    id: 'idealAiPicture',
    label: 'When you think of "AI analysing your portfolio" — what do you imagine it should do? Paint me the ideal picture.',
    placeholder: 'Ideal vision of AI portfolio management...'
  },
  {
    id: 'usefulInsightsElsewhere',
    label: 'Have you gotten portfolio insights from anywhere else that you found genuinely useful? From where, what was it, and what made it good?',
    placeholder: 'e.g., Morningstar X-Ray, Zerodha Coin report, a specific newsletter / advisor...'
  },
  {
    id: 'preferWhatsappSummary',
    label: 'Would you prefer a WhatsApp summary of your portfolio analysis rather than opening the app?',
    options: ['Yes, prefer weekly WhatsApp digest over app', 'Prefer opening the app for deep dive', 'Both: WhatsApp summary + link to app for action']
  }
];
