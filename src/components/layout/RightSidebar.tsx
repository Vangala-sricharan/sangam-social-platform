import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, TrendingUp, Users, ArrowRight, ShieldCheck, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { INITIAL_HASHTAGS } from '../../data/mockData';
import { formatCount } from '../../utils/storage';

export const RightSidebar: React.FC = () => {
  const { currentUser, users } = useAuth();
  const { isFollowing, toggleFollow, communities, toggleJoinCommunity } = useSocial();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Filter suggested users (not current user, prioritize un-followed)
  const suggestedUsers = users
    .filter((u) => u.id !== currentUser?.id)
    .slice(0, 3);

  // Featured community
  const featuredCommunity = communities[0];

  return (
    <aside className="hidden lg:flex flex-col gap-5 w-80 xl:w-88 h-screen sticky top-0 px-4 py-6 overflow-y-auto border-l border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-[#090d16]/40 backdrop-blur-xs select-none">
      {/* Global Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search people, #tags, posts..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 dark:focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-150"
        />
      </form>

      {/* Trending Topics Card */}
      <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Trending Topics
            </h3>
          </div>
          <Link
            to="/trending"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-slate-200/50 dark:divide-slate-800/50 mt-1">
          {INITIAL_HASHTAGS.slice(0, 5).map((item) => (
            <Link
              key={item.tag}
              to={`/hashtag/${item.tag}`}
              className="py-2.5 flex items-center justify-between group hover:bg-slate-100/50 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {item.category} · Trending
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  #{item.tag}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                {formatCount(item.postCount)} posts
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested Creators / Who to Follow */}
      <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Suggested Creators
            </h3>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Explore
          </Link>
        </div>

        <div className="flex flex-col gap-3 mt-3">
          {suggestedUsers.map((user) => {
            const following = isFollowing(user.id);
            return (
              <div key={user.id} className="flex items-center justify-between gap-3">
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center gap-2.5 min-w-0 group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col min-w-0 text-left">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white truncate group-hover:underline">
                        {user.name}
                      </span>
                      {user.isVerified && (
                        <ShieldCheck className="w-3 h-3 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      @{user.username}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${
                    following
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {following ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Community */}
      {featuredCommunity && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-slate-900/60 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Featured Community
          </span>
          <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mt-1">
            {featuredCommunity.name}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
            {featuredCommunity.description}
          </p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-blue-200/40 dark:border-blue-900/40">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {formatCount(featuredCommunity.memberCount)} members
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleJoinCommunity(featuredCommunity.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  featuredCommunity.isJoined
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {featuredCommunity.isJoined ? 'Joined' : 'Join'}
              </button>
              <Link
                to={`/community/${featuredCommunity.slug}`}
                className="p-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Platform Minimal Footer */}
      <footer className="text-[11px] text-slate-400 dark:text-slate-500 flex flex-wrap gap-x-2 gap-y-1 px-1">
        <Link to="/settings/privacy" className="hover:underline">Privacy</Link>
        <span>·</span>
        <Link to="/settings" className="hover:underline">Settings</Link>
        <span>·</span>
        <Link to="/communities" className="hover:underline">Communities</Link>
        <span>·</span>
        <span>© {new Date().getFullYear()} SANGAM</span>
        <span className="w-full text-slate-400 dark:text-slate-600 mt-0.5">
          "Connect. Share. Belong."
        </span>
      </footer>
    </aside>
  );
};
