import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  Edit3,
  Copy,
  Users,
  Send,
  Flag,
  CornerDownRight,
  X,
  Reply
} from 'lucide-react';
import { Post, Comment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { useToast } from '../common/Toast';
import { formatCount, formatRelativeTime } from '../../utils/storage';
import { EditPostModal } from './EditPostModal';
import { ReportModal } from '../common/ReportModal';
import { ImageLightboxModal } from '../common/ImageLightboxModal';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser, getUserById } = useAuth();
  const {
    isPostLiked,
    toggleLike,
    isPostSaved,
    toggleSave,
    deletePost,
    getPostComments,
    addComment,
    deleteComment,
    toggleCommentLike
  } = useSocial();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const author = getUserById(post.authorId);
  const isLiked = isPostLiked(post.id);
  const isSaved = isPostSaved(post.id);
  const isOwnPost = currentUser?.id === post.authorId;

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isSaveAnimating, setIsSaveAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(null);

  const comments = getPostComments(post.id);
  const isLongContent = post.content.length > 240;

  const handleLike = () => {
    setIsLikeAnimating(true);
    toggleLike(post.id);
    setTimeout(() => setIsLikeAnimating(false), 400);
  };

  const handleSave = () => {
    setIsSaveAnimating(true);
    toggleSave(post.id);
    setTimeout(() => setIsSaveAnimating(false), 400);
    showToast(isSaved ? 'Removed from saved posts' : 'Post saved to your bookmarks!', 'info');
    setShowMoreMenu(false);
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${author?.name || 'SANGAM User'} on SANGAM`,
          text: post.content.slice(0, 100) + '...',
          url: postUrl
        });
        showToast('Shared successfully!', 'success');
        setShowMoreMenu(false);
        return;
      } catch {
        // Fall back to clipboard if cancelled or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(postUrl);
      showToast('Post link copied to clipboard!', 'success');
    } catch {
      showToast('Could not copy link.', 'error');
    }
    setShowMoreMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
      showToast('Post deleted', 'info');
    }
    setShowMoreMenu(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(
      post.id,
      commentText,
      replyingTo?.commentId,
      replyingTo?.username
    );

    setCommentText('');
    setReplyingTo(null);
    showToast(replyingTo ? 'Reply sent!' : 'Comment added!', 'success');
  };

  // Helper to render content with clickable #hashtags and @mentions
  const renderFormattedContent = (text: string) => {
    const displayText = isLongContent && !isExpanded ? text.slice(0, 240) + '...' : text;
    const parts = displayText.split(/(#\w+|@\w+)/g);

    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('#')) {
            const tag = part.substring(1);
            return (
              <Link
                key={index}
                to={`/hashtag/${tag}`}
                onClick={(e) => e.stopPropagation()}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                {part}
              </Link>
            );
          }
          if (part.startsWith('@')) {
            const username = part.substring(1);
            return (
              <Link
                key={index}
                to={`/profile/${username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                {part}
              </Link>
            );
          }
          return part;
        })}
        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline text-xs inline-block"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </>
    );
  };

  if (!author) return null;

  // Separate parent comments and replies
  const parentComments = comments.filter((c) => !c.parentId);
  const getRepliesForComment = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  return (
    <>
      <article
        id={`post-${post.id}`}
        className="border-b border-slate-100 dark:border-slate-800/80 p-4 sm:p-5 hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors"
      >
        {/* Post Header */}
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/profile/${author.username}`}
            className="flex items-center gap-3 group min-w-0"
          >
            <img
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500 transition-all"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {author.name}
                </span>
                {author.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  @{author.username}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {formatRelativeTime(post.createdAt)}
                </span>
                {post.isEdited && (
                  <span className="text-[10px] text-slate-400 italic">(edited)</span>
                )}
              </div>

              {post.communityName && (
                <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                  <Users className="w-3 h-3" />
                  <span>in {post.communityName}</span>
                </div>
              )}
            </div>
          </Link>

          {/* More Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="More post options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-30 animate-in fade-in duration-100">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Link</span>
                </button>

                <button
                  onClick={handleSave}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isSaved ? 'Remove from Saved' : 'Save Post'}</span>
                </button>

                {isOwnPost ? (
                  <>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        setIsEditing(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Edit Post</span>
                    </button>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Post</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        setShowReportModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report Post</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Body Content */}
        <div className="mt-3 text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed whitespace-pre-line pl-0 sm:pl-13">
          {renderFormattedContent(post.content)}
        </div>

        {/* Post Media (Image) */}
        {post.mediaUrl && (
          <div
            onClick={() => setShowLightbox(true)}
            className="mt-3 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 sm:ml-13 bg-slate-100 dark:bg-slate-900 max-h-[460px] flex items-center justify-center cursor-pointer group relative"
          >
            <img
              src={post.mediaUrl}
              alt="Post attachment"
              className="w-full h-full max-h-[460px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
          </div>
        )}

        {/* Post Actions Toolbar */}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100/60 dark:border-slate-800/60 sm:ml-13 text-slate-500 dark:text-slate-400">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold transition-all group ${
              isLiked
                ? 'text-rose-600 dark:text-rose-500'
                : 'hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20'
            }`}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isLiked ? 'fill-current text-rose-500 scale-110' : 'group-hover:scale-110'
              } ${isLikeAnimating ? 'scale-130 text-rose-500 fill-current' : ''}`}
            />
            <span>{post.likesCount > 0 ? formatCount(post.likesCount) : 'Like'}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold transition-all group ${
              showComments
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20'
                : 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20'
            }`}
            aria-label="Comments"
          >
            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{post.commentsCount > 0 ? formatCount(post.commentsCount) : 'Comment'}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all group"
            aria-label="Share post"
          >
            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">
              {post.sharesCount > 0 ? formatCount(post.sharesCount) : 'Share'}
            </span>
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold transition-all group ${
              isSaved
                ? 'text-blue-600 dark:text-blue-400'
                : 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20'
            }`}
            aria-label={isSaved ? 'Remove bookmark' : 'Bookmark post'}
          >
            <Bookmark
              className={`w-4 h-4 transition-transform duration-200 ${
                isSaved ? 'fill-current text-blue-600 dark:text-blue-400' : 'group-hover:scale-110'
              } ${isSaveAnimating ? 'scale-130' : ''}`}
            />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Expandable Comments Drawer */}
        {showComments && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 sm:ml-13 space-y-3 animate-in fade-in duration-150">
            {/* Replying banner */}
            {replyingTo && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs">
                <div className="flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>Replying to <span className="font-semibold">@{replyingTo.username}</span></span>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="p-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* New Comment Input */}
            {currentUser && (
              <form onSubmit={handleAddComment} className="flex items-center gap-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    replyingTo
                      ? `Write a reply to @${replyingTo.username}...`
                      : "Add a constructive comment..."
                  }
                  className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-2 rounded-full bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 transition-colors shrink-0"
                  aria-label="Send comment"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-2 italic text-center">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="space-y-2.5 pt-1">
                {parentComments.map((comment: Comment) => {
                  const commentAuthor = getUserById(comment.authorId);
                  const isOwnComment = currentUser?.id === comment.authorId;
                  const replies = getRepliesForComment(comment.id);
                  const hasLiked = comment.likedBy?.includes(currentUser?.id || '') || false;

                  if (!commentAuthor) return null;

                  return (
                    <div key={comment.id} className="space-y-2">
                      {/* Parent Comment Box */}
                      <div className="flex items-start justify-between gap-2.5 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <Link to={`/profile/${commentAuthor.username}`} className="shrink-0">
                            <img
                              src={commentAuthor.avatar}
                              alt={commentAuthor.name}
                              className="w-7 h-7 rounded-full object-cover mt-0.5"
                              referrerPolicy="no-referrer"
                            />
                          </Link>
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Link
                                to={`/profile/${commentAuthor.username}`}
                                className="font-semibold text-xs text-slate-900 dark:text-white hover:underline"
                              >
                                {commentAuthor.name}
                              </Link>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                @{commentAuthor.username}
                              </span>
                              <span className="text-[10px] text-slate-400">·</span>
                              <span className="text-[10px] text-slate-400">
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                              {comment.content}
                            </p>

                            {/* Comment Action Sub-bar */}
                            <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-500">
                              <button
                                onClick={() => toggleCommentLike(comment.id)}
                                className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                                  hasLiked ? 'text-rose-600 font-semibold' : ''
                                }`}
                              >
                                <Heart
                                  className={`w-3 h-3 ${hasLiked ? 'fill-current text-rose-500' : ''}`}
                                />
                                <span>{comment.likesCount || 0}</span>
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo({
                                    commentId: comment.id,
                                    username: commentAuthor.username
                                  });
                                }}
                                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                              >
                                <Reply className="w-3 h-3" />
                                <span>Reply</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {isOwnComment && (
                          <button
                            onClick={() => {
                              deleteComment(comment.id, post.id);
                              showToast('Comment deleted', 'info');
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                            title="Delete comment"
                            aria-label="Delete comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Nested Replies */}
                      {replies.length > 0 && (
                        <div className="pl-6 space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
                          {replies.map((reply: Comment) => {
                            const replyAuthor = getUserById(reply.authorId);
                            const isOwnReply = currentUser?.id === reply.authorId;
                            const replyLiked = reply.likedBy?.includes(currentUser?.id || '') || false;
                            if (!replyAuthor) return null;

                            return (
                              <div
                                key={reply.id}
                                className="flex items-start justify-between gap-2 bg-slate-50/70 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/40 dark:border-slate-800/40"
                              >
                                <div className="flex items-start gap-2 min-w-0 flex-1">
                                  <Link to={`/profile/${replyAuthor.username}`} className="shrink-0">
                                    <img
                                      src={replyAuthor.avatar}
                                      alt={replyAuthor.name}
                                      className="w-6 h-6 rounded-full object-cover mt-0.5"
                                      referrerPolicy="no-referrer"
                                    />
                                  </Link>
                                  <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <Link
                                        to={`/profile/${replyAuthor.username}`}
                                        className="font-semibold text-xs text-slate-900 dark:text-white hover:underline"
                                      >
                                        {replyAuthor.name}
                                      </Link>
                                      {reply.replyToUsername && (
                                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                                          replied to @{reply.replyToUsername}
                                        </span>
                                      )}
                                      <span className="text-[10px] text-slate-400">·</span>
                                      <span className="text-[10px] text-slate-400">
                                        {formatRelativeTime(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                                      {reply.content}
                                    </p>

                                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                                      <button
                                        onClick={() => toggleCommentLike(reply.id)}
                                        className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                                          replyLiked ? 'text-rose-600 font-semibold' : ''
                                        }`}
                                      >
                                        <Heart
                                          className={`w-3 h-3 ${replyLiked ? 'fill-current text-rose-500' : ''}`}
                                        />
                                        <span>{reply.likesCount || 0}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {isOwnReply && (
                                  <button
                                    onClick={() => {
                                      deleteComment(reply.id, post.id);
                                      showToast('Reply deleted', 'info');
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                                    title="Delete reply"
                                    aria-label="Delete reply"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </article>

      {/* Edit Post Modal */}
      {isEditing && (
        <EditPostModal post={post} onClose={() => setIsEditing(false)} />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          postId={post.id}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Image Lightbox Modal */}
      {showLightbox && post.mediaUrl && (
        <ImageLightboxModal
          imageUrl={post.mediaUrl}
          caption={post.content}
          authorName={author.name}
          isOpen={showLightbox}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </>
  );
};
