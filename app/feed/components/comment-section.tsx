"use client";
import React, { useState, useEffect } from "react";
import { Comment } from "@/lib/types/post";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import { useSupabase } from "@/lib/supabase-context";
import Link from "next/link";

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
    }
    else {
      setComments((prev) => prev.filter((comment) => comment.id != commentId));
      handleCommentDeleted();
    }

  } catch(error) {
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
            <Card
              key={comment.id}
              className="border-green-100 hover:border-green-200 transition-all duration-200 hover:shadow-md bg-white"
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {comment.profiles.first_name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {/* make this a link to the user's profile */}
                      <Link href={`/profile/${comment.profiles.id}`}>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {comment.profiles.first_name}{" "}
                        {comment.profiles.last_name}
                      </h4>
                      </Link>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <p className="text-sm text-gray-800 leading-relaxed mb-3">
                      {comment.content}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                          likedComments.has(comment.id)
                            ? "text-green-600 bg-green-50 hover:bg-green-100"
                            : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                        }`}
                      >
                        <Heart
                          size={14}
                          className={`transition-all duration-200 ${
                            likedComments.has(comment.id) ? "fill-current" : ""
                          }`}
                        />
                        <span>Like</span>
                      </button>

                      <button className="flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200">
                        <MessageCircle size={14} />
                        <span>Reply</span>
                      </button>

                      {comment.user_id === userId && (
                        <button
                          onClick={(e) => deleteComment(e, comment.id)}
                          className="ml-auto p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                          aria-label="Delete comment"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
