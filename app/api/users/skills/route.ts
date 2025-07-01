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
        .eq("user_id", user.data.user.id).single();

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

    const { data: skillData, error: skillError } = await supabase.from("skills").select("id").eq("name", skill_id).single();

    const skillId = skillData?.id;

    if (skillError) {
        return NextResponse.json({ error: skillError.message }, { status: 500 });
    }

    if (!skillData) {
        return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const { data, error } = await supabase.from("user_skills").insert({
        user_id: user.data.user.id,
        skill_id: skillId,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data, skillId: skillId });
}

export async function DELETE(request: NextRequest) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skill_id } = await request.json();

    console.log(skill_id);
    console.log(user.data.user.id);
    const { data, error } = await supabase.from("user_skills").delete().eq("user_id", user.data.user.id).eq("skill_id", skill_id);

    if (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data });

}

