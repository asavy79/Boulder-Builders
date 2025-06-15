import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data, error } = await supabase.from("posts").delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
    }

    return NextResponse.json({}, { status: 200 });

}