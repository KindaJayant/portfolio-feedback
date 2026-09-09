import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  FileJson,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { exportFeedbackCSV, exportDatabaseJSON, importDatabaseJSON } from '../services/storage';

export default function ExportModal({ isOpen, onClose, feedbackList, users, onDataRestored }) {
  if (!isOpen) return null;

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [importing, setImporting] = useState(false);

  const generateSlackSummary = () => {
    const total = feedbackList.length;
    const avgScore = total > 0 
      ? (feedbackList.reduce((acc, f) => acc + (f.satisfactionScore || 0), 0) / total).toFixed(1)
      : 'N/A';

    const painPointMap = {};
    feedbackList.forEach(f => {
      (f.painPoints || []).forEach(p => {
        painPointMap[p] = (painPointMap[p] || 0) + 1;
      });
    });

    const topPainPoints = Object.entries(painPointMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => `• *${name}* (${count} mentions)`)
      .join('\n');

    const summaryText = `🚀 *SuperInvesting Portfolio User Feedback Summary Report*
📊 *Total Interviews/Responses Logged:* ${total} / ${users.length} Power Users
⭐ *Average Portfolio CSAT Rating:* ${avgScore} / 5.0

🔥 *Top Reported Pain Points:*
${topPainPoints || '• Pending user call logs'}

💡 *Export File Available:* Download CSV directly from the hub.`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      await importDatabaseJSON(file);
      alert('✅ Successfully restored database from backup file!');
      onDataRestored();
      onClose();
    } catch (err) {
      alert('❌ Failed to restore database: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-charcoal-200 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#012414] text-white flex items-center justify-between border-b border-[#01381f]">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Export & Data Backup</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-200/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* 1. CSV Download */}
          <div className="p-4 rounded-xl border border-oat-300 bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-charcoal-900">Export as CSV</h4>
                <p className="text-[11px] text-charcoal-500">Formatted spreadsheet for Excel, Google Sheets, or Notion</p>
              </div>
            </div>
            <button
              onClick={exportFeedbackCSV}
              className="px-3.5 py-1.5 bg-[#014828] hover:bg-[#01381f] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              Download
            </button>
          </div>

          {/* 2. Copy Slack/Notion Report */}
          <div className="p-4 rounded-xl border border-oat-300 bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-charcoal-900">Copy Slack / Notion Report</h4>
                <p className="text-[11px] text-charcoal-500">Formatted markdown summary ready to post in team channels</p>
              </div>
            </div>
            <button
              onClick={generateSlackSummary}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* 3. JSON Backup & Restore */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={exportDatabaseJSON}
              className="p-3 bg-white hover:bg-oat-50 border border-charcoal-300 text-charcoal-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <FileJson className="w-4 h-4 text-charcoal-500" />
              <span>Export JSON Backup</span>
            </button>

            <label className="p-3 bg-white hover:bg-oat-50 border border-charcoal-300 text-charcoal-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-charcoal-500" />
              <span>{importing ? 'Importing...' : 'Restore JSON'}</span>
              <input 
                type="file" 
                accept=".json"
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF8F5] border-t border-oat-300 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-charcoal-600 hover:text-charcoal-900"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
