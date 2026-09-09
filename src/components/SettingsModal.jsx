import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Database, 
  Cloud, 
  Save, 
  FileSpreadsheet, 
  Users, 
  Check, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { getStorageSettings, saveStorageSettings } from '../services/storage';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  if (!isOpen) return null;

  const [settings, setSettings] = useState(getStorageSettings());
  const [newMember, setNewMember] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveStorageSettings(settings);
    setSaved(true);
    if (onSettingsUpdated) onSettingsUpdated(settings);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const addTeamMember = () => {
    if (!newMember.trim()) return;
    if (settings.teamMembers.includes(newMember.trim())) return;
    setSettings({
      ...settings,
      teamMembers: [...settings.teamMembers, newMember.trim()]
    });
    setNewMember('');
  };

  const removeTeamMember = (member) => {
    setSettings({
      ...settings,
      teamMembers: settings.teamMembers.filter(m => m !== member)
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-charcoal-200 max-w-xl w-full overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#012414] text-white flex items-center justify-between border-b border-[#01381f]">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Storage & Webhook Integration</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-200/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          
          {/* 1. Google Sheets Webhook */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <label className="text-xs font-mono font-bold text-charcoal-900 uppercase tracking-wider">
                Google Sheets / Zapier Webhook URL
              </label>
            </div>
            <p className="text-[11px] text-charcoal-500">
              Paste a Google Apps Script / Make / Zapier webhook URL to automatically append every logged call as a row in your live team Google Sheet without any backend server.
            </p>
            <input
              type="url"
              value={settings.googleSheetsWebhook}
              onChange={(e) => setSettings({ ...settings, googleSheetsWebhook: e.target.value })}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full bg-[#FAF8F5] border border-charcoal-200 rounded-xl px-3.5 py-2 text-xs font-mono text-charcoal-900 focus:outline-none focus:border-forest-600"
            />
          </div>

          {/* 2. Supabase Integration (Optional) */}
          <div className="space-y-3 pt-4 border-t border-charcoal-100">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-700" />
              <label className="text-xs font-mono font-bold text-charcoal-900 uppercase tracking-wider">
                Supabase Direct Sync (Optional)
              </label>
            </div>
            <p className="text-[11px] text-charcoal-500">
              Optional direct REST syncing if your team uses a Supabase database table (<code className="bg-oat-200 px-1 rounded text-charcoal-800">portfolio_feedback</code>).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-charcoal-500 mb-1">Project URL</label>
                <input
                  type="text"
                  value={settings.supabaseUrl}
                  onChange={(e) => setSettings({ ...settings, supabaseUrl: e.target.value })}
                  placeholder="https://xyz.supabase.co"
                  className="w-full bg-[#FAF8F5] border border-charcoal-200 rounded-lg px-3 py-1.5 text-xs font-mono text-charcoal-900 focus:outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-charcoal-500 mb-1">Anon Key</label>
                <input
                  type="password"
                  value={settings.supabaseAnonKey}
                  onChange={(e) => setSettings({ ...settings, supabaseAnonKey: e.target.value })}
                  placeholder="eyJhbGciOi..."
                  className="w-full bg-[#FAF8F5] border border-charcoal-200 rounded-lg px-3 py-1.5 text-xs font-mono text-charcoal-900 focus:outline-none focus:border-forest-600"
                />
              </div>
            </div>
          </div>

          {/* 3. Team Members */}
          <div className="space-y-2 pt-4 border-t border-charcoal-100">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <label className="text-xs font-mono font-bold text-charcoal-900 uppercase tracking-wider">
                Team Interviewers
              </label>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {settings.teamMembers.map(m => (
                <span
                  key={m}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300"
                >
                  <span>{m}</span>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(m)}
                    className="hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Add team member name..."
                className="flex-1 bg-[#FAF8F5] border border-charcoal-200 rounded-lg px-3 py-1.5 text-xs text-charcoal-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={addTeamMember}
                className="px-3 py-1.5 bg-oat-200 hover:bg-oat-300 text-charcoal-900 rounded-lg text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-charcoal-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center space-x-1.5 bg-[#014828] hover:bg-[#01381f] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Saved!' : 'Save Integration Settings'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
