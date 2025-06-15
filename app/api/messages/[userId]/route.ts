import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/helpers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    console.log("USER ID: ", userId);

    const supabase = await createClient();

    const user = await getUser(supabase);

    if (!user) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }


    const { data, error } = await supabase.from("messages").select("*").or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`).order("reated_at", { ascending: true });

    if (error) {
        console.log(error);
        return NextResponse.json({ message: "Error fetching messages", error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
