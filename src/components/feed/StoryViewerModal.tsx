import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart, ShieldCheck } from 'lucide-react';
import { Story, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { useToast } from '../common/Toast';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  onClose
}) => {
  const { getUserById, currentUser } = useAuth();
  const { markStoryViewed, sendMessage, startOrGetConversation } = useSocial();
  const { showToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');

  const currentStory = stories[currentIndex];
  const author = currentStory ? getUserById(currentStory.authorId) : null;

  // Mark viewed
  useEffect(() => {
    if (currentStory) {
      markStoryViewed(currentStory.id);
    }
  }, [currentStory, markStoryViewed]);

  // Story Progress Timer
  useEffect(() => {
    if (isPaused || !currentStory) return;

    const DURATION = 5000; // 5 seconds per story
    const INTERVAL = 50;
    const increment = (INTERVAL / DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Go to next story or close
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + increment;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, stories.length, onClose, currentStory]);

  // Reset progress on story change
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex < stories.length - 1) {
        setCurrentIndex((idx) => idx + 1);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((idx) => idx - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentUser || !author) return;

    const conv = startOrGetConversation(author.id);
    sendMessage(conv.id, `Replied to your story: "${replyText.trim()}"`, author.id);
    setReplyText('');
    showToast(`Reply sent to ${author.name}!`, 'success');
  };

  const handleSendHeart = () => {
    if (!currentUser || !author) return;
    const conv = startOrGetConversation(author.id);
    sendMessage(conv.id, '❤️ Reacted to your story', author.id);
    showToast(`Sent ❤️ to ${author.name}!`, 'success');
  };

  if (!currentStory || !author) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev / Next controls */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden sm:flex absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white z-40 transition-colors"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden sm:flex absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white z-40 transition-colors"
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Stage Container */}
      <div
        className="relative w-full max-w-md h-full max-h-[85vh] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between bg-slate-950"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Image */}
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.caption || 'Story'}
          className="absolute inset-0 w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />

        {/* Top Progress Bars */}
        <div className="relative z-10 px-4 pt-4 flex gap-1.5">
          {stories.map((s, idx) => (
            <div
              key={s.id}
              className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="relative z-10 px-4 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-white drop-shadow-xs">
                  {author.name}
                </span>
                {author.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                )}
              </div>
              <span className="text-[11px] text-white/70 drop-shadow-xs">
                {currentStory.createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* Tap areas for mobile story jump */}
        <div className="absolute inset-0 z-0 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom Area: Caption & Reply */}
        <div className="relative z-10 p-4 space-y-3">
          {currentStory.caption && (
            <p className="text-white text-sm sm:text-base font-medium drop-shadow-md bg-black/40 backdrop-blur-xs p-3 rounded-2xl border border-white/10 leading-relaxed">
              {currentStory.caption}
            </p>
          )}

          {currentUser?.id !== author.id && (
            <form onSubmit={handleSendReply} className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${author.name}...`}
                className="flex-1 bg-white/20 hover:bg-white/25 focus:bg-white/30 text-white placeholder-white/70 text-xs sm:text-sm px-4 py-2.5 rounded-full border border-white/30 focus:border-white focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleSendHeart}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-rose-400 transition-colors"
                aria-label="Send love reaction"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors"
                aria-label="Send reply"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
