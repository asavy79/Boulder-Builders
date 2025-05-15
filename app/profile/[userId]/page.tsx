import ProfileCard from "@/components/profile-card";

export default async function Profile({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = await params;
  console.log("USER ID: ", userId);

  return (
    <div className="flex flex-col items-center h-screen">
      <ProfileCard userId={userId} />
    </div>
  );
}
