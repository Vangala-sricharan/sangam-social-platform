import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, TrendingUp, Users, Image as ImageIcon, Sparkles, ShieldCheck, Check, UserPlus } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/feed/PostCard';
import { INITIAL_HASHTAGS } from '../data/mockData';
import { formatCount } from '../utils/storage';

export const ExplorePage: React.FC = () => {
  const { posts, isFollowing, toggleFollow } = useSocial();
  const { users, currentUser } = useAuth();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Popular Creators (excluding current user)
  const popularCreators = users
    .filter((u) => u.id !== currentUser?.id)
    .sort((a, b) => b.followersCount - a.followersCount)
    .slice(0, 4);

  // Media discovery: posts that have an image attachment
  const mediaPosts = posts.filter((p) => !!p.mediaUrl).slice(0, 6);

  // Filtered posts if a tag is selected
  const displayPosts = selectedTag
    ? posts.filter((p) => p.hashtags.some((h) => h.toLowerCase() === selectedTag.toLowerCase()))
    : posts.slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
            Explore
          </h1>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-6">
        {/* Popular Hashtags Filter Row */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Trending Hashtags
            </h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTag === null
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Topics
            </button>
            {INITIAL_HASHTAGS.map((h) => (
              <button
                key={h.tag}
                onClick={() => setSelectedTag(selectedTag === h.tag ? null : h.tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedTag === h.tag
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                #{h.tag} <span className="opacity-70 text-[10px]">({formatCount(h.postCount)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Creators Showcase */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                Popular Creators
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Community Leaders
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularCreators.map((creator) => {
              const following = isFollowing(creator.id);
              return (
                <div
                  key={creator.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3"
                >
                  <Link
                    to={`/profile/${creator.username}`}
                    className="flex items-center gap-2.5 min-w-0 group"
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate group-hover:underline">
                          {creator.name}
                        </span>
                        {creator.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        @{creator.username}
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                        {formatCount(creator.followersCount)} followers
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
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

        {/* Media Discovery Gallery */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                Media Discovery
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Visual Highlights
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {mediaPosts.map((p) => (
              <div
                key={p.id}
                className="relative aspect-square rounded-xl overflow-hidden group bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={p.mediaUrl}
                  alt={p.content.slice(0, 30)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                  <p className="text-white text-[11px] font-medium line-clamp-2 leading-tight">
                    {p.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending / Filtered Posts Stream */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/80 dark:border-slate-800/80">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {selectedTag ? `Posts tagged #${selectedTag}` : 'Trending Conversations'}
          </span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {displayPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
