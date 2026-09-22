import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ReportCategory } from '../../types';
import { useSocial } from '../../context/SocialContext';
import { useToast } from './Toast';

interface ReportModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: ReportCategory; label: string; desc: string }[] = [
  {
    id: 'spam',
    label: 'Spam or Scam',
    desc: 'Unsolicited advertising, repetitive content, or phishing attempts'
  },
  {
    id: 'harassment',
    label: 'Harassment or Hate Speech',
    desc: 'Abusive language, targeted bullying, or discrimination'
  },
  {
    id: 'misleading',
    label: 'Misleading or False Information',
    desc: 'Fabricated news, impersonation, or deceptive tech claims'
  },
  {
    id: 'other',
    label: 'Other Community Guideline Violation',
    desc: 'Content that breaches SANGAM standards of constructive community'
  }
];

export const ReportModal: React.FC<ReportModalProps> = ({ postId, isOpen, onClose }) => {
  const { reportPost } = useSocial();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      reportPost(postId, selectedCategory, details);
      setIsSubmitting(false);
      showToast('Report submitted for review. Thank you for keeping SANGAM safe.', 'success');
      onClose();
    }, 300);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="report-modal-title" className="font-bold text-base text-slate-900 dark:text-white">
                Report Post
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help us understand what is wrong with this post
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close report modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Reason for reporting
            </label>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedCategory === cat.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportCategory"
                    value={cat.id}
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {cat.label}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                      {cat.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="report-details" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Additional context (optional)
            </label>
            <textarea
              id="report-details"
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any details to help our team review this post..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Flag className="w-3.5 h-3.5" />
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
