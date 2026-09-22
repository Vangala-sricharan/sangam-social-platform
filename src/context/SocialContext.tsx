import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Post,
  Comment,
  Community,
  Story,
  NotificationItem,
  Conversation,
  Message,
  UserSettings,
  ReportItem,
  ReportCategory
} from '../types';
import {
  STORAGE_KEYS,
  safeGetJSON,
  safeSetJSON,
  initializeLocalStorage
} from '../utils/storage';
import { useAuth } from './AuthContext';
import {
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_COMMUNITIES,
  INITIAL_STORIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  DEFAULT_SETTINGS
} from '../data/mockData';

interface SocialContextType {
  posts: Post[];
  communities: Community[];
  stories: Story[];
  notifications: NotificationItem[];
  conversations: Conversation[];
  messages: Message[];
  settings: UserSettings;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  savedPostIds: string[];
  likedPostIds: string[];
  
  // Post actions
  getPostById: (id: string) => Post | undefined;
  createPost: (data: {
    content: string;
    mediaUrl?: string;
    hashtags?: string[];
    communityId?: string;
  }) => Post;
  editPost: (postId: string, data: { content: string; mediaUrl?: string; hashtags?: string[] }) => boolean;
  deletePost: (postId: string) => boolean;
  
  // Likes & Saves
  isPostLiked: (postId: string) => boolean;
  toggleLike: (postId: string) => void;
  isPostSaved: (postId: string) => boolean;
  toggleSave: (postId: string) => void;
  getSavedPosts: () => Post[];
  
  // Comments
  getPostComments: (postId: string) => Comment[];
  addComment: (
    postId: string,
    content: string,
    parentId?: string,
    replyToUsername?: string
  ) => Comment | null;
  deleteComment: (commentId: string, postId: string) => boolean;
  toggleCommentLike: (commentId: string) => void;
  
  // Follows
  isFollowing: (userId: string) => boolean;
  toggleFollow: (userId: string) => void;
  getFollowingIds: (userId?: string) => string[];
  
  // Communities
  getCommunityById: (id: string) => Community | undefined;
  getCommunityBySlug: (slug: string) => Community | undefined;
  toggleJoinCommunity: (communityId: string) => void;

  // Reports
  reports: ReportItem[];
  reportPost: (postId: string, category: ReportCategory, details?: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  
  // Messages
  getConversationMessages: (conversationId: string) => Message[];
  sendMessage: (conversationId: string, text: string, receiverId: string) => void;
  startOrGetConversation: (targetUserId: string) => Conversation;
  markConversationAsRead: (conversationId: string) => void;
  
  // Stories
  markStoryViewed: (storyId: string) => void;
  createStory: (mediaUrl: string, caption?: string) => void;
  
  // Settings
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetDemoData: () => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, getUserById } = useAuth();

