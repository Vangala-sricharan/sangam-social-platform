import React, { useState } from 'react';
import { X, Image as ImageIcon, Hash, Sparkles } from 'lucide-react';
import { Post } from '../../types';
import { useSocial } from '../../context/SocialContext';
import { useToast } from '../common/Toast';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose }) => {
  const { editPost } = useSocial();
  const { showToast } = useToast();

  const [content, setContent] = useState(post.content);
  const [mediaUrl, setMediaUrl] = useState(post.mediaUrl || '');
  const [showImageInput, setShowImageInput] = useState(!!post.mediaUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Post content cannot be empty.', 'error');
      return;
    }

    const success = editPost(post.id, {
      content: content.trim(),
      mediaUrl: mediaUrl.trim() || undefined
    });

    if (success) {
      showToast('Post updated successfully!', 'success');
      onClose();
    } else {
      showToast('Failed to update post.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            Edit Post
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Edit your post content..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none transition-colors"
          />

          {showImageInput ? (
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Image URL (e.g. https://...)"
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  setMediaUrl('');
                  setShowImageInput(false);
                }}
                className="px-2.5 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowImageInput(true)}
              className="self-start flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{mediaUrl ? 'Change image URL' : 'Add image URL'}</span>
            </button>
          )}

          {mediaUrl && (
            <div className="relative rounded-xl overflow-hidden max-h-48 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <img
                src={mediaUrl}
                alt="Preview"
                className="max-h-48 w-full object-cover"
                onError={() => showToast('Image preview failed. Check URL.', 'error')}
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
