import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '@/lib/types/post';
import CommentSection from '@/components/comment-section';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {/* <Image
            src={post.user.avatar_url ? }
            alt={post.user.name}
            width={40}
            height={40}
            className="rounded-full"
          /> */}
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{post.user.name}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at))} ago
            </p>
          </div>
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
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            {post.comments.length} comments
          </button>
          <button className="text-sm text-emerald-600 hover:text-emerald-700">
            Collaborate
          </button>
        </div>
      </div>
      
      {isCommentsOpen && <CommentSection postId={post.id} />}
    </article>
  );
}