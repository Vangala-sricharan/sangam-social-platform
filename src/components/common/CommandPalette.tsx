import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Home,
  Compass,
  TrendingUp,
  Users,
  MessageSquare,
  Bell,
  PenSquare,
  User,
  Settings,
  Sun,
  Moon,
  LogOut,
  Command,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from './Toast';

interface CommandAction {
  id: string;
  title: string;
  category: 'Navigation' | 'Action';
  icon: React.ReactNode;
  shortcut?: string;
  perform: () => void;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const actions: CommandAction[] = [
    {
      id: 'home',
      title: 'Go to Home Feed',
      category: 'Navigation',
      icon: <Home className="w-4 h-4 text-blue-500" />,
      perform: () => navigate('/home')
    },
    {
      id: 'explore',
      title: 'Explore Indian Tech Ecosystem',
      category: 'Navigation',
      icon: <Compass className="w-4 h-4 text-indigo-500" />,
      perform: () => navigate('/explore')
    },
    {
      id: 'trending',
      title: 'View Trending Discussions',
      category: 'Navigation',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      perform: () => navigate('/trending')
    },
    {
      id: 'communities',
      title: 'Browse Communities',
      category: 'Navigation',
      icon: <Users className="w-4 h-4 text-purple-500" />,
      perform: () => navigate('/communities')
    },
    {
      id: 'messages',
      title: 'Direct Messages',
      category: 'Navigation',
      icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
      perform: () => navigate('/messages')
    },
    {
      id: 'notifications',
      title: 'Notification Center',
      category: 'Navigation',
      icon: <Bell className="w-4 h-4 text-amber-500" />,
      perform: () => navigate('/notifications')
    },
    {
      id: 'create-post',
      title: 'Create New Post',
      category: 'Action',
      icon: <PenSquare className="w-4 h-4 text-blue-600" />,
      shortcut: 'C',
      perform: () => navigate('/create')
    },
    {
      id: 'search',
      title: 'Search Creators & Topics',
      category: 'Navigation',
      icon: <Search className="w-4 h-4 text-slate-500" />,
      perform: () => navigate('/search')
    },
    {
      id: 'profile',
      title: 'View My Profile',
      category: 'Navigation',
      icon: <User className="w-4 h-4 text-blue-500" />,
      perform: () => {
        if (currentUser) navigate(`/profile/${currentUser.username}`);
      }
    },
    {
      id: 'settings',
      title: 'Platform Settings',
      category: 'Navigation',
      icon: <Settings className="w-4 h-4 text-slate-500" />,
      perform: () => navigate('/settings')
    },
    {
      id: 'toggle-theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      category: 'Action',
      icon:
        theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-500" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-500" />
        ),
      perform: () => {
        toggleTheme();
        showToast(`Theme switched to ${theme === 'dark' ? 'Light' : 'Dark'}`, 'info');
      }
    },
    {
      id: 'logout',
      title: 'Log Out of SANGAM',
      category: 'Action',
      icon: <LogOut className="w-4 h-4 text-rose-500" />,
      perform: () => {
        logout();
        showToast('Logged out of SANGAM session', 'info');
        navigate('/login');
      }
    }
  ];

  const filteredActions = actions.filter((action) =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredActions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % Math.max(1, filteredActions.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const action = filteredActions[selectedIndex];
      if (action) {
        action.perform();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
          <Command className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search (e.g. Home, Settings, Theme)..."
            className="w-full text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Action List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
              No matching commands found.
            </div>
          ) : (
            filteredActions.map((action, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={action.id}
                  onClick={() => {
                    action.perform();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      {action.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-xs sm:text-sm block">
                        {action.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {action.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {action.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {action.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-2.5 px-4 bg-slate-50 dark:bg-[#0b0f19] border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-semibold text-blue-600 dark:text-blue-400">SANGAM</span>
        </div>
      </div>
    </div>
  );
};
