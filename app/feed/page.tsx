"use client";

import { useState, useEffect } from "react";
import PostCard from "@/components/post-card";
import FeedFilter from "@/components/feed-filter";
import { Post } from "@/lib/types/post";
import AddPostForm from "./add-post-form";

function NewPostButton({ onClick }: { onClick: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onClick(true)}
      className="bg-emerald-500 text-white px-6 py-2 rounded-full font-medium hover:bg-emerald-600 transition-colors"
    >
      New Post
    </button>
  );
}

export default function Feed() {
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleDeletedPost = async (postId: string) => {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return;
    }

    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleAddedPost = (post: Post) => {
    setPosts((prevPosts) => [...prevPosts, post]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Error fetching posts:", response.statusText);
        return;
      }

      const data = await response.json();
      setPosts(data.posts);
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Builder Feed</h1>
          <NewPostButton onClick={() => setShowAddPostForm(true)} />
        </div>

        {showAddPostForm && (
          <AddPostForm
            handleAddedPost={handleAddedPost}
            onClose={() => setShowAddPostForm(false)}
          />
        )}

        <FeedFilter currentFilter={filter} onFilterChange={setFilter} />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {posts
              .filter((post) => filter === "all" || post.type === filter)
              .map((post) => (
                <PostCard
                  key={post.id}
                  initialPost={post}
                  handleDeletedPost={handleDeletedPost}
                />
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
