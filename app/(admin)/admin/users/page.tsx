// app/admin/users/page.tsx
import { UsersTable } from "@/components/admin/users/users-table";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // adjust to your actual prisma client path
import { headers } from "next/headers";

export const metadata = {
  title: "ব্যবহারকারী — প্রতিদিন অ্যাডমিন",
};

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <UsersTable canManage={session?.user.role === "ADMIN"} users={users} />
    </div>
  );
}
