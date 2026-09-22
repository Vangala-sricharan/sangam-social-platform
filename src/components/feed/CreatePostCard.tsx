import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Smile,
  Hash,
  Eye,
  Send,
  X,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { useToast } from '../common/Toast';

const DEMO_IMAGES = [
  { label: 'Code & Setup', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Architecture', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Nature/Himalayas', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Mumbai Marine Drive', url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Campus Hackathon', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80' },
  { label: 'AI/Tech Concept', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80' }
];

const QUICK_HASHTAGS = ['WebDevelopment', 'React', 'AI', 'Startups', 'India', 'Design'];
const QUICK_EMOJIS = ['🚀', '💡', '💻', '☕', '🇮🇳', '📈', '🎨', '✨', '🔥'];

interface CreatePostCardProps {
  onSuccess?: () => void;
  defaultCommunityId?: string;
  isCompact?: boolean;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({
  onSuccess,
  defaultCommunityId,
  isCompact = false
}) => {
  const { currentUser } = useAuth();
  const { createPost, communities } = useSocial();
  const { showToast } = useToast();

  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(defaultCommunityId || '');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!currentUser) return null;

  const handleAddHashtag = (tag: string) => {
    const formatted = `#${tag} `;
    if (!content.includes(`#${tag}`)) {
      setContent((prev) => (prev.endsWith(' ') || prev === '' ? prev + formatted : prev + ' ' + formatted));
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Please write something before publishing.', 'error');
      return;
    }

    try {
      createPost({
        content: content.trim(),
        mediaUrl: mediaUrl.trim() || undefined,
        communityId: selectedCommunity || undefined
      });

      setContent('');
      setMediaUrl('');
      setShowImagePicker(false);
      setShowPreview(false);
      showToast('Post published to SANGAM!', 'success');

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      showToast('Could not publish post. Please try again.', 'error');
    }
  };

  return (
    <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19]">
      <form onSubmit={handlePublish} className="flex flex-col gap-3">
        {/* User avatar + textarea row */}
        <div className="flex items-start gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
            referrerPolicy="no-referrer"
          />

          <div className="flex-1 min-w-0">
            {/* Optional Community selector */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Posting as <span className="text-blue-600 dark:text-blue-400">@{currentUser.username}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Public Feed</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    Community: {c.name}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening in tech, ideas, or projects? Connect & share..."
              rows={isCompact ? 3 : 4}
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Media Preview if attached */}
        {mediaUrl && (
          <div className="relative rounded-2xl overflow-hidden max-h-64 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 ml-0 sm:ml-13 group">
            <img
              src={mediaUrl}
              alt="Attachment preview"
              className="w-full h-full max-h-64 object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => setMediaUrl('')}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live Preview Pane */}
        {showPreview && content.trim() && (
          <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 ml-0 sm:ml-13 text-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Post Preview</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line text-sm">
              {content}
            </p>
          </div>
        )}

        {/* Image Picker Drawer */}
        {showImagePicker && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 ml-0 sm:ml-13 space-y-2.5 animate-in fade-in duration-100">
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Paste custom image URL (e.g. Unsplash, CDN...)"
                className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowImagePicker(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2"
              >
                Done
              </button>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                Or select demo visual asset:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_IMAGES.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setMediaUrl(img.url)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      mediaUrl === img.url
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Emoji Quick Picker */}
        {showEmojiPicker && (
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 ml-0 sm:ml-13 overflow-x-auto">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleAddEmoji(emoji)}
                className="text-lg p-1 hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Quick Hashtag suggestions */}
        <div className="flex items-center gap-1.5 flex-wrap ml-0 sm:ml-13 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-0.5">
            <Hash className="w-3 h-3" />
            <span>Tags:</span>
          </span>
          {QUICK_HASHTAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddHashtag(tag)}
              className="text-xs px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 text-slate-600 dark:text-slate-400 font-medium transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Toolbar & Publish */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 ml-0 sm:ml-13">
          <div className="flex items-center gap-1 sm:gap-2 text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setShowImagePicker(!showImagePicker)}
              className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                mediaUrl ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
              title="Add Image"
              aria-label="Add image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Add Emoji"
              aria-label="Add emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                showPreview ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
              title="Toggle Live Preview"
              aria-label="Toggle preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs ${
                content.length > 280 ? 'text-amber-500 font-bold' : 'text-slate-400'
              }`}
            >
              {content.length}/500
            </span>

            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
