import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (
        id,
        first_name,
        last_name
      )
    `)
    .eq('post_id', id);

    console.log(data);

    if (error) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
    }


    return NextResponse.json(data, { status: 200 });

}

// { params }: { params: Promise<{ userId: string }> }

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log("ID: ", id);
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();


    // First fetch the current post data
    const { data: currentPost, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();


    if (fetchError) {
        console.error("Error fetching post", fetchError);
        return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
    }


    const { data, error } = await supabase
        .from('comments')
        .insert({ post_id: id, user_id: user.data.user?.id, content }).select();


    if (error) {
        console.error("Error adding comment", error);
        return NextResponse.json({ error: "Error adding comment" }, { status: 500 });
    }

    return NextResponse.json({...data[0], profiles: {id: user?.data?.user?.id, first_name: user?.data?.user?.user_metadata?.first_name, last_name: user?.data?.user?.user_metadata?.last_name}}, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const commentId = request.nextUrl.searchParams.get('commentId');
    console.log("Comment ID: ", commentId);

    if (!commentId) {
        return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "User not authorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from('comments').delete().eq('id', commentId);

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
}