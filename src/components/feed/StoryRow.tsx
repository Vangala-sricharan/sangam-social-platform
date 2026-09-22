import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Story } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { StoryViewerModal } from './StoryViewerModal';
import { useToast } from '../common/Toast';

export const StoryRow: React.FC = () => {
  const { currentUser, getUserById } = useAuth();
  const { stories, createStory } = useSocial();
  const { showToast } = useToast();

  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const [storyCaption, setStoryCaption] = useState('');

  if (!currentUser) return null;

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyImageUrl.trim()) {
      showToast('Please provide an image URL for your story.', 'error');
      return;
    }

    createStory(storyImageUrl.trim(), storyCaption.trim() || undefined);
    setStoryImageUrl('');
    setStoryCaption('');
    setShowAddStoryModal(false);
    showToast('Story added successfully!', 'success');
  };

  return (
    <>
      <div className="p-3 sm:p-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] overflow-x-auto select-none">
        <div className="flex items-center gap-3.5 min-w-max">
          {/* Your Story item */}
          <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div
              onClick={() => setShowAddStoryModal(true)}
              className="relative w-15 h-15 rounded-full p-0.5 bg-slate-200 dark:bg-slate-700 hover:scale-105 transition-transform"
            >
              <img
                src={currentUser.avatar}
                alt="Your story"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate max-w-[64px]">
              Your Story
            </span>
          </div>

          {/* Creators Stories */}
          {stories.map((story, index) => {
            const author = getUserById(story.authorId);
            if (!author) return null;

            return (
              <div
                key={story.id}
                onClick={() => setActiveStoryIndex(index)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div
                  className={`w-15 h-15 rounded-full p-0.5 transition-all duration-200 group-hover:scale-105 ${
                    story.isViewed
                      ? 'bg-slate-300 dark:bg-slate-700'
                      : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-blue-600'
                  }`}
                >
                  <div className="w-full h-full rounded-full p-0.5 bg-white dark:bg-slate-900">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate max-w-[64px]">
                  {author.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}

      {/* Add Story Modal */}
      {showAddStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-3">
              Add to Your Story
            </h3>

            <form onSubmit={handleCreateStory} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={storyImageUrl}
                  onChange={(e) => setStoryImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setStoryImageUrl(
                      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
                    )
                  }
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Preset: Laptop Setup
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStoryImageUrl(
                      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
                    )
                  }
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Preset: Mountain View
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  placeholder="Share what you're doing right now..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStoryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Share Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
