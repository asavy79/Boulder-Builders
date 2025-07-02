"use client";
import React, { useState, useEffect } from "react";
import { Comment } from "@/lib/types/post";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useSupabase } from "@/lib/supabase-context";
import CommentCard from "./comment-card";

interface CommentSectionProps {
  postId: string;
  handleCommentAdded: () => void;
  handleCommentDeleted: () => void;
}

export default function CommentSection({
  postId,
  handleCommentAdded,
  handleCommentDeleted,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const { user, loading } = useSupabase();
  const [userId, setUserId] = useState<string | undefined>("");

  useEffect(() => {
    const fetchComments = async () => {
      const result = await fetch(`/api/posts/${postId}/comments`);
      const data = await result.json();
      console.log("Data", data);
      if (!loading && user) {
        setComments(data);
        console.log("USER: ", user);
        setUserId(user?.id);
        console.log(user);
      }
    };
    fetchComments();
  }, [postId]);

  const handleLike = (commentId: string) => {
    setLikedComments((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(commentId)) {
        newLiked.delete(commentId);
      } else {
        newLiked.add(commentId);
      }
      return newLiked;
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        console.error("Error adding comment:", response.statusText);
        return;
      }

      const data = await response.json();
      setComments((prev) => [...prev, data]);
      handleCommentAdded();

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Error adding comment");
      setNewComment("");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/posts/${postId}/comments/?commentId=${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log("An error occurred");
        return;
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment.id != commentId)
        );
        handleCommentDeleted();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Error deleting comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Comment Input */}
      <form onSubmit={handleSubmitComment} className="mb-4">
        <div className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border-green-200 focus:border-green-500 focus:ring-green-500"
          />
          <Button type="submit" variant="auth">
            Post
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {comments && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentCard
                comment={comment}
                likedComments={likedComments}
                handleLike={handleLike}
                deleteComment={deleteComment}
                userId={userId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
