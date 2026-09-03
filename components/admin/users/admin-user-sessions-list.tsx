// components/admin/users/admin-user-sessions-list.tsx
"use client";

import { Loader2, LogOut, Monitor } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState, useTransition } from "react";

import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { formatDateTime, parseDevice } from "@/lib/session-format";

export interface AdminSessionItem {
  id: string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | string;
  expiresAt: Date | string;
}

export function AdminUserSessionsList({
  userId,
  sessions,
  currentToken,
}: {
  userId: string;
  sessions: AdminSessionItem[];
  currentToken?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [revokingToken, setRevokingToken] = useState<string | null>(null);

  const hasCurrentSession = sessions.some((s) => s.token === currentToken);

  const revokeOne = (token: string) => {
    setRevokingToken(token);
    startTransition(async () => {
      await authClient.admin.revokeUserSession(
        { sessionToken: token },
        {
          onSuccess: () => {
            toast.add({ type: "success", description: "সেশন লগআউট হয়েছে" });
            router.refresh();
          },
          onError: (ctx) => {
            toast.add({
              type: "error",
              description: ctx.error.message || "লগআউট ব্যর্থ হয়েছে",
            });
          },
        },
      );
      setRevokingToken(null);
    });
  };

  const revokeAll = () => {
    startTransition(async () => {
      await authClient.admin.revokeUserSessions(
        { userId },
        {
          onSuccess: () => {
            toast.add({
              type: "success",
              description: "সব ডিভাইস থেকে লগআউট করা হয়েছে",
            });
            router.refresh();
          },
          onError: (ctx) => {
            toast.add({
              type: "error",
              description: ctx.error.message || "লগআউট ব্যর্থ হয়েছে",
            });
          },
        },
      );
    });
  };

  return (
    <div className="space-y-5 border border-border bg-paper p-6 rounded-none sm:p-8">
      <div className="flex flex-row items-center justify-between gap-4 border-b border-border pb-4">
        <h3 className=" text-lg font-bold text-navy">সক্রিয় সেশন</h3>

        {sessions.length > 0 && !hasCurrentSession && (
          <button
            type="button"
            onClick={revokeAll}
            disabled={isPending}
            className="inline-flex cursor-pointer items-center border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-50 rounded-none"
          >
            <LogOut className="mr-1.5 size-3.5" />
            সব সেশন লগআউট
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sessions.length === 0 && (
          <p className="py-6 text-center text-xs font-medium text-muted-foreground">
            কোনো সক্রিয় সেশন নেই
          </p>
        )}

        {sessions.map((session) => {
          const isCurrent = session.token === currentToken;
          const isRevoking = revokingToken === session.token;

          return (
            <div
              key={session.id}
              className="flex items-center justify-between gap-3 border border-border bg-paper p-4 rounded-none"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center bg-muted text-navy rounded-none">
                  <Monitor className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate  text-sm font-bold text-navy">
                      {parseDevice(session.userAgent)}
                    </p>

                    {isCurrent && (
                      <span className="shrink-0 border border-emerald-600/20 bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 rounded-none">
                        বর্তমান সেশন
                      </span>
                    )}
                  </div>

                  <p className="truncate font-mono text-[11px] text-muted-foreground">
                    {session.ipAddress ? `${session.ipAddress} · ` : ""}
                    মেয়াদ শেষ {formatDateTime(session.expiresAt)}
                  </p>
                </div>
              </div>

              {!isCurrent && (
                <button
                  type="button"
                  onClick={() => revokeOne(session.token)}
                  disabled={isPending}
                  className="shrink-0 cursor-pointer border border-transparent px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:border-destructive/20 hover:bg-destructive/10 disabled:opacity-50 rounded-none"
                >
                  {isRevoking ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "লগআউট"
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
