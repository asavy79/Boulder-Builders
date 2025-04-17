import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import {UserCircleIcon, InboxArrowDownIcon } from "@heroicons/react/24/outline";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/profile">
        <UserCircleIcon className="w-6 h-6 hover:text-emerald-600 transition-colors duration-200" />
      </Link>
      <Link href="/messages">
        <InboxArrowDownIcon className="w-6 h-6 hover:text-emerald-600 transition-colors duration-200" />
      </Link>
      <form action={signOutAction}>
        <Button type="submit" variant={"auth"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="auth" variant={"auth"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="auth" variant={"auth"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
