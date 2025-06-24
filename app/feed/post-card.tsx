import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/types/post";
import CommentSection from "@/components/comment-section";
import { useSupabase } from "@/lib/supabase-context";
import { Heart, Edit3, X } from "lucide-react";
import PostEditCard from "./post-edit-card";

interface PostCardProps {
  initialPost: Post;
  handleDeletedPost: (postId: string) => void;
}

export default function PostCard({
  initialPost,
  handleDeletedPost,
}: PostCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(initialPost.liked);
  const [isEditing, setIsEditing] = useState(false);
  const { user, loading } = useSupabase();

  const handleCommentAdded = () => {
    setPost((prev_post) => ({
      ...prev_post,
      comment_count: prev_post.comment_count + 1,
    }));
  };

  const handleCommentDeleted = () => {
    setPost((prev_post) => ({
      ...prev_post,
      comment_count: prev_post.comment_count - 1,
    }));
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedPost),
        headers: {
          "Content-Type": "application/json",
        },
      });
      

      if (!response.ok) {
        console.log("Failed to update post");
        setIsEditing(false);
        return;
      }

      setPost(updatedPost);

    } catch (error) {
      console.error("Error updating post:", error);
    }
   
    setIsEditing(false);
  };

  const handleLike = async () => {
    if (!user) return;

    const optimisticLiked = !isLiked;

    setIsLiked(optimisticLiked);

    setPost((prev_post) => ({
      ...prev_post,
      like_count: isLiked ? prev_post.like_count - 1 : prev_post.like_count + 1,
    }));

    const prevPostLikeCount = post.like_count;

    try {
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(`/api/posts/${post.id}/likes`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("Failed to react to post");
        setIsLiked(!optimisticLiked);
        setPost((prev_post) => ({
          ...prev_post,
          like_count: prevPostLikeCount,
        }));
        return;
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  if (isEditing) {
    return (
      <div className="mb-6">
        <PostEditCard
          post={post}
          handleUpdatePost={handleUpdatePost}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {/* <Image
              src={post.user.avatar_url ? }
              alt={post.user.name}
              width={40}
              height={40}
              className="rounded-full"
            /> */}
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">
                <a href={`/profile/${post.profiles.id}`}>
                  {post.profiles.first_name} {post.profiles.last_name}
                </a>
              </h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_at))} ago
              </p>
            </div>
          </div>
          
          {/* Post actions for owner */}
          {post.profiles.id === user?.id && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit post"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => handleDeletedPost(post.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete post"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700">{post.content}</p>

        {post.image_url && (
          <div className="mt-4">
            <Image
              src={post.image_url}
              alt="Post attachment"
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>
        )}

        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm transition-colors ${
              isLiked
                ? "text-emerald-600 hover:text-emerald-700"
                : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <Heart size={18} className={isLiked ? "fill-current" : ""} />
            <span>{post.like_count} likes</span>
          </button>
          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            {post.comment_count} comments
          </button>
          <button className="text-sm text-emerald-600 hover:text-emerald-700">
            Collaborate
          </button>
        </div>
      </div>

      {isCommentsOpen && (
        <CommentSection
          postId={post.id}
          handleCommentAdded={handleCommentAdded}
          handleCommentDeleted={handleCommentDeleted}
        />
      )}
    </article>
  );
}
