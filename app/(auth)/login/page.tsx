// app/admin/login/page.tsx
import { AdminLoginForm } from "@/components/admin/admin-login";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "অ্যাডমিন লগইন — প্রতিদিন",
};

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/admin");
  }
  return (
    // Suspense needed because the form reads useSearchParams() (callbackUrl)
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
