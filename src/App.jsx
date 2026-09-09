import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import InterviewLoggerModal from './components/InterviewLoggerModal';
import PublicQuestionnaireView from './components/PublicQuestionnaireView';
import ExportModal from './components/ExportModal';
import SettingsModal from './components/SettingsModal';
import { 
  getStoredUsers, 
  getAllFeedback, 
  saveFeedback, 
  updateUserStatus, 
  deleteFeedback, 
  getStorageSettings 
} from './services/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('team'); // 'team' | 'insights' | 'form'
  const [users, setUsers] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [settings, setSettings] = useState(getStorageSettings());

  // Modal states
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedUserForCall, setSelectedUserForCall] = useState(null);

  // Load data on mount
  useEffect(() => {
    refreshData();

    // Listen for storage events (cross-tab synchronization)
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

  const handleOpenLogger = (user = null) => {
    setSelectedUserForCall(user);
    setIsLoggerOpen(true);
  };

  const handleSaveFeedbackEntry = async (entry) => {
    const saved = await saveFeedback(entry);
    refreshData();
    return saved;
  };

  const handleUpdateUserStatus = (userId, status) => {
    const updated = updateUserStatus(userId, status);
    setUsers(updated);
  };

  const handleDeleteFeedbackEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this interview record?')) {
      const updated = deleteFeedback(id);
      setFeedbackList(updated);
    }
  };

  const completedCount = users.filter(u => u.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col font-sans text-charcoal-900 selection:bg-emerald-900 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenLogger={() => handleOpenLogger(null)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalUsersCount={users.length}
        completedCount={completedCount}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'team' && (
          <DashboardView
            users={users}
            feedbackList={feedbackList}
            onSelectUserForCall={(user) => handleOpenLogger(user)}
            onUpdateUserStatus={handleUpdateUserStatus}
            onDeleteFeedback={handleDeleteFeedbackEntry}
          />
        )}

        {currentTab === 'insights' && (
          <DashboardView
            users={users}
            feedbackList={feedbackList}
            onSelectUserForCall={(user) => handleOpenLogger(user)}
            onUpdateUserStatus={handleUpdateUserStatus}
            onDeleteFeedback={handleDeleteFeedbackEntry}
          />
        )}

        {currentTab === 'form' && (
          <PublicQuestionnaireView
            onSaveFeedback={handleSaveFeedbackEntry}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-charcoal-200/60 bg-[#FAF8F5] text-center text-xs font-mono text-charcoal-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SuperInvesting.ai — Internal Product Research & Portfolio Feedback Hub</span>
          <span>Zero-Backend Serverless Architecture • Vercel Ready</span>
        </div>
      </footer>

      {/* Modals */}
      <InterviewLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        selectedUser={selectedUserForCall}
        allUsers={users}
        onSaveFeedback={handleSaveFeedbackEntry}
        teamMembers={settings.teamMembers || ['Jayant', 'Akshay', 'Jatin', 'Product Team']}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        feedbackList={feedbackList}
        users={users}
        onDataRestored={refreshData}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
      />

    </div>
  );
}
