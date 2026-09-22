import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Award, Zap, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/feed/PostCard';
import { INITIAL_HASHTAGS } from '../data/mockData';
import { formatCount } from '../utils/storage';

const CATEGORIES = ['All', 'Tech', 'Business', 'Education', 'Creative'];

export const TrendingPage: React.FC = () => {
  const { posts, isFollowing, toggleFollow } = useSocial();
  const { users, currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter hashtags by category
  const filteredHashtags =
    selectedCategory === 'All'
      ? INITIAL_HASHTAGS
      : INITIAL_HASHTAGS.filter((h) => h.category.toLowerCase() === selectedCategory.toLowerCase());

  // Rank posts by engagement (likesCount + commentsCount * 2 + sharesCount * 3)
  const rankedPosts = [...posts]
    .sort((a, b) => {
      const scoreA = a.likesCount + a.commentsCount * 2 + a.sharesCount * 3;
      const scoreB = b.likesCount + b.commentsCount * 2 + b.sharesCount * 3;
      return scoreB - scoreA;
    })
    .slice(0, 10);

  // Rising Creators
  const risingCreators = users
    .filter((u) => u.id !== currentUser?.id)
    .slice(2, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-500" />
          <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
            Trending on SANGAM
          </h1>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Top Trending Topics Grid */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Trending Hashtags in India
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredHashtags.slice(0, 6).map((item, idx) => (
              <Link
                key={item.tag}
                to={`/hashtag/${item.tag}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-400 dark:text-slate-500 w-4">
                    #{idx + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.category}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      #{item.tag}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-blue-500">
                  <span>{formatCount(item.postCount)}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Rising Creators Row */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Rising Indian Creators
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {risingCreators.map((user) => {
              const following = isFollowing(user.id);
              return (
                <div
                  key={user.id}
                  className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20 mb-2"
                    referrerPolicy="no-referrer"
                  />
                  <Link
                    to={`/profile/${user.username}`}
                    className="font-semibold text-xs text-slate-900 dark:text-white hover:underline truncate w-full"
                  >
                    {user.name}
                  </Link>
                  <span className="text-[11px] text-slate-500 truncate w-full mb-2">
                    @{user.username}
                  </span>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`w-full py-1 rounded-xl text-xs font-semibold transition-colors ${
                      following
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Popular Posts Stream */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Top Ranked Posts Today
          </span>
          <span className="text-xs text-slate-400">By Community Engagement</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {rankedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
