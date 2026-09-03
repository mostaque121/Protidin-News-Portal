// components/admin/profile/change-password-dialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

const schema = z
  .object({
    currentPassword: z.string().min(1, "বর্তমান পাসওয়ার্ড দিন"),
    newPassword: z.string().min(8, "কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormData) => {
    setServerError(null);

    startTransition(async () => {
      await authClient.changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          revokeOtherSessions: true,
        },
        {
          onSuccess: () => {
            toast.add({
              type: "success",
              description: "পাসওয়ার্ড পরিবর্তন হয়েছে",
            });
            reset();
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            onOpenChange(false);
          },
          onError: (ctx) => {
            setServerError(
              ctx.error.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে",
            );
          },
        },
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>পাসওয়ার্ড পরিবর্তন</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">বর্তমান পাসওয়ার্ড</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                {...register("currentPassword")}
                disabled={isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                disabled={isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label={
                  showCurrentPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                }
              >
                {!showCurrentPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">নতুন পাসওয়ার্ড</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                disabled={isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                disabled={isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label={
                  showNewPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                }
              >
                {!showNewPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                disabled={isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label={
                  showConfirmPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                }
              >
                {!showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer rounded-none border border-border bg-paper px-5 py-2.5 text-xs font-bold text-navy transition-colors hover:bg-muted disabled:opacity-50"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-none bg-navy px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  পরিবর্তন হচ্ছে...
                </>
              ) : (
                "পরিবর্তন করুন"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
