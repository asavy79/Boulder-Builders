export interface Post {
    id: string;
    title: string;
    content: string;
    type: string;
    image_url?: string;
    created_at: string;
    user: {
        id: string;
        name: string;
        avatar_url: string;
    };
    comments: Comment[];
}

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    post_id: string;
}