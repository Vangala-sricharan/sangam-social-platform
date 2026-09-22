import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { CreatePostModal } from '../feed/CreatePostModal';

export const AppLayout: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Mobile Top Header */}
      <TopHeader />

      <div className="flex-1 w-full max-w-7xl mx-auto flex justify-center">
        {/* Left Sidebar (Desktop/Laptop) */}
        <LeftSidebar onOpenCreatePost={() => setIsCreateModalOpen(true)} />

        {/* Center Main Viewport */}
        <main className="flex-1 max-w-2xl w-full min-h-screen border-r border-slate-200/80 dark:border-slate-800/80 pb-20 md:pb-12 bg-white dark:bg-[#0b0f19]">
          <Outlet />
        </main>

        {/* Right Sidebar (Desktop only) */}
        <RightSidebar />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenCreatePost={() => setIsCreateModalOpen(true)} />

      {/* Global Quick Create Post Modal */}
      {isCreateModalOpen && (
        <CreatePostModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
};
