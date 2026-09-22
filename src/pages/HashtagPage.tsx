import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Hash, Bell, Check, Sparkles } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from '../components/feed/PostCard';
import { useToast } from '../components/common/Toast';
import { formatCount } from '../utils/storage';

export const HashtagPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const { posts } = useSocial();
  const { showToast } = useToast();

  const [isFollowingTopic, setIsFollowingTopic] = useState(false);

  const cleanTag = tag ? tag.replace('#', '') : '';

  // Filter posts matching this hashtag
  const taggedPosts = posts.filter((p) =>
    p.hashtags.some((h) => h.toLowerCase() === cleanTag.toLowerCase())
  );

  const handleToggleFollow = () => {
    setIsFollowingTopic(!isFollowingTopic);
    showToast(
      !isFollowingTopic
        ? `You are now following #${cleanTag}`
        : `Unfollowed #${cleanTag}`,
      'info'
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/explore"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                {cleanTag}
              </h1>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {formatCount(taggedPosts.length)} discussions
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleFollow}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isFollowingTopic
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
          }`}
        >
          {isFollowingTopic ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Following Topic</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5" />
              <span>Follow Topic</span>
            </>
          )}
        </button>
      </div>

      {/* Posts Stream */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
        {taggedPosts.length === 0 ? (
          <div className="py-20 px-4 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
            <Hash className="w-8 h-8 opacity-40" />
            <p>No posts tagged #{cleanTag} yet</p>
            <Link
              to="/create"
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Start discussion on #{cleanTag}
            </Link>
          </div>
        ) : (
          taggedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};
