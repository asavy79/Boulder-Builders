import { Post } from "@/lib/types/post";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { X, Save, Edit3 } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface PostEditCardProps {
    post: Post;
    handleUpdatePost: (post: Post) => Promise<void>;
    onCancel?: () => void;
}

// Custom Textarea component
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

// Category options
const categoryOptions = [
    { value: "Learnings", label: "Learnings" },
    { value: "Projects", label: "Projects" },
];

export default function PostEditCard({ post, handleUpdatePost, onCancel }: PostEditCardProps) {
    const [postTitle, setPostTitle] = useState(post.title);
    const [postContent, setPostContent] = useState(post.content);
    const [postType, setPostType] = useState(post.type);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await handleUpdatePost({ 
                ...post, 
                title: postTitle,
                content: postContent,
                type: postType 
            });
        } catch (error) {
            console.error('Error updating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setPostTitle(post.title); // Reset to original title
        setPostContent(post.content); // Reset to original content
        setPostType(post.type); // Reset to original type
        onCancel?.();
    };

    const isFormValid = postTitle.trim() !== '' && postContent.trim() !== '' && postType.trim() !== '';

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <Edit3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Edit Post
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Update your post details below
                            </p>
                        </div>
                    </div>
                    {onCancel && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancel}
                            className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <label htmlFor="post-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Post Title *
                        </label>
                        <Input
                            id="post-title"
                            value={postTitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostTitle(e.target.value)}
                            placeholder="Enter a compelling title..."
                            className="border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
                            maxLength={100}
                        />
                        <div className="flex justify-end text-xs text-gray-500 dark:text-gray-400">
                            <span>{postTitle.length}/100 characters</span>
                        </div>
                    </div>

                    {/* Category Field */}
                    <div className="space-y-2">
                        <label htmlFor="post-category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category *
                        </label>
                        <select
                            id="post-category"
                            value={postType}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPostType(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-background px-3 py-2 text-sm ring-offset-background focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                        >
                            <option value="">Select a category</option>
                            {categoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Content Field */}
                    <div className="space-y-2">
                        <label htmlFor="post-content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Post Content *
                        </label>
                        <Textarea
                            id="post-content"
                            value={postContent}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPostContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="min-h-[150px] border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
                        />
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>Share your climbing experience, tips, or questions</span>
                            <span>{postContent.length} characters</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="px-6"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isFormValid}
                            className="px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Save className="h-4 w-4" />
                                    <span>Save Changes</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}