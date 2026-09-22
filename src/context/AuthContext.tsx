import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { STORAGE_KEYS, safeGetJSON, safeSetJSON } from '../utils/storage';

interface AuthSession {
  userId: string;
  username: string;
  isAuthenticated: boolean;
  token?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, username: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  demoLogin: (username?: string) => void;
  loginAsDemoUser: (targetIdOrUsername: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  users: User[];
  getUserById: (id: string) => User | undefined;
  getUserByUsername: (username: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => safeGetJSON<User[]>(STORAGE_KEYS.USERS, []));
  const [session, setSession] = useState<AuthSession | null>(() =>
    safeGetJSON<AuthSession | null>(STORAGE_KEYS.SESSION, null)
  );

  // Sync users if localStorage changes or updates
  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.USERS, users);
  }, [users]);

  // Derived current user
  const currentUser: User | null = React.useMemo(() => {
    if (!session || !session.isAuthenticated) return null;
    return users.find((u) => u.id === session.userId || u.username === session.username) || null;
  }, [session, users]);

  const login = async (usernameOrEmail: string): Promise<{ success: boolean; error?: string }> => {
    const cleanInput = usernameOrEmail.trim().toLowerCase().replace('@', '');
    const foundUser = users.find(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        u.email.toLowerCase() === cleanInput
    );

    if (!foundUser) {
      return { success: false, error: 'User not found. Try demo login or register a new account.' };
    }

    const newSession: AuthSession = {
      userId: foundUser.id,
      username: foundUser.username,
      isAuthenticated: true,
      token: 'session-' + Date.now()
    };
    safeSetJSON(STORAGE_KEYS.SESSION, newSession);
    setSession(newSession);
    return { success: true };
  };

  const register = async (
    name: string,
    username: string,
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanUsername = username.trim().toLowerCase().replace('@', '');
    if (!cleanUsername || !name.trim() || !email.trim()) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const existing = users.find(
      (u) => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existing) {
      return { success: false, error: 'Username or email already in use.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      username: cleanUsername,
      email: email.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      bio: `Hello! I just joined SANGAM to connect and share ideas.`,
      location: 'India',
      role: 'member',
      joinedDate: 'Just now',
      followersCount: 0,
      followingCount: 3,
      isVerified: false,
      mutualFollowers: []
    };

    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    safeSetJSON(STORAGE_KEYS.USERS, updatedUsers);

    const newSession: AuthSession = {
      userId: newUser.id,
      username: newUser.username,
      isAuthenticated: true,
      token: 'session-' + Date.now()
    };
    safeSetJSON(STORAGE_KEYS.SESSION, newSession);
    setSession(newSession);

    return { success: true };
  };

  const logout = () => {
    const emptySession: AuthSession = {
      userId: '',
      username: '',
      isAuthenticated: false
    };
    safeSetJSON(STORAGE_KEYS.SESSION, emptySession);
    setSession(emptySession);
  };

  const demoLogin = (targetUsername = 'arjun_sharma') => {
    const user = users.find((u) => u.username === targetUsername) || users[0];
    if (user) {
      const newSession: AuthSession = {
        userId: user.id,
        username: user.username,
        isAuthenticated: true,
        token: 'session-demo-' + Date.now()
      };
      safeSetJSON(STORAGE_KEYS.SESSION, newSession);
      setSession(newSession);
    }
  };

  const loginAsDemoUser = (targetIdOrUsername: string) => {
    const user =
      users.find((u) => u.id === targetIdOrUsername || u.username === targetIdOrUsername) ||
      users[0];
    if (user) {
      const newSession: AuthSession = {
        userId: user.id,
        username: user.username,
        isAuthenticated: true,
        token: 'session-demo-' + Date.now()
      };
      safeSetJSON(STORAGE_KEYS.SESSION, newSession);
      setSession(newSession);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setUsers((prevUsers) => {
      const next = prevUsers.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u));
      safeSetJSON(STORAGE_KEYS.USERS, next);
      return next;
    });
  };

  const getUserById = (id: string) => users.find((u) => u.id === id);
  const getUserByUsername = (username: string) =>
    users.find((u) => u.username.toLowerCase() === username.toLowerCase().replace('@', ''));

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!session?.isAuthenticated,
        login,
        register,
        logout,
        demoLogin,
        loginAsDemoUser,
        updateProfile,
        users,
        getUserById,
        getUserByUsername
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
