// components/admin/users/add-user-dialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
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
import { NativeSelect } from "@/components/ui/native-select";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  email: z.string().min(1, "ইমেইল আবশ্যক").email("সঠিক ইমেইল দিন"),
  password: z.string().min(8, "কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন"),
  role: z.enum(["ADMIN", "MODERATOR"]),
});

type FormData = z.infer<typeof schema>;

export function AddUserDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", role: "MODERATOR" },
  });

  const onSubmit = (data: FormData) => {
    setServerError(null);

    startTransition(async () => {
      await authClient.admin.createUser(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        },
        {
          onSuccess: () => {
            toast.add({
              type: "success",
              description: "নতুন ব্যবহারকারী যোগ হয়েছে",
            });
            reset();
            setShowPassword(false);
            onOpenChange(false);
            router.refresh();
          },
          onError: (ctx) => {
            setServerError(ctx.error.message || "ব্যবহারকারী যোগ করা যায়নি");
          },
        },
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>নতুন ব্যবহারকারী যোগ করুন</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">নাম</Label>
            <Input id="name" {...register("name")} disabled={isPending} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">ইমেইল</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={isPending}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                disabled={isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label={
                  showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                }
              >
                {!showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">রোল</Label>
            <NativeSelect
              className="w-full"
              id="role"
              {...register("role")}
              disabled={isPending}
            >
              <option value="MODERATOR">মডারেটর</option>
              <option value="ADMIN">অ্যাডমিন</option>
            </NativeSelect>
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
                  যোগ হচ্ছে...
                </>
              ) : (
                "যোগ করুন"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
