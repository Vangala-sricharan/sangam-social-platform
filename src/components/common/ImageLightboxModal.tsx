import React, { useEffect } from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

interface ImageLightboxModalProps {
  imageUrl: string | null;
  caption?: string;
  authorName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  imageUrl,
  caption,
  authorName,
  isOpen,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[92vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:-top-10 sm:right-0 flex items-center gap-2 z-10">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            title="Open original in new tab"
            aria-label="Open original image"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            title="Close (Esc)"
            aria-label="Close image preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Frame */}
        <div className="overflow-hidden rounded-2xl max-h-[80vh] flex items-center justify-center bg-black/40">
          <img
            src={imageUrl}
            alt={caption || 'Post image preview'}
            className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-2xl select-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Metadata Footer */}
        {(authorName || caption) && (
          <div className="mt-3 text-center max-w-2xl px-4 py-2 rounded-xl bg-black/60 text-white/90 text-xs sm:text-sm backdrop-blur-xs">
            {authorName && <span className="font-semibold text-white mr-2">{authorName}:</span>}
            <span className="text-slate-200">{caption}</span>
          </div>
        )}
      </div>
    </div>
  );
};
