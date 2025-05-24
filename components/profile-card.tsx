"use client";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase-context";

interface ProfileCardProps {
  userId: string;
}

export default function ProfileCard({ userId }: ProfileCardProps) {
  const [userDetails, setUserDetails] = useState<{
    id: string;
    initials: string;
    first_name: string;
    last_name: string;
  }>({ initials: "", first_name: "", last_name: "", id: "" });
  //   const userInitials =
  //     user.user_metadata?.first_name?.[0].toUpperCase() +
  //       user.user_metadata?.last_name?.[0].toUpperCase() || "U";
  const [skills, setSkills] = useState<string[]>([]);

  const { user, loading } = useSupabase();

  const redirectToMessage = (userId: string) => {
    window.location.href = `/messages/${userId}`;
    return;
  };

  useEffect(() => {
    const fetchSkills = async () => {
      const response = await fetch(`/api/users/profiles/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch skills");
        return;
      }

      const data = await response.json();
      console.log(data.data);
      setSkills(data.data.user_skills.map((skill: any) => skill.skills.name));
      setUserDetails({
        id: data.data.id,
        first_name: data.data.first_name,
        last_name: data.data.last_name,
        initials:
          data.data.first_name[0].toUpperCase() +
          data.data.last_name[0].toUpperCase(),
      });
    };

    fetchSkills();
  }, []);

  return (
    <Card className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-emerald-50 h-24 w-full" />
      <CardHeader className="relative -mt-12">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarFallback className="bg-emerald-100 text-emerald-800 text-2xl">
              {userDetails?.initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {userDetails.first_name} {userDetails.last_name}
          </h2>
          {/* <p className="text-sm text-gray-500">Email goes Here</p> */}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex justify-center gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">0</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">0</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">0</p>
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
        {user?.id !== userDetails.id && (
          <div className="flex flex-col items-center">
            <Button
              onClick={() => redirectToMessage(userDetails.id)}
            variant="auth"
          >
            Message
            </Button>
          </div>
        )}
        {user?.id === userDetails.id && (
          <div className="flex justify-center gap-4">
            <Link href="/protected/profile">
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-6 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
            <span className="text-sm text-gray-500">
              {skills.length} skills
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors duration-200 px-3 py-1"
              >
                {skill}
              </Badge>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No skills added yet
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
