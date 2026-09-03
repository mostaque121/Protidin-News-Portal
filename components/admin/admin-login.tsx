// components/admin/admin-login-form.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "ইমেইল আবশ্যক").email("সঠিক ইমেইল দিন"),
  password: z.string().min(1, "পাসওয়ার্ড আবশ্যক"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);

    startTransition(async () => {
      await authClient.signIn.email(
        { email: data.email, password: data.password },
        {
          onSuccess: () => {
            const callbackUrl = searchParams.get("callbackUrl") || "/admin";
            router.push(callbackUrl);
            router.refresh();
          },
          onError: (ctx) => {
            setServerError(
              ctx.error.message || "লগইন ব্যর্থ হয়েছে, আবার চেষ্টা করুন",
            );
          },
        },
      );
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-sm rounded-none border border-border border-t-4 border-t-navy bg-paper shadow-md">
        <CardHeader className="space-y-2 border-b border-border/60 pb-6 text-center">
          <Link
            href="/"
            className="mx-auto block text-[32px] font-black tracking-[-.07em] text-navy"
          >
            প্রতিদিন<span className="text-primary">.</span>
          </Link>

          <p className="text-xs font-medium text-muted-foreground">
            নিয়ন্ত্রণ প্যানেলে প্রবেশ করতে তথ্য দিন
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="rounded-none border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-navy">
                ইমেইল
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@protidin.com"
                  autoComplete="email"
                  {...register("email")}
                  disabled={isPending}
                  className="rounded-none pr-10"
                />
                <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-navy">
                পাসওয়ার্ড
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  disabled={isPending}
                  className="rounded-none pr-10"
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
                  {showPassword ? (
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

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-none bg-navy px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                <>
                  <Lock className="size-3.5" />
                  লগইন করুন
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
