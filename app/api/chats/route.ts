import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    const userId = user.id;

    const { data, error } = await supabase.from("chats").select("*").or(`user1_id.eq.${userId},user2_id.eq.${userId}`).select();

    if (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while fetching chats!" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
}