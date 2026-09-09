import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import UserQuestionnaireModal from './components/UserQuestionnaireModal';
import ExportModal from './components/ExportModal';
import SettingsModal from './components/SettingsModal';
import { 
  getStoredUsers, 
  toggleUserChecked,
  setUserChecked,
  getAllFeedback, 
  getFeedbackForUser,
  saveFeedback, 
  deleteFeedback, 
  resetAllData,
  exportFeedbackCSV,
  getStorageSettings 
} from './services/storage';

export default function App() {
  const [users, setUsers] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [settings, setSettings] = useState(getStorageSettings());

  // Modals state
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load fresh data on mount
  useEffect(() => {
    refreshData();

    // Listen for storage events (e.g. cross-tab updates)
    const handleStorageChange = () => {
      refreshData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshData = () => {
    setUsers(getStoredUsers());
    setFeedbackList(getAllFeedback());
    setSettings(getStorageSettings());
  };

  // 1. Click user name -> Open Questionnaire Modal for that specific person
  const handleOpenUserQuestions = (user) => {
    setSelectedUserForModal(user);
    setIsQuestionnaireOpen(true);
  };

  // 2. Toggle user checked state directly
  const handleToggleUserChecked = (userId) => {
    const updated = toggleUserChecked(userId);
    setUsers(updated);
  };

  // Explicitly set checked state
  const handleSetUserChecked = (userId, isChecked) => {
    const updated = setUserChecked(userId, isChecked);
    setUsers(updated);
  };

  // 3. Save feedback from modal -> updates storage, marks user checked, refreshes list
  const handleSaveFeedbackEntry = async (entry) => {
    const saved = await saveFeedback(entry);
    refreshData();
    return saved;
  };

  // 4. Delete feedback entry
  const handleDeleteFeedbackEntry = (id) => {
    const updated = deleteFeedback(id);
    refreshData();
  };

  // 5. Reset all test responses back to fresh 0/10 state
  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to reset all responses back to 0/10? This will clear any test feedback.')) {
      resetAllData();
      refreshData();
    }
  };

  const completedCount = users.filter(u => u.checked).length;
  const existingFeedbackForSelectedUser = selectedUserForModal 
    ? feedbackList.find(f => f.userId === selectedUserForModal.id) 
    : null;

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col font-sans text-charcoal-900 selection:bg-emerald-900 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetData={handleResetAllData}
        totalUsersCount={users.length}
        completedCount={completedCount}
      />

      {/* Main Single-Screen View: 10-User Checklist & Live Insights */}
      <main className="flex-1">
        <DashboardView
          users={users}
          feedbackList={feedbackList}
          onSelectUser={handleOpenUserQuestions}
          onToggleUserChecked={handleToggleUserChecked}
          onDeleteFeedback={handleDeleteFeedbackEntry}
          onOpenExport={() => setIsExportOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-charcoal-200/60 bg-[#FAF8F5] text-center text-xs font-mono text-charcoal-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SuperInvesting.ai — Portfolio Section Power-User Research</span>
          <span>Zero Backend Required • Vercel Ready</span>
        </div>
      </footer>

      {/* Questionnaire Modal: Opens upon clicking any user's name */}
      <UserQuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        user={selectedUserForModal}
        existingFeedback={existingFeedbackForSelectedUser}
        onSaveFeedback={handleSaveFeedbackEntry}
        onDeleteFeedback={handleDeleteFeedbackEntry}
        onToggleChecked={handleSetUserChecked}
      />

      {/* Export CSV Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        feedbackList={feedbackList}
        users={users}
        onDataRestored={refreshData}
      />

      {/* Settings Modal (Remote sync / webhook) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
      />

    </div>
  );
}
