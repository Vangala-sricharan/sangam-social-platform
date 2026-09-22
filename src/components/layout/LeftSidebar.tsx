import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  TrendingUp,
  Users,
  MessageSquare,
  Bell,
  Bookmark,
  User as UserIcon,
  Settings,
  PlusCircle,
  Moon,
  Sun,
  LogOut,
  MoreHorizontal,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { useTheme } from '../../context/ThemeContext';

interface LeftSidebarProps {
  onOpenCreatePost?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ onOpenCreatePost }) => {
  const { currentUser, logout } = useAuth();
  const { unreadNotificationsCount, unreadMessagesCount } = useSocial();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!currentUser) return null;

  const navItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Trending', path: '/trending', icon: TrendingUp },
    { label: 'Communities', path: '/communities', icon: Users },
    {
      label: 'Messages',
      path: '/messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined
    },
    { label: 'Saved', path: `/profile/${currentUser.username}/saved`, icon: Bookmark },
    { label: 'Profile', path: `/profile/${currentUser.username}`, icon: UserIcon },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 px-4 py-6 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#090d16]/70 backdrop-blur-md z-30 select-none">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="px-3 flex items-center justify-between">
          <NavLink
            to="/home"
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="SANGAM Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                SANGAM
              </span>
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 tracking-wide mt-1">
                Connect. Share. Belong.
              </span>
            </div>
          </NavLink>

          <button
            onClick={toggleTheme}
            id="theme-toggle-desktop"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/home' && location.pathname === '/');

            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={`nav-link-${item.label.toLowerCase()}`}
                className={({ isActive: navActive }) => {
                  const active = isActive || navActive;
                  return `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`;
                }}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-600 text-white dark:bg-blue-500 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Primary Post CTA Button */}
        <div className="pt-2 px-1">
          <button
            onClick={() => {
              if (onOpenCreatePost) {
                onOpenCreatePost();
              } else {
                navigate('/create');
              }
            }}
            id="sidebar-create-post-btn"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98]"
          >
            <PlusCircle className="w-5 h-5 shrink-0" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* User Session Mini Profile */}
      <div className="relative pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
        {showUserMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1 z-40 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setShowUserMenu(false);
                navigate(`/profile/${currentUser.username}`);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>View Profile</span>
            </button>
            <button
              onClick={() => {
                setShowUserMenu(false);
                navigate('/settings');
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
            <button
              onClick={() => {
                setShowUserMenu(false);
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out @{currentUser.username}</span>
            </button>
          </div>
        )}

        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          id="sidebar-user-menu-btn"
          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0 text-left">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </span>
                {currentUser.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                )}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                @{currentUser.username}
              </span>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" />
        </div>
      </div>
    </aside>
  );
};
