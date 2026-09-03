// components/admin/profile/edit-profile-dialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  image: z.string().url("সঠিক URL দিন").or(z.literal("")).optional(),
});

type FormData = z.infer<typeof schema>;

export function EditProfileDialog({
  open,
  onOpenChange,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: FormData;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: FormData) => {
    setServerError(null);

    startTransition(async () => {
      await authClient.updateUser(
        { name: data.name, image: data.image || undefined },
        {
          onSuccess: () => {
            toast.add({
              type: "success",
              description: "প্রোফাইল আপডেট হয়েছে",
            });
            onOpenChange(false);
            router.refresh();
          },
          onError: (ctx) => {
            setServerError(ctx.error.message || "আপডেট ব্যর্থ হয়েছে");
          },
        },
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>প্রোফাইল সম্পাদনা</DialogTitle>
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
            <Label htmlFor="image">ছবির URL (ঐচ্ছিক)</Label>
            <Input
              id="image"
              placeholder="https://..."
              {...register("image")}
              disabled={isPending}
            />
            {errors.image && (
              <p className="text-xs text-destructive">{errors.image.message}</p>
            )}
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="border border-border bg-paper px-5 py-2.5 text-xs font-bold text-navy transition-colors hover:bg-muted disabled:opacity-50 rounded-none cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 bg-navy px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50 rounded-none cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                "সংরক্ষণ করুন"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
