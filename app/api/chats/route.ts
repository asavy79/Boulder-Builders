import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/helpers";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const user = await getUser(supabase);

    if (!user) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    const userId = user.id;

    const { data, error } = await supabase
        .from("chats")
        .select(`
            *,
            user1:profiles!user1_id(*),
            user2:profiles!user2_id(*)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while fetching chats!" }, { status: 500 });
    }

    const transformedData = data.map(chat => {
        const isUser1 = chat.user1_id === userId;
        const otherUser = isUser1 ? chat.user2 : chat.user1;
        const otherUserName = otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : '';

        return {
            ...chat,
            user1_name: `${chat.user1.first_name} ${chat.user1.last_name}`,
            user2_name: otherUserName,
        };
    });

    return NextResponse.json({ data: transformedData }, { status: 200 });
}