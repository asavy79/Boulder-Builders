import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id);

    if (error) {
        return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
    }


    return NextResponse.json(data, { status: 200 });

}


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
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

    return NextResponse.json(data, { status: 200 });

}

export async function DELETE(request: NextRequest, {params}: {params: {commentId: string}}) {

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId")
    console.log("Comment ID: ", commentId);

    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if(!user) {
        return NextResponse.json({error: "User not authorized"}, {status: 500});
    }

    const {data, error} = await supabase.from('comments').delete().eq('id', commentId);
    console.log(error);

    if(error) {
        return NextResponse.json({error}, {status: 500});
    }

    return NextResponse.json(data, {status: 200});
}