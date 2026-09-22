import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
  ShieldCheck,
  Smile,
  CheckCheck,
  Sparkles
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { useAuth } from '../context/AuthContext';
import { Conversation, Message } from '../../src/types';
import { formatRelativeTime } from '../utils/storage';

export const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const withUserId = searchParams.get('with');

  const { currentUser, getUserById, users } = useAuth();
  const {
    conversations,
    startOrGetConversation,
    sendMessage,
    markConversationAsRead,
    getConversationMessages
  } = useSocial();

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If `?with=userId` is provided in query params, open/create that conversation
  useEffect(() => {
    if (withUserId && currentUser && withUserId !== currentUser.id) {
      const conv = startOrGetConversation(withUserId);
      setActiveConvId(conv.id);
    } else if (!activeConvId && conversations.length > 0) {
      // Default to first conversation on desktop
      setActiveConvId(conversations[0].id);
    }
  }, [withUserId, currentUser, conversations, startOrGetConversation, activeConvId]);

  // Mark conversation read on selection
  useEffect(() => {
    if (activeConvId) {
      markConversationAsRead(activeConvId);
    }
  }, [activeConvId, markConversationAsRead]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const otherParticipantId = activeConversation?.participantIds.find(
    (id: string) => id !== currentUser?.id
  );
  const recipient = otherParticipantId ? getUserById(otherParticipantId) : null;

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const otherId = c.participantIds.find((id: string) => id !== currentUser?.id);
    const u = otherId ? getUserById(otherId) : null;
    if (!u) return false;
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || !recipient) return;

    sendMessage(activeConvId, inputText.trim(), recipient.id);
    setInputText('');
  };

  const handleSelectNewChatUser = (userId: string) => {
    const conv = startOrGetConversation(userId);
    setActiveConvId(conv.id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen">
      {/* Header */}
      <div className="bg-white/90 dark:bg-[#0b0f19]/90 border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
            Messages
          </h1>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col bg-white dark:bg-[#0b0f19] ${
            activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search Contacts */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Quick Chat suggestions */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                Direct:
              </span>
              {users
                .filter((u) => u.id !== currentUser?.id)
                .slice(0, 5)
                .map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectNewChatUser(u.id)}
                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 pr-2 transition-colors"
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {u.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
                No conversations found. Pick a creator above to start chatting!
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const otherId = conv.participantIds.find((id: string) => id !== currentUser?.id);
                const user = otherId ? getUserById(otherId) : null;
                if (!user) return null;

                const isSelected = conv.id === activeConvId;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 border-l-3 border-blue-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-11 h-11 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0b0f19]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {user.name}
                          </span>
                          {user.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-1">
                          {formatRelativeTime(conv.updatedAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {conv.lastMessage || 'Start a conversation'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation */}
        <div
          className={`flex-1 flex flex-col bg-slate-50/40 dark:bg-[#090d16] ${
            !activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation && recipient ? (
            <>
              {/* Active Chat Header */}
              <div className="p-3 sm:p-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <img
                    src={recipient.avatar}
                    alt={recipient.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {recipient.name}
                      </span>
                      {recipient.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-500 font-medium">
                      Active on SANGAM
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Bubbles History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(() => {
                  const activeMessages = getConversationMessages(activeConversation.id);
                  if (activeMessages.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-2">
                        <Sparkles className="w-8 h-8 text-blue-500/40" />
                        <p className="text-sm font-medium">Say namaste to {recipient.name}!</p>
                        <span className="text-xs">Connect, share ideas, or start collaborating.</span>
                      </div>
                    );
                  }
                  return activeMessages.map((msg: Message) => {
                    const isOwn = msg.senderId === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm ${
                            isOwn
                              ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {formatRelativeTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  });
                })()}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${recipient.name}...`}
                  className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors shrink-0 shadow-xs"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Select a conversation
              </h3>
              <p className="text-xs sm:text-sm mt-1 max-w-xs">
                Pick a direct message thread from the left or connect with creators on SANGAM.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
