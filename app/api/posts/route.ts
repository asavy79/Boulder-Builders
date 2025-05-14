import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { title, content, type } = await request.json();

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from('posts').insert({
        title,
        content,
        type,
        user_id: user.id,
    });

    if (error) {
        return NextResponse.json({ error: "Error adding post" }, { status: 500 });
    }

    return NextResponse.json({ message: "Post added successfully", postData: data }, { status: 200 });

}

export async function GET() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles!inner (
                id,
                first_name,
                last_name
            )
        `);
    if (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
    }
    return NextResponse.json({ posts: data }, { status: 200 });
}