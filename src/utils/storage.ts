import {
  User,
  Post,
  Comment,
  Community,
  Story,
  NotificationItem,
  Conversation,
  Message,
  UserSettings
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_COMMUNITIES,
  INITIAL_STORIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  DEFAULT_SETTINGS
} from '../data/mockData';

export const STORAGE_KEYS = {
  SESSION: 'sangam-session',
  THEME: 'sangam-theme',
  USERS: 'sangam-users',
  POSTS: 'sangam-posts',
  COMMENTS: 'sangam-comments',
  LIKES: 'sangam-likes',
  SAVES: 'sangam-saves',
  FOLLOWS: 'sangam-follows',
  NOTIFICATIONS: 'sangam-notifications',
  MESSAGES: 'sangam-messages',
  CONVERSATIONS: 'sangam-conversations',
  COMMUNITIES: 'sangam-communities',
  STORIES: 'sangam-stories',
  SETTINGS: 'sangam-settings',
  REPORTS: 'sangam-reports',
  RECENT_SEARCHES: 'sangam-recent-searches',
} as const;

export function safeGetJSON<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function safeSetJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}

export function initializeLocalStorage(forceReset = false): void {
  // If forceReset is true, clear Sangam keys
  if (forceReset) {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k !== STORAGE_KEYS.THEME) {
        localStorage.removeItem(k);
      }
    });
  }

  // 1. Session
  if (!localStorage.getItem(STORAGE_KEYS.SESSION)) {
    // Default to Arjun Sharma as demo logged-in user
    safeSetJSON(STORAGE_KEYS.SESSION, {
      userId: 'user-1',
      username: 'arjun_sharma',
      isAuthenticated: true,
      token: 'demo-session-token-' + Date.now()
    });
  }

  // 2. Theme
  if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
    localStorage.setItem(STORAGE_KEYS.THEME, 'light');
  }

  // 3. Users
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    safeSetJSON(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  // 4. Posts
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    safeSetJSON(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  }

  // 5. Comments
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    safeSetJSON(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  }

  // 6. Likes: map of postId -> Set of userIds, stored as Record<string, string[]>
  if (!localStorage.getItem(STORAGE_KEYS.LIKES)) {
    // Pre-populate some likes for demo user
    const initialLikes: Record<string, string[]> = {
      'post-1': ['user-1', 'user-2', 'user-3', 'user-6'],
      'post-2': ['user-1', 'user-4', 'user-8'],
      'post-3': ['user-1', 'user-5', 'user-10'],
      'post-5': ['user-1', 'user-2']
    };
    safeSetJSON(STORAGE_KEYS.LIKES, initialLikes);
  }

  // 7. Saves: Record<userId, string[]> (list of saved postIds)
  if (!localStorage.getItem(STORAGE_KEYS.SAVES)) {
    const initialSaves: Record<string, string[]> = {
      'user-1': ['post-2', 'post-3', 'post-12', 'post-26']
    };
    safeSetJSON(STORAGE_KEYS.SAVES, initialSaves);
  }

  // 8. Follows: Record<userId, string[]> (list of userIds they are following)
  if (!localStorage.getItem(STORAGE_KEYS.FOLLOWS)) {
    const initialFollows: Record<string, string[]> = {
      'user-1': ['user-2', 'user-3', 'user-4', 'user-6', 'user-8', 'user-10']
    };
    safeSetJSON(STORAGE_KEYS.FOLLOWS, initialFollows);
  }

  // 9. Notifications
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    safeSetJSON(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  // 10. Messages
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    safeSetJSON(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }

  // 11. Conversations
  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    safeSetJSON(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  }

  // 12. Communities
  if (!localStorage.getItem(STORAGE_KEYS.COMMUNITIES)) {
    safeSetJSON(STORAGE_KEYS.COMMUNITIES, INITIAL_COMMUNITIES);
  }

  // 13. Stories
  if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
    safeSetJSON(STORAGE_KEYS.STORIES, INITIAL_STORIES);
  }

  // 14. Settings
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    safeSetJSON(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
}

export function clearStorage(): void {
  initializeLocalStorage(true);
}

export function exportAllDataAsJSON(): string {
  const backup: Record<string, any> = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    try {
      const raw = localStorage.getItem(key);
      backup[name] = raw ? JSON.parse(raw) : null;
    } catch {
      backup[name] = null;
    }
  });
  return JSON.stringify(backup, null, 2);
}

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });
  return formatter.format(amount);
}

// Standard short count formatter (e.g. 1.2k, 14.8k)
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}

export const formatNumber = formatCount;

// Format relative timestamps
export function formatRelativeTime(dateStr: string): string {
  // If it's already a relative string like "15 minutes ago", return as is
  if (
    dateStr.includes('ago') ||
    dateStr.includes('Yesterday') ||
    dateStr.includes('Just now')
  ) {
    return dateStr;
  }

  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
