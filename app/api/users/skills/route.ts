import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";




export async function GET(request: NextRequest) {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data, error } = await supabase
        .from("user_skills")
        .select(`
            *,
            skill:skills (
                name
            )
        `)
        .eq("user_id", user.data.user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skill_id } = await request.json();

    const { data, error } = await supabase.from("user_skills").insert({
        user_id: user.data.user.id,
        skill_id: skill_id,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

