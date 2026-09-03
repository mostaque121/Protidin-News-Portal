// components/admin/profile/profile-view.tsx
"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState, useTransition } from "react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ChangePasswordDialog } from "./change-password-dialog";
import { EditProfileDialog } from "./edit-profile-dialog";
import { SessionsList, type SessionItem } from "./sessions-list";

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "ADMIN" | "MODERATOR";
}

const ROLE_LABEL: Record<ProfileUser["role"], string> = {
  ADMIN: "অ্যাডমিন",
  MODERATOR: "মডারেটর",
};

const ROLE_BADGE_CLASS: Record<ProfileUser["role"], string> = {
  ADMIN: "border-navy/20 bg-navy/10 text-navy",
  MODERATOR: "border-amber-500/20 bg-amber-500/10 text-amber-700",
};

export function ProfileView({
  user,
  currentToken,
  sessions,
}: {
  user: ProfileUser;
  currentToken: string;
  sessions: SessionItem[];
}) {
  const router = useRouter();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isSigningOut, startSignOut] = useTransition();

  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  const handleSignOut = () => {
    startSignOut(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="border border-border bg-paper p-6 sm:p-8 space-y-6 rounded-none">
        {/* Identity */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
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

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-1.5 shrink-0 border border-destructive/30 bg-destructive/5 px-3.5 py-2 text-xs font-bold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-50 rounded-none cursor-pointer"
          >
            {isSigningOut ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <LogOut className="size-4" />
                লগ আউট
              </>
            )}
          </button>
        </div>

        {/* Role */}
        <div className="border-t border-border pt-4">
          <span
            className={cn(
              "inline-block border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none",
              ROLE_BADGE_CLASS[user.role],
            )}
          >
            {ROLE_LABEL[user.role]}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="border border-border bg-paper px-4 py-2 text-xs font-bold text-navy transition-colors hover:bg-muted rounded-none cursor-pointer"
          >
            প্রোফাইল সম্পাদনা
          </button>
          <button
            type="button"
            onClick={() => setPasswordOpen(true)}
            className="border border-border bg-paper px-4 py-2 text-xs font-bold text-navy transition-colors hover:bg-muted rounded-none cursor-pointer"
          >
            পাসওয়ার্ড পরিবর্তন
          </button>
        </div>
      </div>

      <SessionsList sessions={sessions} currentToken={currentToken} />

      <ChangePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      />
      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        defaultValues={{ name: user.name, image: user.image ?? "" }}
      />
    </div>
  );
}
