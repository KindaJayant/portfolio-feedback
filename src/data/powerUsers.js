export const POWER_USERS = [
  {
    id: 'meyswp82pamlknsnyfr5b0br',
    name: 'Gaurav Agrawal',
    phone: '+91 7879213732',
    email: 'user@thefutureuniversity.in',
    tier: '3-Year Plan',
    totalEvents: 4820,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-emerald-700',
    tags: ['High Activity', 'AI Baskets User']
  },
  {
    id: 'clj9vve5f0345ia1jnjhtm6j1',
    name: 'Paresh Shah',
    phone: '+91 9227208522',
    email: 'user@thefutureuniversity.in',
    tier: 'Lifetime Plan',
    totalEvents: 4210,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-teal-700',
    tags: ['VIP Member', 'Frequent Reviewer']
  },
  {
    id: 'ywatdljiyhnqm5bkf0wpwv9f',
    name: 'Krishna Mohan M',
    phone: '+91 8501011155',
    email: 'user@thefutureuniversity.in',
    tier: '2-Year Plan',
    totalEvents: 3950,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-blue-700',
    tags: ['Multi-Broker', 'Daily Active']
  },
  {
    id: 'cmqxu58tw0osppc19mzjpxb24',
    name: 'Kaushal',
    phone: '+91 9998033883',
    email: '9998033883@superinvesting.ai',
    tier: 'Yearly Plan',
    totalEvents: 3640,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-indigo-700',
    tags: ['Stock Analyzer Power User']
  },
  {
    id: 'clufi4h8s0xcrpn1juzmmf3ib',
    name: 'Sanjay Pandey',
    phone: '+91 9165216701',
    email: 'user@thefutureuniversity.in',
    tier: 'Lifetime Plan',
    totalEvents: 3510,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-purple-700',
    tags: ['VIP Member', 'Long-term Investor']
  },
  {
    id: 'z4tm946zkczzg7ir98ljb0t2',
    name: 'Dinesh Bhardwaj',
    phone: '+91 9731436925',
    email: '9731436925@superinvesting.ai',
    tier: 'Yearly Plan',
    totalEvents: 3290,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-amber-700',
    tags: ['Watchlist Heavy', 'Portfolio Linked']
  },
  {
    id: 'cm7ps6gzg1unxpcg0f2mpbw46',
    name: 'Raviprasad BN',
    phone: '+91 9743657311',
    email: 'user@thefutureuniversity.in',
    tier: '2-Year Plan',
    totalEvents: 3120,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-rose-700',
    tags: ['Active Searcher']
  },
  {
    id: 'cmqxk0o9l0d04pcvz98ke7yvr',
    name: 'Prof RS Singh',
    phone: '+91 9450119379',
    email: '9450119379@superinvesting.ai',
    tier: '3-Year Plan',
    totalEvents: 2980,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-slate-700',
    tags: ['Academic / Fundamentalist']
  },
  {
    id: 'nsxrxx7menxppbmx1zsvthg6',
    name: 'Sovit Jain',
    phone: '+91 9049548729',
    email: 'sovitj15@gmail.com',
    tier: 'Lifetime Plan',
    totalEvents: 2840,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-cyan-700',
    tags: ['VIP Member', 'Swing Trader']
  },
  {
    id: 'mtsp9hwjufwzrbd3jxxv3fdc',
    name: 'Rahul Sharma',
    phone: '+91 8684995239',
    email: 'user@thefutureuniversity.in',
    tier: 'Monthly Plan',
    totalEvents: 2710,
    status: 'Pending',
    assignedTo: 'Unassigned',
    lastContacted: null,
    avatarColor: 'bg-green-800',
    tags: ['New High-Frequency User']
  }
];

export const PAIN_POINT_CATEGORIES = [
  { id: 'sync', label: 'Broker Sync & Connection', desc: 'Holdings not updating in real time, broker disconnects, Smallcase timeouts', color: 'border-rose-400 bg-rose-50 text-rose-800' },
  { id: 'assets', label: 'Missing Asset Classes', desc: 'Cannot consolidate Mutual Funds, SGBs, Gold, US Stocks, or F&O positions', color: 'border-amber-400 bg-amber-50 text-amber-800' },
  { id: 'action', label: 'Lack of Actionable Advice', desc: 'Tells user stock is weak, but does not recommend exact replacement baskets/stocks', color: 'border-orange-400 bg-orange-50 text-orange-800' },
  { id: 'xirr', label: 'Returns & XIRR Confusion', desc: 'Unclear absolute vs annualized returns, missing benchmark (Nifty 50/500) alpha comparison', color: 'border-blue-400 bg-blue-50 text-blue-800' },
  { id: 'generic_ai', label: 'Generic AI Diagnostics', desc: 'AI summary feels too generic or misses deep concentration and sector risk warnings', color: 'border-purple-400 bg-purple-50 text-purple-800' },
  { id: 'rebalance', label: 'Rebalancing Complexity', desc: 'Too manual to execute recommended trims and buys across multiple accounts', color: 'border-emerald-400 bg-emerald-50 text-emerald-800' },
  { id: 'tax', label: 'Tax Harvesting & Capital Gains', desc: 'Missing short-term vs long-term tax liability tracking and tax loss harvesting tools', color: 'border-slate-400 bg-slate-50 text-slate-800' },
];

export const FEATURE_WISHLIST = [
  { id: 'ai_rebalancer', label: '1-Click AI Portfolio Rebalancer', desc: 'Automatically matches weak holdings with high-scoring AI baskets for instant replacement', votes: 8 },
  { id: 'mf_consolidation', label: 'Mutual Funds & Multi-Broker Sync', desc: 'Consolidated view of Zerodha + Groww + MF Central in one unified dashboard', votes: 7 },
  { id: 'tax_harvesting', label: 'Real-Time Tax Loss Harvesting', desc: 'Live capital gains calculator with actionable loss-offsetting suggestions before March 31', votes: 6 },
  { id: 'risk_overlap', label: 'Sector & Concentration Overlap Matrix', desc: 'Identifies hidden overlapping stocks across your active mutual funds and direct equity', votes: 5 },
  { id: 'whatsapp_digest', label: 'Automated WhatsApp Health Digest', desc: 'Weekly portfolio checkup with top gainers, earnings alert, and risk warnings on WhatsApp', votes: 6 },
  { id: 'live_benchmark', label: 'Nifty 50 / Alpha Performance Curve', desc: 'Live XIRR benchmark graph showing if you are beating the index net of expenses', votes: 4 },
];

export const BROKERS = [
  'Zerodha (Kite)',
  'Groww',
  'AngelOne',
  'Upstox',
  'Dhan',
  'ICICI Direct',
  'HDFC Sky',
  'Kotak Securities',
  'Motilal Oswal',
  'Manual Entry / CAS Upload'
];
