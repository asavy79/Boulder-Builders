import supabase from "./client";

export async function signInClient(email: string, password: string) {

    const {data, error} = await supabase.auth.signInWithPassword({
        email, password
    })

    if(error) {
        return {
            success: false,
            message: "Invalid credentials",
            error
        }
    }

    return {
        success: true
    }
}

export async function signOutClient() {
    const {error} = await supabase.auth.signOut();
    if(error) {
        return 0
    }
    return 1;
}