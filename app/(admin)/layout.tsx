import { AdminMobileHeader } from "@/components/admin/admin-mobile-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "অ্যাডমিন ড্যাশবোর্ড — প্রতিদিন",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }
  const adminUser = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role as "ADMIN" | "MODERATOR",
  };
  return (
    <div className="flex min-h-screen">
      <AdminSidebar user={adminUser} />
      <div className="flex h-screen overflow-y-auto flex-1 flex-col">
        <AdminMobileHeader user={adminUser} />
        <main className="flex-1 bg-background px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
