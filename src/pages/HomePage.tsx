import React, { useState, useMemo } from 'react';
import { Sparkles, Users, TrendingUp, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { useAuth } from '../context/AuthContext';
import { StoryRow } from '../components/feed/StoryRow';
import { CreatePostCard } from '../components/feed/CreatePostCard';
import { PostCard } from '../components/feed/PostCard';
import { Post } from '../types';

export const HomePage: React.FC = () => {
  const { posts, getFollowingIds, isPostSaved } = useSocial();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'forYou' | 'following' | 'trending'>('forYou');
  const [sortBy, setSortBy] = useState<'latest' | 'engagement' | 'saved'>('latest');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const followingIds = getFollowingIds();

  // Local ranking & filtering logic
  const displayedPosts = useMemo(() => {
    let result: Post[] = [...posts];

    // 1. Tab filtering
    if (activeTab === 'following') {
      result = result.filter(
        (p) => followingIds.includes(p.authorId) || p.authorId === currentUser?.id
      );
    } else if (activeTab === 'trending') {
      // Sort strictly by highest engagement
      return result.sort((a, b) => {
        const scoreA = (a.likesCount || 0) * 2 + (a.commentsCount || 0) * 3 + (a.sharesCount || 0) * 2;
        const scoreB = (b.likesCount || 0) * 2 + (b.commentsCount || 0) * 3 + (b.sharesCount || 0) * 2;
        return scoreB - scoreA;
      });
    } else {
      // For You: smart blend of followed creators and engagement
      result = result.sort((a, b) => {
        const aFollowBonus = followingIds.includes(a.authorId) ? 10 : 0;
        const bFollowBonus = followingIds.includes(b.authorId) ? 10 : 0;
        const scoreA = (a.likesCount || 0) * 1.5 + (a.commentsCount || 0) * 2 + aFollowBonus;
        const scoreB = (b.likesCount || 0) * 1.5 + (b.commentsCount || 0) * 2 + bFollowBonus;
        return scoreB - scoreA;
      });
    }

    // 2. Sorting selection override (if chosen)
    if (sortBy === 'engagement') {
      result.sort((a, b) => {
        const scoreA = (a.likesCount || 0) * 2 + (a.commentsCount || 0) * 3;
        const scoreB = (b.likesCount || 0) * 2 + (b.commentsCount || 0) * 3;
        return scoreB - scoreA;
      });
    } else if (sortBy === 'saved') {
      result.sort((a, b) => {
        const aSaved = isPostSaved(a.id) ? 1 : 0;
        const bSaved = isPostSaved(b.id) ? 1 : 0;
        return bSaved - aSaved;
      });
    }

    return result;
  }, [posts, activeTab, sortBy, followingIds, currentUser, isPostSaved]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Feed Header & Sticky Tabs */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
              Home
            </h1>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {displayedPosts.length} posts
            </span>
          </div>

          {/* Sort / Filter Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
              aria-label="Filter posts"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="capitalize">{sortBy}</span>
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-30 animate-in fade-in duration-100">
                <button
                  onClick={() => {
                    setSortBy('latest');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortBy === 'latest'
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => {
                    setSortBy('engagement');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortBy === 'engagement'
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Most Engaged
                </button>
                <button
                  onClick={() => {
                    setSortBy('saved');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortBy === 'saved'
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Saved First
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feed Tabs: For You / Following / Trending */}
        <div className="flex border-t border-slate-100 dark:border-slate-800/60">
          <button
            onClick={() => setActiveTab('forYou')}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'forYou'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>For You</span>
            </span>
            {activeTab === 'forYou' && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'following'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Following</span>
            </span>
            {activeTab === 'following' && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'trending'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending</span>
            </span>
            {activeTab === 'trending' && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Stories Bar */}
      <StoryRow />

      {/* Inline Post Composer */}
      <CreatePostCard />

      {/* Feed Posts List */}
      <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60">
        {displayedPosts.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              {activeTab === 'following'
                ? 'No posts from creators you follow'
                : 'No posts in feed'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              {activeTab === 'following'
                ? 'Switch back to "For You" or explore creators in the Explore tab to follow new conversations!'
                : 'Be the first to share an idea, question, or engineering milestone!'}
            </p>
            {activeTab === 'following' && (
              <button
                onClick={() => setActiveTab('forYou')}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
              >
                Switch to For You
              </button>
            )}
          </div>
        ) : (
          displayedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};
