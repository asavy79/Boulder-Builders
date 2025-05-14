"use client";
import React, { useState, useEffect } from "react";
import { Comment } from "@/lib/types/post";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Heart, MessageCircle } from "lucide-react";
import { useSupabase } from "@/lib/supabase-context";

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
    setComments((prev) => [...prev, data[0]]);
    handleCommentAdded();

    setNewComment("");
  };

  const deleteComment = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();

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
    }

    setComments((prev) => prev.filter((comment) => comment.id != commentId));
    handleCommentDeleted();
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
      <div className="space-y-2">
        {comments.map((comment) => (
          <Card
            key={comment.id}
            className="border-green-100 hover:border-green-200 transition-colors"
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{comment.content}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1 hover:text-green-600 transition-colors ${
                        likedComments.has(comment.id) ? "text-green-600" : ""
                      }`}
                    >
                      <Heart
                        size={14}
                        className={
                          likedComments.has(comment.id) ? "fill-current" : ""
                        }
                      />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                      <MessageCircle size={14} />
                      <span>Reply</span>
                    </button>
                    <span className="text-xs">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    {comment.user_id === userId && (
                      <button onClick={(e) => deleteComment(e, comment.id)}>
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
