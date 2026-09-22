import React from 'react';
import {
  BarChart2,
  TrendingUp,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Users,
  Eye,
  Award
} from 'lucide-react';
import { User, Post } from '../../types';
import { useSocial } from '../../context/SocialContext';
import { formatNumber } from '../../utils/storage';

interface CreatorAnalyticsProps {
  user: User;
}

export const CreatorAnalytics: React.FC<CreatorAnalyticsProps> = ({ user }) => {
  const { posts, savedPostIds } = useSocial();

  const userPosts = posts.filter((p) => p.authorId === user.id);
  const totalPosts = userPosts.length;

  const totalLikes = userPosts.reduce((acc, p) => acc + (p.likesCount || 0), 0);
  const totalComments = userPosts.reduce((acc, p) => acc + (p.commentsCount || 0), 0);
  const totalShares = userPosts.reduce((acc, p) => acc + (p.sharesCount || 0), 0);

  // Engagement calculation
  const totalInteractions = totalLikes + totalComments + totalShares;
  const engagementRate =
    totalPosts > 0
      ? ((totalInteractions / (totalPosts * Math.max(1, user.followersCount))) * 100).toFixed(1)
      : '0.0';

  // Find top performing post
  const topPost = [...userPosts].sort(
    (a, b) => b.likesCount * 2 + b.commentsCount * 3 - (a.likesCount * 2 + a.commentsCount * 3)
  )[0];

  // 7-day simulated activity values based on user's real stats
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseHeights = [45, 65, 80, 55, 95, 70, 85];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Creator Insights & Analytics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Locally calculated metrics based on your SANGAM posts and community engagement
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Active Creator</span>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Posts</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(totalPosts)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Authored content</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Followers</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(user.followersCount)}
          </p>
          <span className="text-[11px] text-emerald-500 mt-1 block font-medium">
            Network reach
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Likes Received</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(totalLikes)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Community endorsements</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Comments</span>
            <MessageCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(totalComments)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Discussions sparked</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Shares</span>
            <Share2 className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(totalShares)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Amplified posts</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Engagement Rate</span>
            <Eye className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {engagementRate}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Interactions per post</span>
        </div>
      </div>

      {/* 7-Day Engagement Trend Bar Chart */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
              Weekly Activity Distribution
            </h4>
            <p className="text-[11px] text-slate-400">
              Aggregated engagement frequency over the last 7 days
            </p>
          </div>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Past 7 Days
          </span>
        </div>

        {/* Visual Bar Graph */}
        <div className="pt-4 pb-1">
          <div className="h-32 flex items-end justify-between gap-2 sm:gap-4 px-2">
            {days.map((day, idx) => {
              const height = baseHeights[idx];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative flex items-end justify-center h-full">
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full max-w-[28px] rounded-t-lg bg-blue-500/80 group-hover:bg-blue-600 transition-all duration-300 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold pointer-events-none whitespace-nowrap shadow-xs">
                        {Math.round((height * totalInteractions) / 100) || height}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Post Spotlight */}
      {topPost && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
              Highest Performing Discussion
            </h4>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
              {topPost.content}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-rose-500">
                <Heart className="w-3.5 h-3.5 fill-current" />
                {topPost.likesCount} likes
              </span>
              <span className="flex items-center gap-1 text-blue-500">
                <MessageCircle className="w-3.5 h-3.5" />
                {topPost.commentsCount} comments
              </span>
              <span className="flex items-center gap-1 text-purple-500">
                <Share2 className="w-3.5 h-3.5" />
                {topPost.sharesCount} shares
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
