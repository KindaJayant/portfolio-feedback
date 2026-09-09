import { POWER_USERS } from '../data/powerUsers';

const STORAGE_KEY_FEEDBACK = 'superinvesting_portfolio_feedback_v1';
const STORAGE_KEY_USERS = 'superinvesting_power_users_v1';
const STORAGE_KEY_SETTINGS = 'superinvesting_storage_settings_v1';

// Initialize pre-seeded power users if not already present
export function getStoredUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(POWER_USERS));
      return POWER_USERS;
    }
    return JSON.parse(data);
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

export function updateUserStatus(userId, status, assignedTo = null, lastContacted = new Date().toISOString()) {
  const users = getStoredUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        status: status || u.status,
        assignedTo: assignedTo !== null ? assignedTo : u.assignedTo,
        lastContacted: lastContacted
      };
    }
    return u;
  });
  saveUsers(updated);
  return updated;
}

// Get all feedback entries
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

// Save a new feedback entry
export async function saveFeedback(feedbackEntry) {
  try {
    const existing = getAllFeedback();
    const newEntry = {
      id: feedbackEntry.id || `fb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...feedbackEntry
    };
    
    // Save to local storage
    const updated = [newEntry, ...existing];
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));

    // Update corresponding user status if linked to a user
    if (newEntry.userId) {
      updateUserStatus(newEntry.userId, 'Completed', newEntry.interviewerName || null);
    }

    // Sync to external services if configured (Google Sheets Webhook or Supabase)
    syncToRemoteWebhook(newEntry).catch(console.warn);

    return newEntry;
  } catch (err) {
    console.error('Failed to save feedback:', err);
    throw err;
  }
}

// Delete feedback entry
export function deleteFeedback(id) {
  try {
    const existing = getAllFeedback();
    const updated = existing.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete feedback:', err);
    return [];
  }
}

// Settings management for Google Sheets / Supabase integrations
export function getStorageSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    const defaults = {
      googleSheetsWebhook: import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK || '',
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      notionWebhook: import.meta.env.VITE_NOTION_WEBHOOK || '',
      teamMembers: ['Jayant', 'Akshay', 'Jatin', 'Rohan', 'Product Team']
    };
    if (!data) return defaults;
    return { ...defaults, ...JSON.parse(data) };
  } catch (err) {
    return {
      googleSheetsWebhook: '',
      supabaseUrl: '',
      supabaseAnonKey: '',
      notionWebhook: '',
      teamMembers: ['Jayant', 'Akshay', 'Jatin', 'Rohan', 'Product Team']
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

// Multi-destination serverless sync (Google Sheets webhook / Supabase REST API)
async function syncToRemoteWebhook(entry) {
  const settings = getStorageSettings();
  
  // 1. Google Sheets Webhook / Make / Zapier
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

  // 2. Supabase Direct REST API (if credentials provided)
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

// Export database as downloadable JSON
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

// Export feedback as CSV
export function exportFeedbackCSV() {
  const feedback = getAllFeedback();
  if (!feedback.length) {
    alert('No feedback entries to export.');
    return;
  }

  const headers = [
    'Feedback ID',
    'Date Submitted',
    'User ID',
    'User Name',
    'Phone',
    'Email',
    'Entry Mode',
    'Interviewer',
    'Call Status',
    'Satisfaction Rating (1-5)',
    'Primary Brokers',
    'Selected Pain Points',
    'Top Feature Wishlist',
    'Missing AI Diagnostic Insights',
    'Verbatim User Quote / Feedback',
    'Action Items'
  ];

  const rows = feedback.map(f => [
    `"${f.id || ''}"`,
    `"${f.createdAt ? f.createdAt.split('T')[0] : ''}"`,
    `"${f.userId || ''}"`,
    `"${(f.userName || '').replace(/"/g, '""')}"`,
    `"${f.userPhone || ''}"`,
    `"${f.userEmail || ''}"`,
    `"${f.mode || 'Team Interview'}"`,
    `"${f.interviewerName || ''}"`,
    `"${f.callStatus || 'Completed'}"`,
    `"${f.satisfactionScore || ''}"`,
    `"${(f.brokers || []).join(', ')}"`,
    `"${(f.painPoints || []).join('; ')}"`,
    `"${(f.featureRequests || []).join('; ')}"`,
    `"${(f.missingAiInsights || '').replace(/"/g, '""')}"`,
    `"${(f.verbatimFeedback || '').replace(/"/g, '""')}"`,
    `"${(f.actionItems || '').replace(/"/g, '""')}"`
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

// Restore database from JSON backup file
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
