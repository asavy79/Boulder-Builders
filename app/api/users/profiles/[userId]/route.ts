import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {

  const supabase = await createClient();



  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const { userId } = await params;

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      first_name,
      last_name,
      user_skills (
        skill_id,
        skills (
          name
        )
      )
    `)
    .eq("id", userId)
    .single();

  if (error) {
    console.log(error);
    return NextResponse.json({ message: "An error occurred fetching data" }, { status: 500 });
  }


  return NextResponse.json({ data }, { status: 200 });


}