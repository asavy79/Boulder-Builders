import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {

    const supabase = await createClient();


    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;

    const userId = user.id;

    const { data, error } = await supabase.from("post_likes").insert({ user_id: userId, post_id: id });

    console.log(error);

    if (error) {
        return NextResponse.json({ message: "An error occurred when liking post" }, { status: 500 });
    }

    return NextResponse.json({ message: "Like successfully added" }, { status: 200 });

}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {


    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = user.id;

    const { data, error } = await supabase.from("post_likes").delete().match({ user_id: userId, post_id: id });

    console.log(error);

    if (error) {
        return NextResponse.json({ message: "Failed to delete comment" }, { status: 500 });
    }
    return NextResponse.json({ message: "Like successfully deleted" }, { status: 200 })

}