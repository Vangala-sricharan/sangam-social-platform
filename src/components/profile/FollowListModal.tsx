import React, { useState } from 'react';
import { X, Search, ShieldCheck, UserCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: 'Followers' | 'Following';
  userIds: string[];
}

export const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  onClose,
  title,
  userIds
}) => {
  const navigate = useNavigate();
  const { getUserById, currentUser } = useAuth();
  const { isFollowing, toggleFollow } = useSocial();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const users: User[] = userIds
    .map((id) => getUserById(id))
    .filter((u): u is User => !!u);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.bio && u.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUserClick = (username: string) => {
    onClose();
    navigate(`/profile/${username}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="follow-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 id="follow-modal-title" className="font-bold text-base text-slate-900 dark:text-white">
              {title}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
              {userIds.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${title.toLowerCase()}...`}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40 p-1">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
              {searchQuery ? 'No users matching your search.' : `No ${title.toLowerCase()} yet.`}
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isFollowingUser = isFollowing(user.id);
              const isSelf = currentUser?.id === user.id;

              return (
                <div
                  key={user.id}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors rounded-xl"
                >
                  <div
                    onClick={() => handleUserClick(user.username)}
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate hover:underline">
                          {user.name}
                        </span>
                        {user.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">
                        @{user.username}
                      </span>
                      {user.bio && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isSelf && (
                    <button
                      onClick={() => toggleFollow(user.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors flex items-center gap-1 ${
                        isFollowingUser
                          ? 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isFollowingUser ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
