import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Settings,
  Moon,
  Sun,
  Shield,
  Bell,
  Download,
  RotateCcw,
  LogOut,
  User,
  Sparkles,
  Info,
  CheckCircle,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSocial } from '../context/SocialContext';
import { useToast } from '../components/common/Toast';
import { clearStorage, exportAllDataAsJSON } from '../utils/storage';

export const SettingsPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { posts, notifications, communities } = useSocial();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Subsections
  const [activeSection, setActiveSection] = useState<
    'appearance' | 'account' | 'privacy' | 'notifications' | 'data' | 'about'
  >('appearance');

  // Privacy toggles
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [allowDMs, setAllowDMs] = useState(true);
  const [showReadReceipts, setShowReadReceipts] = useState(true);

  // Notification toggles
  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyFollows, setNotifyFollows] = useState(true);

  if (!currentUser) return null;

  const handleExportData = () => {
    const jsonString = exportAllDataAsJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sangam-backup-${currentUser.username}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Your SANGAM data export is downloaded!', 'success');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all SANGAM data to initial defaults? All created posts and custom changes in local storage will be cleared.'
      )
    ) {
      clearStorage();
      showToast('All data reset to initial defaults. Reloading...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
            Settings
          </h1>
        </div>
      </div>

      {/* Settings Navigation Pills */}
      <div className="flex border-b border-slate-200/80 dark:border-slate-800/80 overflow-x-auto p-2 bg-slate-50/50 dark:bg-slate-900/40 gap-1">
        {[
          { key: 'appearance', label: 'Appearance', icon: Sun },
          { key: 'account', label: 'Account', icon: User },
          { key: 'privacy', label: 'Privacy', icon: Shield },
          { key: 'notifications', label: 'Notifications', icon: Bell },
          { key: 'data', label: 'Data & Backup', icon: Download },
          { key: 'about', label: 'About', icon: Info }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSection === tab.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-6 max-w-xl space-y-6">
        {/* Appearance Section */}
        {activeSection === 'appearance' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Display & Theme
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize your viewing experience on SANGAM.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Currently set to {theme} mode
                  </p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 shadow-xs transition-colors"
              >
                Switch to {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
        )}

        {/* Account Section */}
        {activeSection === 'account' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Account Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your credentials and SANGAM membership.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-xs font-medium text-slate-500">Username</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  @{currentUser.username}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-xs font-medium text-slate-500">Full Name</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-xs font-medium text-slate-500">Email Address</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Member Since</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser.joinedDate}
                </span>
              </div>
            </div>

            {/* Indian Currency Pricing Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-slate-900/60 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-heading font-bold text-sm">
                    SANGAM Creator Pass
                  </span>
                </div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  ₹499 / year
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Get custom creator badges, verified blue crest, early community access, and analytics.
              </p>
              <button
                onClick={() => showToast('Creator Pass preview active for demo!', 'info')}
                className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Renew / Upgrade for ₹499
              </button>
            </div>
          </div>
        )}

        {/* Privacy Section */}
        {activeSection === 'privacy' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Privacy & Security
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Control who can interact with you on SANGAM.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Private Account
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Only approved followers can see your posts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivateAccount}
                  onChange={(e) => {
                    setIsPrivateAccount(e.target.checked);
                    showToast('Privacy setting saved locally.', 'info');
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Direct Messages
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Allow messages from anyone on SANGAM
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allowDMs}
                  onChange={(e) => {
                    setAllowDMs(e.target.checked);
                    showToast('DM settings updated.', 'info');
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Read Receipts
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Let users know when you've seen their messages
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={showReadReceipts}
                  onChange={(e) => {
                    setShowReadReceipts(e.target.checked);
                    showToast('Read receipt preference saved.', 'info');
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Notification Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose what updates you want to receive.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Likes & Reactions
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    When someone likes your posts or stories
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyLikes}
                  onChange={(e) => setNotifyLikes(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Comments & Replies
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    When someone responds to your discussion
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyComments}
                  onChange={(e) => setNotifyComments(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    New Followers
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    When another creator starts following you
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyFollows}
                  onChange={(e) => setNotifyFollows(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Data & Backup Section */}
        {activeSection === 'data' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Data Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                All data is stored purely locally in your browser (no external database).
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Export SANGAM Data
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Download all your posts, bookmarks, and chat history as JSON
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <div>
                  <h4 className="text-xs font-semibold text-rose-600">
                    Reset to Factory Mock Data
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Clears local state and reloads initial mock dataset
                  </p>
                </div>
                <button
                  onClick={handleResetData}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                About SANGAM
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                "Connect. Share. Belong."
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                    SANGAM
                  </h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Version 1.0.0
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                SANGAM is an independent, modern Indian-origin social media and community platform designed for engineers, creators, startup builders, and thinkers. Connect through curated feeds, join focused interest groups, exchange perspectives, and build community together.
              </p>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 flex flex-col gap-1">
                <span>Architecture: React + TypeScript + Tailwind CSS</span>
                <span>Storage: LocalStorage Client State Machine</span>
                <span>Created with pride for India's tech ecosystem</span>
              </div>
            </div>
          </div>
        )}

        {/* Log Out CTA */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-rose-600 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 font-semibold text-xs sm:text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out of @{currentUser.username}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
