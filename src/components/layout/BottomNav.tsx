import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Plus, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';

interface BottomNavProps {
  onOpenCreatePost?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCreatePost }) => {
  const { currentUser } = useAuth();
  const { unreadNotificationsCount } = useSocial();
  const location = useLocation();

  if (!currentUser) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2 safe-area-bottom select-none"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <NavLink
          to="/home"
          id="mobile-nav-home"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              isActive || location.pathname === '/'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </NavLink>

        {/* Explore */}
        <NavLink
          to="/explore"
          id="mobile-nav-explore"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Explore</span>
        </NavLink>

        {/* Create Button */}
        {onOpenCreatePost ? (
          <button
            onClick={onOpenCreatePost}
            id="mobile-nav-create-btn"
            className="flex items-center justify-center w-11 h-11 -mt-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
            aria-label="Create Post"
          >
            <Plus className="w-6 h-6" />
          </button>
        ) : (
          <NavLink
            to="/create"
            id="mobile-nav-create-link"
            className="flex items-center justify-center w-11 h-11 -mt-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
            aria-label="Create Post"
          >
            <Plus className="w-6 h-6" />
          </NavLink>
        )}

        {/* Notifications */}
        <NavLink
          to="/notifications"
          id="mobile-nav-notifications"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <div className="relative">
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5">Notifications</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to={`/profile/${currentUser.username}`}
          id="mobile-nav-profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className={`w-5 h-5 rounded-full object-cover ring-1 ${
                location.pathname.startsWith(`/profile/${currentUser.username}`)
                  ? 'ring-blue-600 ring-2'
                  : 'ring-slate-300 dark:ring-slate-600'
              }`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] font-medium mt-0.5">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};
