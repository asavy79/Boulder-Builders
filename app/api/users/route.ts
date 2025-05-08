import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PUT(request: NextRequest) {
    const supabase = await createClient();
    const updateData = await request.json();
    const { firstName, lastName } = updateData;

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update auth user metadata
    if (firstName || lastName) {
        const { error: authError } = await supabase.auth.updateUser({
            data: {
                first_name: firstName,
                last_name: lastName
            }
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 500 });
        }
    }

    // Handle profile updates if provided
    if (firstName || lastName) {
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                first_name: firstName,
                last_name: lastName
            })
            .eq('id', user.id);

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 500 });
        }
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
}
