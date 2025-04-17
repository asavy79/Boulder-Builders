"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
interface ProfileCardProps {
    user: User;
    stats?: {
        posts: number;
        streak: number;
        collaborations: number;
    };
}

export default function ProfileCard({ user, stats }: ProfileCardProps) {
    const userInitials = user.user_metadata?.first_name?.[0].toUpperCase() + user.user_metadata?.last_name?.[0].toUpperCase() || "U";

    return (
            <Card className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="bg-emerald-50 h-24 w-full" />
            <CardHeader className="relative -mt-12">
                <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarFallback className="bg-emerald-100 text-emerald-800 text-2xl">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-xl font-semibold text-gray-900">
                        {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                    </h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <div className="flex justify-center gap-4 mb-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">{stats?.posts || 0}</p>
                        <p className="text-sm text-gray-500">Posts</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">{stats?.streak || 0}</p>
                        <p className="text-sm text-gray-500">Day Streak</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">{stats?.collaborations || 0}</p>
                        <p className="text-sm text-gray-500">Collabs</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                        Builder
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                        Boulder
                    </Badge>
                </div>
                <div className="flex justify-center gap-4">
                    <Link href="/protected/reset-password">
                        <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                            Reset Password
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>

    );
}