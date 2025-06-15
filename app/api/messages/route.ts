import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/helpers";


export async function POST(request: NextRequest) {

    const supabase = await createClient();

    const user = await getUser(supabase);

    if (!user) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const sender_id = user.id;
    const { receiver_id, content } = await request.json();

    const { data: chatData, error: chatError } = await supabase.from("chats").select("*").or(`and(user1_id.eq.${sender_id},user2_id.eq.${receiver_id}),and(user1_id.eq.${receiver_id},user2_id.eq.${sender_id})`).limit(1).select();

    if (chatError) {
        console.log("Error checking for chat! ", chatError);
        return NextResponse.json({ message: "Something went wrong when checking for chat" }, { status: 500 })
    }

    let chatId = ""


    if (chatData.length === 0) {
        const { data: insertChatData, error: insertChatError } = await supabase.from("chats").insert({ user1_id: sender_id, user2_id: receiver_id }).select();
        if (insertChatError) {
            return NextResponse.json({ message: "Something went wrong when adding chat" }, { status: 500 })
        }
        chatId = insertChatData[0].id;
    }
    else {
        chatId = chatData[0].id;
    }

    const { data, error } = await supabase.from("messages").insert({ content: content, sender_id: sender_id, receiver_id: receiver_id }).select();

    if (error) {
        console.log("Supabase error:", error);
        return NextResponse.json({
            message: "Something went wrong when sending the message",
            error: error.message,
            details: error.details,
            hint: error.hint
        }, { status: 500 });
    }

    const { data: updateChatData, error: updateChatError } = await supabase.from("chats").update({ last_message: new Date().toISOString() }).eq("id", chatId);

    if (updateChatError) {
        console.log("An error occurred updating chat! ", updateChatError);
        return NextResponse.json({ message: "Something went wrong when updating recent chat" }, { status: 500 });
    }


    return NextResponse.json({ data, message: "Message sent!" }, { status: 200 });

}

export async function DELETE(request: NextRequest) {
    const supabase = await createClient();

    const { messageId } = await request.json();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { data: deleteMessageData, error: deleteMessageError } = await supabase.from("messages").delete().eq("id", messageId);


    if (deleteMessageError) {
        console.log("An error occurred deleting message! ", deleteMessageError);
        return NextResponse.json({ message: "Something went wrong when deleting message" }, { status: 500 });
    }

    return NextResponse.json({ message: "Message deleted!" }, { status: 200 });
}