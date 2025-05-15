"use client";
// import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { signInClient } from "@/utils/supabase/client-auth";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>("");

  const signInCheck = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const result = await signInClient(email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    window.location.href = "/feed";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form className="flex flex-col min-w-64 w-full max-w-md p-8 border border-black-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link
            className="text-foreground font-medium underline"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="you@example.com"
            required
          />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button onClick={signInCheck} variant="auth">
            Sign In
          </Button>
          {error && <a className="text-red-500">{error}</a>}
        </div>
      </form>
    </div>
  );
}
