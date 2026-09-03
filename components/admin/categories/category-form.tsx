"use client";

import { upsertCategoryAction } from "@/actions/category-actions";
import { QuantityStepper } from "@/components/my-ui/quantity-stepper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { CategoryFormData, categorySchema } from "@/lib/validation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
    isActive: boolean;
  };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditMode = Boolean(initialData?.id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      sortOrder: initialData?.sortOrder ?? 1,
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    setServerError(null);

    startTransition(async () => {
      const res = await upsertCategoryAction(data, initialData?.id);

      if (!res.success) {
        if (typeof res.error === "string") {
          setServerError(res.error);
        } else {
          toast.add({
            type: "error",
            description: "ফর্মটি সঠিকভাবে পূরণ করুন",
          });
        }
        return;
      }

      toast.add({
        type: "success",
        description: isEditMode
          ? "ক্যাটাগরি আপডেট করা হয়েছে"
          : "নতুন ক্যাটাগরি তৈরি করা হয়েছে",
      });

      router.push("/admin/categories");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header section with back button */}
      <div className="border-b border-border pb-4 space-y-3">
        <Link
          href="/admin/categories"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-navy transition-colors"
        >
          <ArrowLeft className="mr-1.5 size-3.5" />
          ক্যাটাগরি তালিকায় ফিরে যান
        </Link>
        <h1 className=" text-2xl sm:text-3xl font-black text-navy">
          {isEditMode ? "ক্যাটাগরি এডিট করুন" : "নতুন ক্যাটাগরি যোগ করুন"}
        </h1>
      </div>

      {/* Main Form Container */}
      <div className="border border-border bg-paper p-6 sm:p-8 rounded-none">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="border border-destructive/20 bg-destructive/10 p-3 text-xs font-semibold text-destructive rounded-none">
              {serverError}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-bold uppercase tracking-wider text-navy"
            >
              ক্যাটাগরির নাম *
            </Label>
            <Input
              id="name"
              placeholder="যেমন: রাজনীতি, খেলাধুলা"
              {...register("name")}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-xs font-semibold text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Slug Field */}
          <div className="space-y-2">
            <Label
              htmlFor="slug"
              className="text-xs font-bold uppercase tracking-wider text-navy"
            >
              স্ল্যাগ (Slug) *
            </Label>
            <Input
              id="slug"
              placeholder="e.g. politics, sports"
              {...register("slug")}
              disabled={isPending}
            />
            <p className="text-[11px] text-muted-foreground">
              ইউআরএল (URL) এর জন্য ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন (-)
              ব্যবহার করুন।
            </p>
            {errors.slug && (
              <p className="text-xs font-semibold text-destructive">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* Sort Order Field */}
          <div className="space-y-2">
            <Label
              htmlFor="sortOrder"
              className="text-xs font-bold uppercase tracking-wider text-navy"
            >
              ক্রমবিন্যাস (Sort Order)
            </Label>
            <Controller
              name="sortOrder"
              control={control}
              render={({ field }) => (
                <QuantityStepper
                  id="sortOrder"
                  min={0}
                  value={field.value ?? 1}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isPending}
                  ref={field.ref}
                />
              )}
            />
            {errors.sortOrder && (
              <p className="text-xs font-semibold text-destructive">
                {errors.sortOrder.message}
              </p>
            )}
          </div>

          {/* Is Active Switch */}
          <div className="flex items-center justify-between border border-border bg-paper p-4 rounded-none">
            <div className="space-y-1 pr-4">
              <Label
                htmlFor="isActive"
                className="cursor-pointer text-xs font-bold uppercase tracking-wider text-navy"
              >
                স্ট্যাটাস (সক্রিয়/নিষ্ক্রিয়)
              </Label>
              <p className="text-[11px] text-muted-foreground">
                সক্রিয় রাখলে সাইটে দেখাবে, নিষ্ক্রিয় করলে লুকানো থাকবে।
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={() => router.back()}
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
                  <Loader2 className="size-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {isEditMode ? "আপডেট করুন" : "তৈরি করুন"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
