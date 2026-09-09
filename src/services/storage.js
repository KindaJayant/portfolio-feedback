import { POWER_USERS } from '../data/powerUsers';

const STORAGE_KEY_USERS = 'superinvesting_power_users_v2';
const STORAGE_KEY_FEEDBACK = 'superinvesting_portfolio_feedback_v2';
const STORAGE_KEY_SETTINGS = 'superinvesting_storage_settings_v2';

// 1. Load users from localStorage (or fallback to the 10 real power users)
export function getStoredUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(POWER_USERS));
      return POWER_USERS;
    }
    const parsed = JSON.parse(data);
    // Ensure all 10 power users exist and retain their phone numbers & checked state
    const merged = POWER_USERS.map(defaultUser => {
      const existing = parsed.find(p => p.id === defaultUser.id || p.phone === defaultUser.phone);
      return existing ? { ...defaultUser, ...existing } : defaultUser;
    });
    return merged;
  } catch (err) {
    console.error('Failed to load users from localStorage:', err);
    return POWER_USERS;
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage:', err);
  }
}

export function toggleUserChecked(userId) {
  const users = getStoredUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, checked: !u.checked };
    }
    return u;
  });
  saveUsers(updated);
  return updated;
}

export function setUserChecked(userId, checked) {
  const users = getStoredUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return { ...u, checked: Boolean(checked) };
    }
    return u;
  });
  saveUsers(updated);
  return updated;
}

// 2. Feedback entries management (STRICTLY REAL DATA, ZERO DUMMY DATA)
export function getAllFeedback() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_FEEDBACK);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to get feedback from localStorage:', err);
    return [];
  }
}

export function getFeedbackForUser(userId) {
  const feedbackList = getAllFeedback();
  return feedbackList.find(f => f.userId === userId) || null;
}

export async function saveFeedback(feedbackEntry) {
  try {
    const existing = getAllFeedback();
    
    // Check if an entry for this user already exists
    const existingIndex = existing.findIndex(f => (feedbackEntry.userId && f.userId === feedbackEntry.userId) || f.id === feedbackEntry.id);
    
    const entryToSave = {
      id: feedbackEntry.id || `fb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: feedbackEntry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...feedbackEntry
    };

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...existing];
      updatedList[existingIndex] = entryToSave;
    } else {
      updatedList = [entryToSave, ...existing];
    }

    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updatedList));

    // Automatically mark the user as checked
    if (entryToSave.userId) {
      setUserChecked(entryToSave.userId, true);
    }

    // Sync to remote webhook if configured
    syncToRemoteWebhook(entryToSave).catch(console.warn);

    return entryToSave;
  } catch (err) {
    console.error('Failed to save feedback:', err);
    throw err;
  }
}

export function deleteFeedback(id) {
  try {
    const existing = getAllFeedback();
    const entryToDelete = existing.find(f => f.id === id);
    const updated = existing.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));

    // If entry had a userId, uncheck if no other feedback exists
    if (entryToDelete && entryToDelete.userId) {
      const stillHasFeedback = updated.some(f => f.userId === entryToDelete.userId);
      if (!stillHasFeedback) {
        setUserChecked(entryToDelete.userId, false);
      }
    }

    return updated;
  } catch (err) {
    console.error('Failed to delete feedback:', err);
    return [];
  }
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEY_USERS);
  localStorage.removeItem(STORAGE_KEY_FEEDBACK);
  // Re-seed clean power users with checked = false
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(POWER_USERS));
}

// 3. Settings & Webhooks
export function getStorageSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    const defaults = {
      googleSheetsWebhook: import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK || '',
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    };
    if (!data) return defaults;
    return { ...defaults, ...JSON.parse(data) };
  } catch (err) {
    return {
      googleSheetsWebhook: '',
      supabaseUrl: '',
      supabaseAnonKey: ''
    };
  }
}

export function saveStorageSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

async function syncToRemoteWebhook(entry) {
  const settings = getStorageSettings();
  
  if (settings.googleSheetsWebhook) {
    try {
      await fetch(settings.googleSheetsWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(entry)
      });
      console.log('✅ Synchronized feedback to Google Sheets Webhook');
    } catch (e) {
      console.warn('⚠️ Webhook sync failed:', e.message);
    }
  }

  if (settings.supabaseUrl && settings.supabaseAnonKey) {
    try {
      const url = `${settings.supabaseUrl.replace(/\/$/, '')}/rest/v1/portfolio_feedback`;
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': settings.supabaseAnonKey,
          'Authorization': `Bearer ${settings.supabaseAnonKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(entry)
      });
      console.log('✅ Synchronized feedback to Supabase table');
    } catch (e) {
      console.warn('⚠️ Supabase sync failed:', e.message);
    }
  }
}

