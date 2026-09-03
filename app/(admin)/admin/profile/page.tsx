// app/admin/profile/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ProfileView } from "@/components/admin/profile/profile-view";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "প্রোফাইল — প্রতিদিন অ্যাডমিন",
};

export default async function AdminProfilePage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    redirect("/admin/login");
  }

  const sessions = await auth.api.listSessions({ headers: requestHeaders });

  return (
    <div className="mx-auto max-w-2xl">
      <ProfileView
        user={session.user}
        currentToken={session.session.token}
        sessions={sessions}
      />
    </div>
  );
}
