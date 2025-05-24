
import MessagesWithUser from "@/components/user-message-box";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function MessageBox({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if(user?.id === userId) {
    redirect("/messages");
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <MessagesWithUser userId={userId} />
    </div>
  );
}

