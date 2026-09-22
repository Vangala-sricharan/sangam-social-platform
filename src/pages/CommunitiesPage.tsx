import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Check, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { formatCount } from '../utils/storage';

export const CommunitiesPage: React.FC = () => {
  const { communities, toggleJoinCommunity } = useSocial();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Business', 'Education', 'Creative', 'Entertainment', 'Lifestyle'];

  const filteredCommunities = communities.filter((comm) => {
    const matchesSearch =
      comm.name.toLowerCase().includes(search.toLowerCase()) ||
      comm.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || comm.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
            Communities
          </h1>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Search & Categories */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities by topic, skill, or interest..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                {/* Banner */}
                <div className="h-24 w-full overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                  <img
                    src={community.bannerUrl}
                    alt={community.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    {community.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 relative">
                  <img
                    src={community.avatarUrl}
                    alt={community.name}
                    className="w-12 h-12 rounded-xl object-cover -mt-8 mb-2 ring-2 ring-white dark:ring-slate-900 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <Link
                    to={`/community/${community.slug || community.id}`}
                    className="font-heading font-bold text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {community.name}
                  </Link>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {community.description}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                    {community.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 mt-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {formatCount(community.memberCount)} members
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleJoinCommunity(community.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      community.isJoined
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {community.isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Join</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/community/${community.slug || community.id}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="View community"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
