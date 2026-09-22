import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { CreatePostCard } from './CreatePostCard';

interface CreatePostModalProps {
  onClose: () => void;
  defaultCommunityId?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, defaultCommunityId }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0b0f19] w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Create New Post
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CreatePostCard
          onSuccess={onClose}
          defaultCommunityId={defaultCommunityId}
          isCompact={false}
        />
      </div>
    </div>
  );
};
