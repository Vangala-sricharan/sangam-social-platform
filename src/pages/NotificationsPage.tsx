import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Users,
  AtSign,
  CheckCheck,
  Trash2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../types';
import { formatRelativeTime } from '../utils/storage';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    isFollowing,
    toggleFollow
  } = useSocial();
  const { getUserById, currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'all' | 'mention' | 'verified' | 'like' | 'comment' | 'follow'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'verified') {
      const actor = getUserById(n.actorId || n.sourceUserId || '');
      return actor?.isVerified === true;
    }
    return n.type === activeFilter;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-current" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      case 'share':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (n: Notification) => {
    markNotificationAsRead(n.id);
    if (n.postId) {
      navigate(`/post/${n.postId}`);
    } else {
      const u = getUserById(n.actorId || n.sourceUserId || '');
      if (u) navigate(`/profile/${u.username}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
            Notifications
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Mark all as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mark all read</span>
          </button>

          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Clear all notifications"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear all</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto px-4 py-2 gap-1.5 bg-slate-50/50 dark:bg-slate-900/30">
        {[
          { key: 'all', label: 'All' },
          { key: 'mention', label: 'Mentions' },
          { key: 'verified', label: 'Verified' },
          { key: 'like', label: 'Likes' },
          { key: 'comment', label: 'Comments' },
          { key: 'follow', label: 'Follows' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
        {filteredNotifications.length === 0 ? (
          <div className="py-20 px-4 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
            <Bell className="w-8 h-8 opacity-40" />
            <p>No notifications in this category</p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const actorId = n.actorId || n.sourceUserId || '';
            const sourceUser = getUserById(actorId);
            const isFollowingUser = isFollowing(actorId);
            const isSelf = currentUser?.id === actorId;

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                  !n.isRead
                    ? 'bg-blue-50/50 dark:bg-blue-950/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                {/* Notification Icon */}
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {sourceUser && (
                      <img
                        src={sourceUser.avatar}
                        alt={sourceUser.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {sourceUser?.name || 'A SANGAM Member'}
                      </span>
                      {sourceUser?.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.text || n.content}
                  </p>

                  <span className="text-[11px] text-slate-400 mt-1 inline-block">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>

                {/* Optional Follow Back button if follow notification */}
                {n.type === 'follow' && !isSelf && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(actorId);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                      isFollowingUser
                        ? 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isFollowingUser ? 'Following' : 'Follow back'}
                  </button>
                )}

                {/* Unread dot */}
                {!n.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
