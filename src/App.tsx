import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocialProvider } from './context/SocialContext';
import { ToastProvider } from './components/common/Toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { TrendingPage } from './pages/TrendingPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { CommunityDetailPage } from './pages/CommunityDetailPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { SearchPage } from './pages/SearchPage';
import { HashtagPage } from './pages/HashtagPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CommandPalette } from './components/common/CommandPalette';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <SocialProvider>
              <CommandPalette />
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Core App Layout with Protected Authentication */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/home" replace />} />
                  <Route path="home" element={<HomePage />} />
                  <Route path="explore" element={<ExplorePage />} />
                  <Route path="trending" element={<TrendingPage />} />
                  <Route path="communities" element={<CommunitiesPage />} />
                  <Route path="community/:id" element={<CommunityDetailPage />} />
                  <Route path="messages" element={<MessagesPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="create" element={<CreatePostPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="hashtag/:tag" element={<HashtagPage />} />
                  <Route path="post/:id" element={<PostDetailPage />} />
                  <Route path="profile/:username" element={<ProfilePage />} />
                  <Route path="profile/:username/media" element={<ProfilePage />} />
                  <Route path="profile/:username/saved" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="settings/:section" element={<SettingsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </SocialProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
