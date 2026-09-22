import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const TopHeader: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between">
      <Link to="/home" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-lg font-bold text-slate-900 dark:text-white leading-none">
            SANGAM
          </span>
          <span className="text-[9px] font-medium text-blue-600 dark:text-blue-400">
            Connect. Share. Belong.
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate('/search')}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </button>

        {currentUser && (
          <Link
            to={`/profile/${currentUser.username}`}
            className="p-0.5 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500 transition-all shrink-0 ml-1"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </Link>
        )}
      </div>
    </header>
  );
};
