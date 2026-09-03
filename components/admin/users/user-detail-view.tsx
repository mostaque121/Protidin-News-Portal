// components/admin/users/user-detail-view.tsx
"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  AdminUserSessionsList,
  type AdminSessionItem,
} from "./admin-user-sessions-list";
import { EditUserDialog } from "./edit-user-dialog";
import { SetUserPasswordDialog } from "./set-user-password-dialog";

type Role = "ADMIN" | "MODERATOR";

interface DetailUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
}

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "অ্যাডমিন",
  MODERATOR: "মডারেটর",
};

const ROLE_BADGE_CLASS: Record<Role, string> = {
  ADMIN: "border-navy/20 bg-navy/10 text-navy",
  MODERATOR: "border-amber-500/20 bg-amber-500/10 text-amber-700",
};

export function UserDetailView({
  user,
  sessions,
  currentUserId,
  currentToken,
}: {
  user: DetailUser;
  sessions: AdminSessionItem[];
  currentUserId?: string;
  currentToken?: string;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || "?";
  const isCurrentUser = currentUserId === user.id;

  const handleDeleteUser = async () => {
    const res = await authClient.admin.removeUser({ userId: user.id });
    if (res.error) {
      throw new Error(res.error.message || "ব্যবহারকারী মুছে ফেলা সম্ভব হয়নি");
    }
    router.push("/admin/users");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center text-xs font-semibold text-muted-foreground transition-colors hover:text-navy"
      >
        <ArrowLeft className="mr-1.5 size-3.5" />
        ব্যবহারকারী তালিকায় ফিরে যান
      </Link>

      <div className="space-y-6 border border-border bg-paper p-6 rounded-none sm:p-8">
        <div className="flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="size-16 border border-border object-cover rounded-none"
            />
          ) : (
            <div className="grid size-16 shrink-0 place-items-center bg-navy text-2xl font-bold text-white rounded-none">
              {initial}
            </div>
          )}
          <div className="min-w-0 space-y-1">
            <h2 className="truncate  text-xl font-bold text-navy">
              {user.name}
            </h2>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        {/* Role & Self Badge */}
        <div className="flex items-center gap-2 border-t border-border pt-4">
          <span
            className={cn(
              "inline-block border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none",
              ROLE_BADGE_CLASS[user.role],
            )}
          >
            {ROLE_LABEL[user.role]}
          </span>

          {isCurrentUser && (
            <span className="inline-block border border-emerald-600/20 bg-emerald-600/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 rounded-none">
              আপনি (নিজের অ্যাকাউন্ট)
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="cursor-pointer border border-border bg-paper px-4 py-2 text-xs font-bold text-navy transition-colors hover:bg-muted rounded-none"
          >
            প্রোফাইল সম্পাদনা
          </button>
          <button
            type="button"
            onClick={() => setPasswordOpen(true)}
            className="cursor-pointer border border-border bg-paper px-4 py-2 text-xs font-bold text-navy transition-colors hover:bg-muted rounded-none"
          >
            পাসওয়ার্ড পরিবর্তন
          </button>

          {!isCurrentUser && (
            <DeleteDialog
              action={handleDeleteUser}
              title="ব্যবহারকারী মুছে ফেলুন"
              description={`আপনি কি নিশ্চিত যে "${user.name}" ব্যবহারকারীকে স্থায়ীভাবে মুছে ফেলতে চান?`}
              successMessage="ব্যবহারকারী সফলভাবে মুছে ফেলা হয়েছে"
            >
              <button
                type="button"
                className="inline-flex cursor-pointer items-center border border-destructive/30 bg-destructive/5 px-4 py-2 text-xs font-bold text-destructive transition-colors hover:bg-destructive/15 rounded-none"
              >
                <Trash2 className="mr-1.5 size-3.5" />
                ব্যবহারকারী মুছুন
              </button>
            </DeleteDialog>
          )}
        </div>
      </div>

      <AdminUserSessionsList
        userId={user.id}
        sessions={sessions}
        currentToken={currentToken}
      />

      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        userId={user.id}
        defaultValues={{ name: user.name, image: user.image ?? "" }}
      />
      <SetUserPasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        userId={user.id}
      />
    </div>
  );
}
