import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    const userId = user.id;

    const { data, error } = await supabase.from("chats").select("*").or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while fetching chats!" }, { status: 500 });
    }

    // Get all unique user IDs from both user1_id and user2_id
    const userIds = Array.from(new Set(data.flatMap(chat => [chat.user1_id, chat.user2_id])));

    const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

    if (usersError) {
        console.log(usersError);
        return NextResponse.json({ message: "An error occurred while fetching users!" }, { status: 500 });
    }

    const userMap = new Map(users.map(user => [user.id, user]));

    const transformedData = data.map(chat => {
        const isUser1 = chat.user1_id === userId;
        const otherUser = isUser1 ? userMap.get(chat.user2_id) : userMap.get(chat.user1_id);
        const otherUserName = otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : '';

        return {
            ...chat,
            user1_name: userMap.get(chat.user1_id)?.first_name + " " + userMap.get(chat.user1_id)?.last_name,
            user2_name: otherUserName,
        };
    });

    return NextResponse.json({ data: transformedData }, { status: 200 });
}