// 4. Export CSV with the exact Common, Heavy, and Light User questions
export function exportFeedbackCSV() {
  const feedback = getAllFeedback();
  if (!feedback.length) {
    alert('No feedback entries to export yet.');
    return;
  }

  const headers = [
    'Date Submitted',
    'User Name',
    'User Phone',
    'User Segment',
    'Overall CSAT (1-5)',

    // Common Set
    '[Common] Review Frequency (Daily/Weekly/Monthly)',
    '[Common] Current Tracking Tools & Spreadsheets',
    '[Common] Last Investment Decision & Trigger',
    '[Common] Hardest Part About Managing Portfolio',
    '[Common] First Thing You Want to Know',
    '[Common] Past Regret Mistake & What Info Could Prevent It',

    // Heavy User Questions
    '[Heavy] Return Frequency & Open Triggers',
    '[Heavy] One Thing Wish It Showed',
    '[Heavy] Importance of "Why" (Verdict vs Detailed Rationale)',
    '[Heavy] Trust AI "Sell X Buy Y" Directly vs Need Detailed Analysis',
    '[Heavy] Current Rebalancing & Want AI to Guide It',
    '[Heavy] Desired Alerts (News, Valuation, Rebalance)',
    '[Heavy] Manage for Family / Multi-Portfolio Support',
    '[Heavy] Most Annoying Thing ("Why can\'t they fix this?")',
    '[Heavy] Tool Switched To When Leaving App',

    // Light User Questions
    '[Light] Why Not Used Portfolio Analysis Much',
    '[Light] Sync Attempt Experience / Reason Stopped',
    '[Light] Expectation vs Reality',
    '[Light] Ideal Picture of AI Portfolio Analysis',
    '[Light] Useful Insights Gotten Anywhere Else',
    '[Light] Prefer WhatsApp Summary Over App',

    // Additional Notes
    'General Call Notes & Verbatim Quotes'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    if (Array.isArray(val)) return `"${val.join(', ').replace(/"/g, '""')}"`;
    return `"${String(val).replace(/"/g, '""')}"`;
  };

  const rows = feedback.map(f => [
    escapeCSV(f.createdAt ? f.createdAt.split('T')[0] : ''),
    escapeCSV(f.userName),
    escapeCSV(f.userPhone),
    escapeCSV(f.userType === 'light' ? 'Light User' : 'Heavy User'),
    escapeCSV(f.satisfactionScore || ''),

    // Common
    escapeCSV(f.reviewFrequency),
    escapeCSV(f.currentTrackingTools),
    escapeCSV(f.lastInvestmentDecision),
    escapeCSV(f.hardestPartManaging),
    escapeCSV(f.firstThingToKnow),
    escapeCSV(f.pastRegretMistake),

    // Heavy
    escapeCSV(f.returnFrequencyTrigger),
    escapeCSV(f.missingThing),
    escapeCSV(f.whyExplanationImportance),
    escapeCSV(f.aiRecommendationTrust),
    escapeCSV(f.rebalancingHandling),
    escapeCSV(f.desiredAlerts),
    escapeCSV(f.familyPortfolios),
    escapeCSV(f.mostAnnoyingThing),
    escapeCSV(f.toolSwitchingMoment),

    // Light
    escapeCSV(f.lightWhyNotUsed),
    escapeCSV(f.syncAttemptExperience),
    escapeCSV(f.expectationVsReality),
    escapeCSV(f.idealAiPicture),
    escapeCSV(f.usefulInsightsElsewhere),
    escapeCSV(f.preferWhatsappSummary),

    // Notes
    escapeCSV(f.notes)
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `superinvesting_portfolio_feedback_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportDatabaseJSON() {
  const data = {
    exportedAt: new Date().toISOString(),
    users: getStoredUsers(),
    feedback: getAllFeedback(),
    settings: getStorageSettings()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `superinvesting_feedback_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDatabaseJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.users) saveUsers(parsed.users);
        if (parsed.feedback) localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(parsed.feedback));
        if (parsed.settings) saveStorageSettings(parsed.settings);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
