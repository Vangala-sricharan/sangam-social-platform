import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Check, Plus, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostCard } from '../components/feed/CreatePostCard';
import { formatCount } from '../utils/storage';

export const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { communities, getCommunityById, getCommunityBySlug, toggleJoinCommunity, posts } = useSocial();

  // Find community by id or slug
  const community =
    getCommunityById(id || '') ||
    getCommunityBySlug(id || '') ||
    communities.find((c) => c.slug === id || c.id === id);

  const [activeTab, setActiveTab] = useState<'discussions' | 'about'>('discussions');

  if (!community) {
    return (
      <div className="py-20 px-4 text-center">
        <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
          Community not found
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          The requested community may have moved or doesn't exist.
        </p>
        <Link
          to="/communities"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Communities</span>
        </Link>
      </div>
    );
  }

  // Filter posts matching this community
  const communityPosts = posts.filter(
    (p) =>
      p.communityId === community.id ||
      p.communityName?.toLowerCase() === community.name.toLowerCase() ||
      p.hashtags.some((h) => community.tags.map((t) => t.toLowerCase()).includes(h.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center gap-3">
        <Link
          to="/communities"
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Back to communities"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <h1 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
            {community.name}
          </h1>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {formatCount(community.memberCount)} members
          </span>
        </div>
      </div>

      {/* Banner & Profile Info */}
      <div className="relative">
        <div className="h-36 sm:h-48 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <img
            src={community.bannerUrl}
            alt={community.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="px-4 sm:px-6 pb-4 border-b border-slate-200/80 dark:border-slate-800/80 relative">
          <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-3">
            <img
              src={community.avatarUrl}
              alt={community.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-[#0b0f19] shadow-md bg-white dark:bg-slate-900"
              referrerPolicy="no-referrer"
            />

            <button
              onClick={() => toggleJoinCommunity(community.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                community.isJoined
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {community.isJoined ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Joined Community</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Join Community</span>
                </>
              )}
            </button>
          </div>

          <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {community.name}
          </h2>
          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            {community.category}
          </span>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {community.description}
          </p>

          {/* Trending discussion highlight */}
          {community.trendingTopic && (
            <div className="mt-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                Trending Discussion:
              </span>
              <span className="text-slate-700 dark:text-slate-300 truncate">
                {community.trendingTopic}
              </span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 mt-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'discussions'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Discussions ({communityPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Rules & Guidelines
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'discussions' ? (
        <div>
          {/* Post composer in community */}
          <CreatePostCard defaultCommunityId={community.id} />

          {/* Posts stream */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {communityPosts.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No posts in this community yet. Start the first conversation!
              </div>
            ) : (
              communityPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      ) : (
        <div className="p-5 space-y-6">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Community Rules</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-decimal pl-4">
              {community.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-2">
              Related Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/hashtag/${tag}`}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
