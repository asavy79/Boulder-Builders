export interface Post {
    id: string;
    title: string;
    content: string;
    type: string;
    image_url?: string;
    created_at: string;
    profiles: {
        id: string;
        first_name: string;
        last_name: string;
    };
    comment_count: number,
    like_count: number,
    liked: boolean,
}

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    post_id: string;
    parent_id: string | null;
    profiles: {
        id: string,
        last_name: string,
        first_name: string
    }
}