import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from '../components/feed/PostCard';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById } = useSocial();
  const navigate = useNavigate();

  const post = id ? getPostById(id) : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3.5 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
          Post
        </h1>
      </div>

      <div className="flex-1">
        {!post ? (
          <div className="py-20 px-4 text-center text-slate-400">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Post not found
            </h3>
            <p className="text-xs mt-1">This post may have been removed or does not exist.</p>
            <Link
              to="/home"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <PostCard post={post} />
        )}
      </div>
    </div>
  );
};
