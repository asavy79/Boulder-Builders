interface CommentSectionProps {
    postId: string;
  }
  
  export default function CommentSection({ postId }: CommentSectionProps) {
    return (
      <div className="p-6 border-t border-gray-100">
        {/* Add your comment section implementation here */}
        <p>Comments for post {postId}</p>
      </div>
    );
  }