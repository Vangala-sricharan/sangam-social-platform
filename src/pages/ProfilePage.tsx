import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  ShieldCheck,
  Edit3,
  UserPlus,
  Check,
  MessageSquare,
  ArrowLeft,
  Share2,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { useToast } from '../components/common/Toast';
import { PostCard } from '../components/feed/PostCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { FollowListModal } from '../components/profile/FollowListModal';
import { CreatorAnalytics } from '../components/profile/CreatorAnalytics';
import { formatCount } from '../utils/storage';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, getUserByUsername, users } = useAuth();
  const {
    posts,
    savedPostIds,
    likedPostIds,
    isFollowing,
    toggleFollow,
    getFollowingIds,
    startOrGetConversation
  } = useSocial();
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [followModal, setFollowModal] = useState<{
    isOpen: boolean;
    title: 'Followers' | 'Following';
    userIds: string[];
  }>({
    isOpen: false,
    title: 'Followers',
    userIds: []
  });

  // Determine active tab from URL path if it has /saved or /media
  const initialTab = location.pathname.endsWith('/saved')
    ? 'saved'
    : location.pathname.endsWith('/media')
    ? 'media'
    : 'posts';

  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes' | 'saved' | 'analytics'>(initialTab);

  const profileUser = getUserByUsername(username || '') || (currentUser?.username === username ? currentUser : null);
  const isOwnProfile = currentUser?.id === profileUser?.id;
  const following = profileUser ? isFollowing(profileUser.id) : false;

  useEffect(() => {
    if (location.pathname.endsWith('/saved')) setActiveTab('saved');
    else if (location.pathname.endsWith('/media')) setActiveTab('media');
  }, [location.pathname]);

  if (!profileUser) {
    return (
      <div className="py-20 px-4 text-center">
        <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
          User @{username} not found
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          This user profile doesn't exist on SANGAM.
        </p>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  // Filter user posts
  const userPosts = posts.filter((p) => p.authorId === profileUser.id);
  const userMediaPosts = userPosts.filter((p) => !!p.mediaUrl);
  const userLikedPosts = posts.filter((p) => likedPostIds.includes(p.id));
  const userSavedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  const handleMessageClick = () => {
    if (!currentUser || isOwnProfile) return;
    startOrGetConversation(profileUser.id);
    navigate(`/messages?with=${profileUser.id}`);
  };

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileUser.name} (@${profileUser.username}) on SANGAM`,
          text: `Check out ${profileUser.name}'s profile on SANGAM: Connect. Share. Belong.`,
          url: profileUrl
        });
        showToast('Profile shared!', 'success');
        return;
      } catch {
        // Fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(profileUrl);
      showToast('Profile link copied to clipboard!', 'success');
    } catch {
      showToast('Could not copy link.', 'error');
    }
  };

  // Derive follower & following ID lists for modal
  const openFollowersModal = () => {
    const otherUsers = users.filter((u) => u.id !== profileUser.id);
    setFollowModal({
      isOpen: true,
      title: 'Followers',
      userIds: otherUsers.map((u) => u.id)
    });
  };

  const openFollowingModal = () => {
    if (isOwnProfile) {
      setFollowModal({
        isOpen: true,
        title: 'Following',
        userIds: getFollowingIds()
      });
    } else {
      const otherUsers = users.filter((u) => u.id !== profileUser.id);
      setFollowModal({
        isOpen: true,
        title: 'Following',
        userIds: otherUsers.slice(0, 3).map((u) => u.id)
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                {profileUser.name}
              </h1>
              {profileUser.isVerified && (
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              )}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>
        </div>

        <button
          onClick={handleShareProfile}
          className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Share profile"
          aria-label="Share profile"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Banner */}
      <div className="h-36 sm:h-48 w-full bg-linear-to-r from-blue-700 via-indigo-700 to-purple-800 relative overflow-hidden">
        {profileUser.coverImage ? (
          <img
            src={profileUser.coverImage}
            alt="Cover banner"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-blue-600 to-indigo-600 opacity-90" />
        )}
      </div>

      {/* Profile Details Container */}
      <div className="px-4 sm:px-6 pb-4 border-b border-slate-200/80 dark:border-slate-800/80 relative">
        {/* Avatar and Action Buttons Row */}
        <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-4">
          <img
            src={profileUser.avatar}
            alt={profileUser.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white dark:ring-[#0b0f19] shadow-md bg-white dark:bg-slate-900"
            referrerPolicy="no-referrer"
          />

          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleMessageClick}
                  className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
                  title="Direct Message"
                  aria-label="Direct message"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleFollow(profileUser.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                    following
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {following ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Name & Handle */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              {profileUser.name}
            </h2>
            {profileUser.isVerified && (
              <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
            )}
          </div>
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            @{profileUser.username}
          </span>
        </div>

        {/* Bio */}
        {profileUser.bio && (
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-3 leading-relaxed max-w-xl">
            {profileUser.bio}
          </p>
        )}

        {/* Meta Info (Location, Website, Joined) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-3">
          {profileUser.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{profileUser.location}</span>
            </div>
          )}

          {profileUser.website && (
            <div className="flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              <a
                href={profileUser.website.startsWith('http') ? profileUser.website : `https://${profileUser.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {profileUser.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Joined {profileUser.joinedDate}</span>
          </div>
        </div>

        {/* Followers & Following Stats (Interactive) */}
        <div className="flex items-center gap-5 mt-3 pt-2 text-xs sm:text-sm">
          <button
            onClick={openFollowingModal}
            className="flex items-center gap-1.5 hover:underline transition-colors"
          >
            <span className="font-bold text-slate-900 dark:text-white">
              {formatCount(profileUser.followingCount)}
            </span>
            <span className="text-slate-500 dark:text-slate-400">Following</span>
          </button>

          <button
            onClick={openFollowersModal}
            className="flex items-center gap-1.5 hover:underline transition-colors"
          >
            <span className="font-bold text-slate-900 dark:text-white">
              {formatCount(profileUser.followersCount)}
            </span>
            <span className="text-slate-500 dark:text-slate-400">Followers</span>
          </button>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 mt-4 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'posts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Posts ({userPosts.length})
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'media'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Media ({userMediaPosts.length})
          </button>

          <button
            onClick={() => setActiveTab('likes')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'likes'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Likes ({isOwnProfile ? userLikedPosts.length : '0'})
          </button>

          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'saved'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Saved ({userSavedPosts.length})
            </button>
          )}

          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Streams */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
        {activeTab === 'posts' && (
          userPosts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              @{profileUser.username} hasn't posted yet.
            </div>
          ) : (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          )
        )}

        {activeTab === 'media' && (
          userMediaPosts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No media posts yet.
            </div>
          ) : (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {userMediaPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group cursor-pointer"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.content}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'likes' && (
          isOwnProfile ? (
            userLikedPosts.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                You haven't liked any posts yet.
              </div>
            ) : (
              userLikedPosts.map((post) => <PostCard key={post.id} post={post} />)
            )
          ) : (
            <div className="py-16 text-center text-slate-400 text-sm">
              Liked posts are private to each user.
            </div>
          )
        )}

        {activeTab === 'saved' && isOwnProfile && (
          userSavedPosts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              You don't have any saved bookmarks yet. Bookmark posts with the bookmark icon!
            </div>
          ) : (
            userSavedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )
        )}

        {activeTab === 'analytics' && isOwnProfile && (
          <CreatorAnalytics user={profileUser} />
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Follow / Following Modal */}
      {followModal.isOpen && (
        <FollowListModal
          isOpen={followModal.isOpen}
          onClose={() => setFollowModal((prev) => ({ ...prev, isOpen: false }))}
          title={followModal.title}
          userIds={followModal.userIds}
        />
      )}
    </div>
  );
};
