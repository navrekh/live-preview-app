import React, { useState } from 'react';
import { ScreenProps, Post } from '../../types';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, PlusSquare } from 'lucide-react';

const posts: Post[] = [
  { 
    id: '1', 
    author: 'Sarah Wilson', 
    content: 'Just had the most amazing sunset view from the beach! 🌅 Nature never fails to amaze me.',
    likes: 234,
    comments: 18,
    time: '2h ago'
  },
  { 
    id: '2', 
    author: 'Mike Johnson', 
    content: 'Finally finished my new project! So excited to share it with everyone. Stay tuned for the big reveal 🚀',
    likes: 189,
    comments: 42,
    time: '4h ago'
  },
  { 
    id: '3', 
    author: 'Emma Davis', 
    content: 'Coffee and coding - the perfect combination ☕💻 Working on something special today!',
    likes: 156,
    comments: 24,
    time: '6h ago'
  },
];

export function SocialFeedScreen({ theme, onNavigate }: ScreenProps) {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleSave = (id: string) => {
    setSavedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: theme.primary }}>Feed</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('create-post')}>
            <PlusSquare className="w-6 h-6 text-gray-700" />
          </button>
          <button onClick={() => onNavigate('messages')} className="relative">
            <MessageCircle className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Stories */}
      <div className="px-4 py-3 border-b">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {/* Add Story */}
          <button className="flex flex-col items-center shrink-0">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl"
              style={{ backgroundColor: theme.primary }}
            >
              +
            </div>
            <span className="text-[10px] mt-1 text-gray-600">Your Story</span>
          </button>
          
          {/* Other Stories */}
          {['Alex', 'Maria', 'John', 'Lisa', 'David'].map((name, idx) => (
            <button key={name} className="flex flex-col items-center shrink-0">
              <div 
                className="w-14 h-14 rounded-full p-0.5"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              >
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-lg">
                  {['😊', '🎨', '🎸', '📸', '🏃'][idx]}
                </div>
              </div>
              <span className="text-[10px] mt-1 text-gray-600">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto pb-20">
        {posts.map(post => {
          const isLiked = likedPosts.includes(post.id);
          const isSaved = savedPosts.includes(post.id);
          
          return (
            <div key={post.id} className="border-b">
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.time}</p>
                  </div>
                </div>
                <button>
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Post Image */}
              <div 
                className="aspect-square bg-gradient-to-br flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}30)` 
                }}
              >
                <span className="text-6xl">📷</span>
              </div>

              {/* Post Actions */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(post.id)}>
                      <Heart 
                        className="w-6 h-6 transition-all" 
                        style={{ 
                          color: isLiked ? '#ef4444' : '#374151',
                          fill: isLiked ? '#ef4444' : 'none'
                        }}
                      />
                    </button>
                    <button>
                      <MessageCircle className="w-6 h-6 text-gray-700" />
                    </button>
                    <button>
                      <Share2 className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                  <button onClick={() => toggleSave(post.id)}>
                    <Bookmark 
                      className="w-6 h-6" 
                      style={{ 
                        color: isSaved ? theme.primary : '#374151',
                        fill: isSaved ? theme.primary : 'none'
                      }}
                    />
                  </button>
                </div>

                <p className="text-sm font-semibold mb-1">
                  {post.likes + (isLiked ? 1 : 0)} likes
                </p>
                <p className="text-sm">
                  <span className="font-semibold">{post.author.split(' ')[0]}</span>{' '}
                  {post.content}
                </p>
                <button className="text-sm text-gray-500 mt-1">
                  View all {post.comments} comments
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-around">
        {[
          { id: 'home', icon: '🏠', label: 'Home', active: true },
          { id: 'search', icon: '🔍', label: 'Explore' },
          { id: 'create', icon: '➕', label: 'Create' },
          { id: 'activity', icon: '❤️', label: 'Activity' },
          { id: 'profile', icon: '👤', label: 'Profile' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center px-3 py-1 rounded-lg ${item.active ? 'bg-primary/10' : ''}`}
          >
            <span className="text-base">{item.icon}</span>
            <span 
              className="text-[9px] font-medium"
              style={{ color: item.active ? theme.primary : '#6b7280' }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
