import { NextResponse } from "next/server";
import { createClient } from "./supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";



export async function getUser(supabase: SupabaseClient) {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    return user;
}