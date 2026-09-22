export type Role = 'member' | 'creator' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverImage: string;
  banner?: string;
  bio: string;
  location: string;
  website?: string;
  role: Role;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
  mutualFollowers?: string[]; // array of usernames
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image';
  hashtags: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  communityId?: string;
  communityName?: string;
  isEdited?: boolean;
  editedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likesCount: number;
  parentId?: string;
  replyToUsername?: string;
  likedBy?: string[];
}

export type ReportCategory = 'spam' | 'harassment' | 'misleading' | 'other';

export interface ReportItem {
  id: string;
  postId: string;
  reporterId: string;
  category: ReportCategory;
  details?: string;
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  bannerUrl: string;
  avatarUrl: string;
  memberCount: number;
  isJoined?: boolean;
  rules: string[];
  tags: string[];
  trendingTopic?: string;
}

export interface Story {
  id: string;
  authorId: string;
  mediaUrl: string;
  caption?: string;
  createdAt: string;
  isViewed?: boolean;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'share' | 'mention';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  actorId: string;
  sourceUserId?: string; // alias for actorId
  postId?: string;
  text: string;
  content?: string; // alias for text
  createdAt: string;
  isRead: boolean;
}

export type Notification = NotificationItem;

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  content?: string; // alias
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[]; // [user1Id, user2Id]
  participants?: string[]; // alias
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
  messages?: Message[];
}

export interface HashtagInfo {
  tag: string;
  postCount: number;
  isTrending: boolean;
  category: string;
}

export interface UserSettings {
  account: {
    name: string;
    username: string;
    email: string;
    bio: string;
    website: string;
    location: string;
  };
  privacy: {
    isPrivateAccount: boolean;
    showOnlineStatus: boolean;
    allowDirectMessages: 'everyone' | 'following' | 'none';
    allowTagging: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    likes: boolean;
    comments: boolean;
    newFollowers: boolean;
    directMessages: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}
