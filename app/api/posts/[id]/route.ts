import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    console.log(id);

    const { data, error } = await supabase.from("posts").delete().eq('id', id);


    if (error) {
        return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
    }

    console.log(data);
    return NextResponse.json({}, { status: 200 });

}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();

    const { id } = await params;
    console.log(id);



    const { data: { user } } = await supabase.auth.getUser();

    const { title, content, type } = await request.json();
    console.log({ title, content, type });


    console.log(user);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("posts").update({ title, content, type }).eq('id', id);

    if (error) {
        console.log(error);
        return NextResponse.json({ error: "Error updating post" }, { status: 500 });
    }

    return NextResponse.json({ message: "Post updated successfully" }, { status: 200 });
}