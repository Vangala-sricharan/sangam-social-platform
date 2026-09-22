import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Users,
  FileText,
  Sparkles,
  ShieldCheck,
  History,
  X,
  TrendingUp,
  Hash,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { PostCard } from '../components/feed/PostCard';
import { formatCount, safeGetJSON, safeSetJSON, STORAGE_KEYS } from '../utils/storage';
import { INITIAL_HASHTAGS } from '../data/mockData';

const POPULAR_SUGGESTIONS = [
  '#BuildInPublic',
  '#BangaloreTech',
  '#UPI',
  '#IndianStartups',
  '#AIinIndia',
  '#OpenSource'
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'posts' | 'communities'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    safeGetJSON<string[]>(STORAGE_KEYS.RECENT_SEARCHES, ['#BuildInPublic', 'Bangalore', 'AI'])
  );

  const { users, currentUser } = useAuth();
  const { posts, communities, isFollowing, toggleFollow, toggleJoinCommunity } = useSocial();

  // Sync state with url search param if changed
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const saveToRecentSearches = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 10);
      safeSetJSON(STORAGE_KEYS.RECENT_SEARCHES, updated);
      return updated;
    });
  };

  const removeRecentSearch = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== itemToRemove);
      safeSetJSON(STORAGE_KEYS.RECENT_SEARCHES, updated);
      return updated;
    });
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    safeSetJSON(STORAGE_KEYS.RECENT_SEARCHES, []);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveToRecentSearches(query.trim());
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
    saveToRecentSearches(keyword);
    setSearchParams({ q: keyword });
  };

  const cleanQuery = query.toLowerCase().trim();

  // Search Results
  const matchedUsers = cleanQuery
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(cleanQuery) ||
          u.username.toLowerCase().includes(cleanQuery) ||
          u.bio?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedPosts = cleanQuery
    ? posts.filter(
        (p) =>
          p.content.toLowerCase().includes(cleanQuery) ||
          p.hashtags.some((h) => h.toLowerCase().includes(cleanQuery.replace('#', '')))
      )
    : [];

  const matchedCommunities = cleanQuery
    ? communities.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.description.toLowerCase().includes(cleanQuery) ||
          c.tags.some((t) => t.toLowerCase().includes(cleanQuery))
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 p-3 sm:p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search SANGAM for people, posts, or communities..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchParams({});
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Search Result Category Tabs */}
        {cleanQuery && (
          <div className="flex border-t border-slate-100 dark:border-slate-800/60 pt-2 gap-1 overflow-x-auto">
            {[
              { key: 'all', label: 'All Results' },
              { key: 'people', label: `People (${matchedUsers.length})` },
              { key: 'posts', label: `Posts (${matchedPosts.length})` },
              { key: 'communities', label: `Communities (${matchedCommunities.length})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Viewport or Recent / Suggested View */}
      {!cleanQuery ? (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <History className="w-3.5 h-3.5" />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={clearAllRecent}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <div
                    key={item}
                    onClick={() => handleSuggestionClick(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={(e) => removeRecentSearch(item, e)}
                      className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Topics to Search */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <span>Popular Ecosystem Topics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_SUGGESTIONS.map((tag) => (
                <div
                  key={tag}
                  onClick={() => handleSuggestionClick(tag)}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-500" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {tag.replace('#', '')}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 space-y-6">
          {/* People Section */}
          {(activeTab === 'all' || activeTab === 'people') && matchedUsers.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>People</span>
              </h2>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-2">
                {matchedUsers.map((user) => {
                  const following = isFollowing(user.id);
                  const isCurrent = user.id === currentUser?.id;

                  return (
                    <div
                      key={user.id}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-xl transition-colors"
                    >
                      <Link
                        to={`/profile/${user.username}`}
                        className="flex items-center gap-3 min-w-0"
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {user.name}
                            </span>
                            {user.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            @{user.username}
                          </span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                            {user.bio}
                          </span>
                        </div>
                      </Link>

                      {!isCurrent && (
                        <button
                          onClick={() => toggleFollow(user.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                            following
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {following ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Communities Section */}
          {(activeTab === 'all' || activeTab === 'communities') && matchedCommunities.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Communities</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedCommunities.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <Link
                      to={`/community/${comm.id}`}
                      className="flex items-center gap-3 min-w-0"
                    >
                      <img
                        src={comm.avatarUrl}
                        alt={comm.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate block hover:underline">
                          {comm.name}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {formatCount(comm.memberCount)} members
                        </span>
                      </div>
                    </Link>

                    <button
                      onClick={() => toggleJoinCommunity(comm.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                        comm.isJoined
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {comm.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {(activeTab === 'all' || activeTab === 'posts') && (
            <div className="space-y-3">
              <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Posts</span>
              </h2>

              {matchedPosts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No posts matching this search.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 -mx-4 sm:-mx-5">
                  {matchedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {matchedUsers.length === 0 &&
            matchedPosts.length === 0 &&
            matchedCommunities.length === 0 && (
              <div className="py-16 text-center text-slate-400 text-sm">
                No matching results found for "{query}". Try checking your spelling or searching for a broader term.
              </div>
            )}
        </div>
      )}
    </div>
  );
};
