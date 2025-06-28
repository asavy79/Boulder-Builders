import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/helpers";

export async function POST(request: NextRequest) {
    const { title, content, type } = await request.json();

    const supabase = await createClient();

    const user = await getUser(supabase);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user_metadata: { first_name, last_name }, id } = user;


    const { data, error } = await supabase.from('posts').insert({
        title,
        content,
        type,
        user_id: user.id,
    }).select();

    if (error) {
        return NextResponse.json({ error: "Error adding post" }, { status: 500 });
    }

    const post = data[0];

    const postData = { ...post, profiles: { first_name, last_name, id: id } }

    return NextResponse.json({ message: "Post added successfully", postData }, { status: 200 });

}

export async function GET() {
    const supabase = await createClient();


    const { data: { user } } = await supabase.auth.getUser()


    if (!user) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }
    const userId = user.id;


    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles!inner (
                id,
                first_name,
                last_name
            ),
            post_likes!left (
                post_id
            )
        `)
        .eq('post_likes.user_id', userId);

    if (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
    }

    const postsWithLikedFlag = data.map(post => ({
        ...post,
        liked: post.post_likes && post.post_likes.length > 0
    }));

    return NextResponse.json({ posts: postsWithLikedFlag }, { status: 200 });
}