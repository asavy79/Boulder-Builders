import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileEdit from "@/components/profile-edit";
import { SupabaseProvider } from "@/lib/supabase-context";

export default async function EditProfile() {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <SupabaseProvider>
                    <div>
            <ProfileEdit user={user}/>
        </div>
        </SupabaseProvider>

    )
}