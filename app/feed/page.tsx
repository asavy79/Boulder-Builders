'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PostCard from '@/components/post-card';
import FeedFilter from '@/components/feed-filter';
import { Post } from '@/lib/types/post';

const dummyPost: Post = {
  id: "1",
  title: "My First Boulder Problem",
  content: "Finally sent my project at the local crag! It's a beautiful V5 with a tricky heel hook sequence. Here's what I learned...",
  type: "projects", // or "learnings"
  image_url: "", // optional
  created_at: "2024-03-20T15:30:00Z",
  user: {
    id: "user123",
    name: "Alex Climber",
    avatar_url: "",
  },
  comments: [
    {
      id: "comment1",
      content: "Great send! That heel hook beta sounds crucial.",
      created_at: "2024-03-20T16:00:00Z",
      user_id: "user456",
      post_id: "1"
    },
    {
      id: "comment2",
      content: "I've been working on this one too. Any tips for the start?",
      created_at: "2024-03-20T16:30:00Z",
      user_id: "user789",
      post_id: "1"
    }
  ]
};

function NewPostButton() {
    return (
      <button className="bg-emerald-500 text-white px-6 py-2 rounded-full font-medium hover:bg-emerald-600 transition-colors">
        New Post
      </button>
    );
  }

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([dummyPost]);
  const [filter, setFilter] = useState('all'); // 'all', 'projects', 'learnings'
  const [isLoading, setIsLoading] = useState(true);


  // Initialize Supabase client (move to a separate utility file in production)
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, 
                               process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*, user:users(*), comments(*)')
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(data);
      }
      setIsLoading(false);
    };

    // Set up real-time subscription
    const subscription = supabase
      .channel('posts')
      .on('INSERT', payload => {
        setPosts(current => [payload.new, ...current]);
      })
      .subscribe();

    fetchPosts();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Builder Feed</h1>
          <NewPostButton />
        </div>
        
        <FeedFilter currentFilter={filter} onFilterChange={setFilter} />
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {posts
              .filter(post => filter === 'all' || post.type === filter)
              .map(post => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        )}
      </div>
    </main>
  );
}