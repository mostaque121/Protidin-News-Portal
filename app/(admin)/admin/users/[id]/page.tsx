// app/admin/users/[id]/page.tsx
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { UserDetailView } from "@/components/admin/users/user-detail-view";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  // Not logged in → middleware normally catches this, but double-guard here
  if (!session) redirect("/login");

  // Only admins may view/manage another user's detail page
  if (session.user.role !== "ADMIN") {
    redirect("/users");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  if (!user) notFound();

  const sessionsResult = await auth.api.listUserSessions({
    body: { userId: id },
    headers: requestHeaders,
  });

  return (
    <div className="mx-auto max-w-2xl">
      <UserDetailView
        currentUserId={session.user.id}
        user={user}
        sessions={sessionsResult?.sessions ?? []}
        currentToken={session.session?.token}
      />
    </div>
  );
}
