import { Card, CardContent } from "@/components/ui/card";
import { Comment } from "@/lib/types/post";
import { Heart } from "lucide-react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface CommentCardProps {
  comment: Comment;
  likedComments: Set<string>;
  handleLike: (commentId: string) => void;
  deleteComment: (event: React.FormEvent, commentId: string) => void;
  userId: string | undefined;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CommentCard({
  comment,
  likedComments,
  handleLike,
  deleteComment,
  userId,
}: CommentCardProps) {
  return (
    <Card className="border-green-100 hover:border-green-200 transition-all duration-200 hover:shadow-md bg-white">
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
                  {comment.profiles.first_name} {comment.profiles.last_name}
                </h4>
              </Link>
              <span className="text-xs text-gray-500">
                {formatDate(comment.created_at)}
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
  );
}
