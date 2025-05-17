import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";


export async function POST(request: NextRequest) {

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const sender_id = user.id;
    const { receiver_id, content } = await request.json();


    const { data, error } = await supabase.from("messages").insert({ content, sender_id, receiver_id }).select();

    if (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong when sending the message" }, { status: 500 });
    }

    return NextResponse.json({ data, message: "Message sent!" }, { status: 200 });

}