  // Initialize storage once if not already populated
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  const [posts, setPosts] = useState<Post[]>(() => safeGetJSON<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS));
  const [comments, setComments] = useState<Comment[]>(() =>
    safeGetJSON<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS)
  );
  const [likesMap, setLikesMap] = useState<Record<string, string[]>>(() =>
    safeGetJSON<Record<string, string[]>>(STORAGE_KEYS.LIKES, {})
  );
  const [savesMap, setSavesMap] = useState<Record<string, string[]>>(() =>
    safeGetJSON<Record<string, string[]>>(STORAGE_KEYS.SAVES, {})
  );
  const [followsMap, setFollowsMap] = useState<Record<string, string[]>>(() =>
    safeGetJSON<Record<string, string[]>>(STORAGE_KEYS.FOLLOWS, {})
  );
  const [communities, setCommunities] = useState<Community[]>(() =>
    safeGetJSON<Community[]>(STORAGE_KEYS.COMMUNITIES, INITIAL_COMMUNITIES)
  );
  const [stories, setStories] = useState<Story[]>(() =>
    safeGetJSON<Story[]>(STORAGE_KEYS.STORIES, INITIAL_STORIES)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    safeGetJSON<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    safeGetJSON<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS)
  );
  const [messages, setMessages] = useState<Message[]>(() =>
    safeGetJSON<Message[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES)
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    safeGetJSON<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );
  const [reports, setReports] = useState<ReportItem[]>(() =>
    safeGetJSON<ReportItem[]>(STORAGE_KEYS.REPORTS, [])
  );

  // Sync state to localStorage
  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.REPORTS, reports);
  }, [reports]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.POSTS, posts);
  }, [posts]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.COMMENTS, comments);
  }, [comments]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.LIKES, likesMap);
  }, [likesMap]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.SAVES, savesMap);
  }, [savesMap]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.FOLLOWS, followsMap);
  }, [followsMap]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.COMMUNITIES, communities);
  }, [communities]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.STORIES, stories);
  }, [stories]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.CONVERSATIONS, conversations);
  }, [conversations]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // Derived counts
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Post Actions
  const createPost = useCallback(
    ({
      content,
      mediaUrl,
      hashtags = [],
      communityId
    }: {
      content: string;
      mediaUrl?: string;
      hashtags?: string[];
      communityId?: string;
    }): Post => {
      if (!currentUser) throw new Error('Must be logged in to create a post');

      // Auto-extract hashtags from content if not already present
      const extractedHashtags = (content.match(/#(\w+)/g) || []).map((t) => t.substring(1));
      const allHashtags = Array.from(new Set([...hashtags, ...extractedHashtags]));

      const comm = communityId ? communities.find((c) => c.id === communityId) : undefined;

      const newPost: Post = {
        id: `post-${Date.now()}`,
        authorId: currentUser.id,
        content: content.trim(),
        mediaUrl: mediaUrl?.trim() || undefined,
        mediaType: mediaUrl?.trim() ? 'image' : undefined,
        hashtags: allHashtags,
        createdAt: 'Just now',
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        savesCount: 0,
        communityId,
        communityName: comm?.name
      };

      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    },
    [currentUser, communities]
  );

  const editPost = useCallback(
    (postId: string, data: { content: string; mediaUrl?: string; hashtags?: string[] }): boolean => {
      if (!currentUser) return false;
      const target = posts.find((p) => p.id === postId);
      if (!target || target.authorId !== currentUser.id) return false;

      const extracted = (data.content.match(/#(\w+)/g) || []).map((t) => t.substring(1));
      const tags = Array.from(new Set([...(data.hashtags || []), ...extracted]));

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                content: data.content.trim(),
                mediaUrl: data.mediaUrl?.trim() || undefined,
                hashtags: tags,
                isEdited: true,
                editedAt: 'Just now'
              }
            : p
        )
      );
      return true;
    },
    [currentUser, posts]
  );

  const deletePost = useCallback(
    (postId: string): boolean => {
      if (!currentUser) return false;
      const target = posts.find((p) => p.id === postId);
      if (!target || target.authorId !== currentUser.id) return false;

      setPosts((prev) => prev.filter((p) => p.id !== postId));
      // Clean up comments
      setComments((prev) => prev.filter((c) => c.postId !== postId));
      return true;
    },
    [currentUser, posts]
  );

  // Likes
  const isPostLiked = useCallback(
    (postId: string): boolean => {
      if (!currentUser) return false;
      const likes = likesMap[postId] || [];
      return likes.includes(currentUser.id);
    },
    [currentUser, likesMap]
  );

  const toggleLike = useCallback(
    (postId: string) => {
      if (!currentUser) return;
      const currentLiked = (likesMap[postId] || []).includes(currentUser.id);

      setLikesMap((prev) => {
        const existing = prev[postId] || [];
        const next = currentLiked
          ? existing.filter((uid) => uid !== currentUser.id)
          : [...existing, currentUser.id];
        return { ...prev, [postId]: next };
      });

      // Update post count
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likesCount: Math.max(0, p.likesCount + (currentLiked ? -1 : 1)) }
            : p
        )
      );

      // Create notification if liking another user's post
      const targetPost = posts.find((p) => p.id === postId);
      if (!currentLiked && targetPost && targetPost.authorId !== currentUser.id) {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'like',
          actorId: currentUser.id,
          postId,
          text: 'liked your post.',
          createdAt: 'Just now',
          isRead: false
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }
    },
    [currentUser, likesMap, posts]
  );

  // Saves
  const isPostSaved = useCallback(
    (postId: string): boolean => {
      if (!currentUser) return false;
      const userSaves = savesMap[currentUser.id] || [];
      return userSaves.includes(postId);
    },
    [currentUser, savesMap]
  );

  const toggleSave = useCallback(
    (postId: string) => {
      if (!currentUser) return;
      const userSaves = savesMap[currentUser.id] || [];
      const isSaved = userSaves.includes(postId);

      setSavesMap((prev) => {
        const next = isSaved
          ? userSaves.filter((pid) => pid !== postId)
          : [...userSaves, postId];
        return { ...prev, [currentUser.id]: next };
      });

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, savesCount: Math.max(0, p.savesCount + (isSaved ? -1 : 1)) }
            : p
        )
      );
    },
    [currentUser, savesMap]
  );

  const getSavedPosts = useCallback((): Post[] => {
    if (!currentUser) return [];
    const savedIds = savesMap[currentUser.id] || [];
    return posts.filter((p) => savedIds.includes(p.id));
  }, [currentUser, savesMap, posts]);

  // Comments
  const getPostComments = useCallback(
    (postId: string): Comment[] => {
      return comments.filter((c) => c.postId === postId);
    },
    [comments]
  );

  const addComment = useCallback(
    (
      postId: string,
      content: string,
      parentId?: string,
      replyToUsername?: string
    ): Comment | null => {
      if (!currentUser || !content.trim()) return null;

      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId,
        authorId: currentUser.id,
        content: content.trim(),
        createdAt: 'Just now',
        likesCount: 0,
        parentId,
        replyToUsername,
        likedBy: []
      };

      setComments((prev) => [newComment, ...prev]);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
      );

      // Notification
      const targetPost = posts.find((p) => p.id === postId);
      if (targetPost && targetPost.authorId !== currentUser.id) {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'comment',
          actorId: currentUser.id,
          postId,
          text: `commented: "${content.trim().slice(0, 45)}${content.length > 45 ? '...' : ''}"`,
          createdAt: 'Just now',
          isRead: false
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }

      return newComment;
    },
    [currentUser, posts]
  );

  const toggleCommentLike = useCallback(
    (commentId: string) => {
      if (!currentUser) return;
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          const likedBy = c.likedBy || [];
          const isLiked = likedBy.includes(currentUser.id);
          const nextLikedBy = isLiked
            ? likedBy.filter((id) => id !== currentUser.id)
            : [...likedBy, currentUser.id];
          return {
            ...c,
            likedBy: nextLikedBy,
            likesCount: nextLikedBy.length
          };
        })
      );
    },
    [currentUser]
  );

  const reportPost = useCallback(
    (postId: string, category: ReportCategory, details?: string) => {
      if (!currentUser) return;
      const newReport: ReportItem = {
        id: `report-${Date.now()}`,
        postId,
        reporterId: currentUser.id,
        category,
        details: details?.trim() || undefined,
        createdAt: new Date().toISOString()
      };
      setReports((prev) => [newReport, ...prev]);
    },
    [currentUser]
  );

  const deleteComment = useCallback(
    (commentId: string, postId: string): boolean => {
      if (!currentUser) return false;
      const target = comments.find((c) => c.id === commentId);
      if (!target || target.authorId !== currentUser.id) return false;

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p
        )
      );
      return true;
    },
    [currentUser, comments]
  );

  // Follows
  const isFollowing = useCallback(
    (targetUserId: string): boolean => {
      if (!currentUser) return false;
      const userFollows = followsMap[currentUser.id] || [];
      return userFollows.includes(targetUserId);
    },
    [currentUser, followsMap]
  );

  const toggleFollow = useCallback(
    (targetUserId: string) => {
      if (!currentUser || currentUser.id === targetUserId) return;
      const userFollows = followsMap[currentUser.id] || [];
      const currentlyFollowing = userFollows.includes(targetUserId);

      setFollowsMap((prev) => {
        const next = currentlyFollowing
          ? userFollows.filter((uid) => uid !== targetUserId)
          : [...userFollows, targetUserId];
        return { ...prev, [currentUser.id]: next };
      });

      // Notification if followed
      if (!currentlyFollowing) {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'follow',
          actorId: currentUser.id,
          text: 'started following you.',
          createdAt: 'Just now',
          isRead: false
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }
    },
    [currentUser, followsMap]
  );

  const getFollowingIds = useCallback(
    (userId?: string): string[] => {
      const uid = userId || currentUser?.id;
      if (!uid) return [];
      return followsMap[uid] || [];
    },
    [currentUser, followsMap]
  );

  // Communities
  const getCommunityById = useCallback((id: string) => communities.find((c) => c.id === id), [communities]);
  const getCommunityBySlug = useCallback((slug: string) => communities.find((c) => c.slug === slug), [communities]);

  const toggleJoinCommunity = useCallback((communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const joined = !c.isJoined;
          return {
            ...c,
            isJoined: joined,
            memberCount: Math.max(1, c.memberCount + (joined ? 1 : -1))
          };
        }
        return c;
      })
    );
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  // Messages
  const getConversationMessages = useCallback(
    (conversationId: string): Message[] => {
      return messages.filter((m) => m.conversationId === conversationId);
    },
    [messages]
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string, receiverId: string) => {
      if (!currentUser || !text.trim()) return;

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: currentUser.id,
        receiverId,
        text: text.trim(),
        createdAt: 'Just now',
        isRead: false
      };

      setMessages((prev) => [...prev, newMsg]);

      // Update conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: text.trim(),
                updatedAt: 'Just now'
              }
            : conv
        )
      );

      // Simulate a realistic reply after 1.5 seconds if replying to demo creators
      setTimeout(() => {
        const receiverUser = getUserById(receiverId);
        if (receiverUser) {
          const replies = [
            `Thanks for reaching out ${currentUser.name.split(' ')[0]}! That sounds great.`,
            `Glad you shared that! I was just reviewing similar patterns today.`,
            `Appreciate the note! Let's definitely collaborate on this soon.`,
            `Awesome! Looking forward to seeing what you build next.`
          ];
          const autoReplyText = replies[Math.floor(Math.random() * replies.length)];

          const replyMsg: Message = {
            id: `msg-${Date.now() + 1}`,
            conversationId,
            senderId: receiverId,
            receiverId: currentUser.id,
            text: autoReplyText,
            createdAt: 'Just now',
            isRead: false
          };

          setMessages((m) => [...m, replyMsg]);
          setConversations((c) =>
            c.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    lastMessage: autoReplyText,
                    updatedAt: 'Just now'
                  }
                : conv
            )
          );
        }
      }, 1500);
    },
    [currentUser, getUserById]
  );

  const startOrGetConversation = useCallback(
    (targetUserId: string): Conversation => {
      if (!currentUser) throw new Error('Not logged in');

      const existing = conversations.find(
        (c) =>
          c.participantIds.includes(currentUser.id) && c.participantIds.includes(targetUserId)
      );

      if (existing) return existing;

      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        participantIds: [currentUser.id, targetUserId],
        lastMessage: 'Started a new conversation',
        updatedAt: 'Just now',
        unreadCount: 0
      };

      setConversations((prev) => [newConv, ...prev]);
      return newConv;
    },
    [currentUser, conversations]
  );

  // Stories
  const markStoryViewed = useCallback((storyId: string) => {
    setStories((prev) => prev.map((s) => (s.id === storyId ? { ...s, isViewed: true } : s)));
  }, []);

  const createStory = useCallback(
    (mediaUrl: string, caption?: string) => {
      if (!currentUser) return;
      const newStory: Story = {
        id: `story-${Date.now()}`,
        authorId: currentUser.id,
        mediaUrl,
        caption,
        createdAt: 'Just now',
        isViewed: false
      };
      setStories((prev) => [newStory, ...prev]);
    },
    [currentUser]
  );

  // Settings
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Additional Social Context Helpers
  const getPostById = useCallback((id: string) => posts.find((p) => p.id === id), [posts]);

  const savedPostIds = currentUser ? savesMap[currentUser.id] || [] : [];
  
  const likedPostIds = currentUser
    ? Object.keys(likesMap).filter((pid) => (likesMap[pid] || []).includes(currentUser.id))
    : [];

  const markNotificationAsRead = useCallback((id: string) => {
    markNotificationRead(id);
  }, [markNotificationRead]);

  const markAllNotificationsAsRead = useCallback(() => {
    markAllNotificationsRead();
  }, [markAllNotificationsRead]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markConversationAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  // Reset to Demo Data
  const resetDemoData = useCallback(() => {
    initializeLocalStorage(true);
    setPosts(INITIAL_POSTS);
    setComments(INITIAL_COMMENTS);
    setLikesMap({
      'post-1': ['user-1', 'user-2', 'user-3', 'user-6'],
      'post-2': ['user-1', 'user-4', 'user-8'],
      'post-3': ['user-1', 'user-5', 'user-10']
    });
    setSavesMap({ 'user-1': ['post-2', 'post-3', 'post-12', 'post-26'] });
    setFollowsMap({
      'user-1': ['user-2', 'user-3', 'user-4', 'user-6', 'user-8', 'user-10']
    });
    setCommunities(INITIAL_COMMUNITIES);
    setStories(INITIAL_STORIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setConversations(INITIAL_CONVERSATIONS);
    setMessages(INITIAL_MESSAGES);
    setSettings(DEFAULT_SETTINGS);
    setReports([]);
    safeSetJSON(STORAGE_KEYS.REPORTS, []);
  }, []);

  return (
    <SocialContext.Provider
      value={{
        posts,
        communities,
        stories,
        notifications,
        conversations,
        messages,
        settings,
        reports,
        unreadNotificationsCount,
        unreadMessagesCount,
        savedPostIds,
        likedPostIds,
        getPostById,
        createPost,
        editPost,
        deletePost,
        isPostLiked,
        toggleLike,
        isPostSaved,
        toggleSave,
        getSavedPosts,
        getPostComments,
        addComment,
        deleteComment,
        toggleCommentLike,
        reportPost,
        isFollowing,
        toggleFollow,
        getFollowingIds,
        getCommunityById,
        getCommunityBySlug,
        toggleJoinCommunity,
        markNotificationRead,
        markNotificationAsRead,
        markAllNotificationsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        getConversationMessages,
        sendMessage,
        startOrGetConversation,
        markConversationAsRead,
        markStoryViewed,
        createStory,
        updateSettings,
        resetDemoData
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = (): SocialContextType => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
