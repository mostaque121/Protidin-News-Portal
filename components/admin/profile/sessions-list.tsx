// components/admin/profile/sessions-list.tsx
"use client";

import { Loader2, LogOut, Monitor } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState, useTransition } from "react";

import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { formatDateTime, parseDevice } from "@/lib/session-format";

export interface SessionItem {
  id: string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | string;
  expiresAt: Date | string;
}

export function SessionsList({
  sessions,
  currentToken,
}: {
  sessions: SessionItem[];
  currentToken: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [revokingToken, setRevokingToken] = useState<string | null>(null);

  const otherSessionsCount = sessions.filter(
    (s) => s.token !== currentToken,
  ).length;

  const revokeOne = (token: string) => {
    setRevokingToken(token);
    startTransition(async () => {
      await authClient.revokeSession(
        { token },
        {
          onSuccess: () => {
            toast.add({ type: "success", description: "সেশন লগআউট হয়েছে" });
            router.refresh();
          },
          onError: (ctx) => {
            toast.add({
              type: "error",
              description: ctx.error.message || "সেশন লগআউট ব্যর্থ হয়েছে",
            });
          },
        },
      );
      setRevokingToken(null);
    });
  };

  const revokeAllOthers = () => {
    startTransition(async () => {
      await authClient.revokeOtherSessions(
        {},
        {
          onSuccess: () => {
            toast.add({
              type: "success",
              description: "অন্য সব ডিভাইস থেকে লগআউট হয়েছে",
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
    <div className="border border-border bg-paper p-6 sm:p-8 rounded-none space-y-5">
      <div className="flex flex-row items-center justify-between gap-4 border-b border-border pb-4">
        <h3 className=" text-lg font-bold text-navy">সক্রিয় সেশন</h3>

        {otherSessionsCount > 0 && (
          <button
            type="button"
            onClick={revokeAllOthers}
            disabled={isPending}
            className="inline-flex items-center border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-50 rounded-none cursor-pointer"
          >
            <LogOut className="mr-1.5 size-3.5" />
            অন্য সব থেকে লগআউট
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sessions.map((session) => {
          const isCurrent = session.token === currentToken;
          const isRevoking = revokingToken === session.token;

          return (
            <div
              key={session.id}
              className="flex items-center justify-between gap-3 border border-border bg-paper p-4 rounded-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid size-9 shrink-0 place-items-center bg-muted text-navy rounded-none">
                  <Monitor className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-bold text-navy">
                      {parseDevice(session.userAgent)}
                    </p>
                    {isCurrent && (
                      <span className="shrink-0 border border-emerald-600/20 bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 rounded-none">
                        এই ডিভাইস
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 font-mono text-[11px] text-muted-foreground">
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
                  className="shrink-0 border border-transparent px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:border-destructive/20 hover:bg-destructive/10 disabled:opacity-50 rounded-none cursor-pointer"
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
