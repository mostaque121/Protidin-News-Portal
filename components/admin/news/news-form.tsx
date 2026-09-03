"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { upsertArticleAction } from "@/actions/article-actions";
import { useCategory } from "@/contexts/category-provider";
import { ArticleFormData, articleSchema } from "@/lib/validation";

import { SingleImageUploader } from "@/components/my-ui/single-image-uploader";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

export interface ArticleInitialData {
  id: string;
  title: string;
  summary: string;
  reporter?: string | null;
  content: string;
  coverImage?: string | null;
  coverImageSource?: string | null;
  videoUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isTop: boolean;
  categoryId: string;
  subcategoryId?: string | null;
}

interface ArticleFormProps {
  initialData?: ArticleInitialData;
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const { categories } = useCategory();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditMode = Boolean(initialData?.id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || "",
      summary: initialData?.summary || "",
      reporter: initialData?.reporter || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
      coverImageSource: initialData?.coverImageSource || "",
      videoUrl: initialData?.videoUrl || "",
      status: initialData?.status || "DRAFT",
      isTop: initialData?.isTop ?? false,
      categoryId: initialData?.categoryId || categories[0]?.id || "",
      subcategoryId: initialData?.subcategoryId || "",
    },
  });

  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId,
  );
  const subcategories = selectedCategory?.subcategories || [];

  const onSubmit = (data: ArticleFormData) => {
    setServerError(null);

    startTransition(async () => {
      const res = await upsertArticleAction(data, initialData?.id);

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
          ? "সংবাদ আপডেট করা হয়েছে"
          : "নতুন সংবাদ প্রকাশ করা হয়েছে",
      });

      router.push("/admin/news");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <Link
          href="/admin/news"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-navy transition-colors"
        >
          <ArrowLeft className="mr-1.5 size-3.5" />
          সংবাদ তালিকায় ফিরে যান
        </Link>

        <h1 className=" text-3xl font-black text-navy">
          {isEditMode ? "সংবাদ এডিট করুন" : "নতুন সংবাদ যোগ করুন"}
        </h1>
        <p className="text-xs text-muted-foreground">
          পোর্টালের জন্য সংবাদের বিস্তারিত তথ্য ও মিডিয়া যুক্ত করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive font-medium">
            {serverError}
          </div>
        )}

        {/* Basic Details Panel */}
        <div className="border border-border bg-paper p-6 space-y-4">
          <h2 className=" text-lg font-bold text-navy border-b border-border pb-2">
            সাধারণ তথ্য
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-bold text-navy uppercase tracking-wider"
              >
                সংবাদের শিরোনাম *
              </Label>
              <Input
                id="title"
                placeholder="এখানে সংবাদের শিরোনাম লিখুন..."
                {...register("title")}
                disabled={isPending}
              />
              {errors.title && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Reporter */}
            <div className="space-y-1.5">
              <Label
                htmlFor="reporter"
                className="text-xs font-bold text-navy uppercase tracking-wider"
              >
                রিপোর্টার / প্রতিবেদক
              </Label>
              <Input
                id="reporter"
                placeholder="যেমন: নিজস্ব প্রতিবেদক"
                {...register("reporter")}
                disabled={isPending}
              />
              {errors.reporter && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.reporter.message}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <Label
                htmlFor="summary"
                className="text-xs font-bold text-navy uppercase tracking-wider"
              >
                সংক্ষিপ্ত সারসংক্ষেপ (Summary) *
              </Label>
              <Textarea
                id="summary"
                rows={3}
                placeholder="সংবাদের মূল অংশ সংক্ষিপ্তভাবে লিখুন..."
                {...register("summary")}
                disabled={isPending}
              />
              {errors.summary && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.summary.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Media Panel */}
        <div className="border border-border bg-paper p-6 space-y-4">
          <h2 className=" text-lg font-bold text-navy border-b border-border pb-2">
            মিডিয়া ও ছবি
          </h2>

          <div className="space-y-4">
            {/* Cover Image Uploader */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-navy uppercase tracking-wider">
                কভার ছবি
              </Label>
              <Controller
                name="coverImage"
                control={control}
                render={({ field }) => (
                  <SingleImageUploader
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    uploadPreset="news_portal_cover"
                    aspectRatio={16 / 9}
                    error={errors.coverImage?.message}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="coverImageSource"
                  className="text-xs font-bold text-navy uppercase tracking-wider"
                >
                  ছবি সৌজন্য / সোর্স
                </Label>
                <Input
                  id="coverImageSource"
                  placeholder="যেমন: ফোকাস বাংলা / ফাইল ছবি"
                  {...register("coverImageSource")}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="videoUrl"
                  className="text-xs font-bold text-navy uppercase tracking-wider"
                >
                  ভিডিও লিংক (ঐচ্ছিক)
                </Label>
                <Input
                  id="videoUrl"
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...register("videoUrl")}
                  disabled={isPending}
                />
                {errors.videoUrl && (
                  <p className="text-xs font-semibold text-destructive">
                    {errors.videoUrl.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tiptap Rich Text Content Panel */}
        <div className="border border-border bg-paper p-6 space-y-4">
          <h2 className=" text-lg font-bold text-navy border-b border-border pb-2">
            সংবাদ বিস্তারিত *
          </h2>
          <div className="space-y-2">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <SimpleEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content && (
              <p className="text-xs font-semibold text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Category & Organization Panel */}
        <div className="border border-border bg-paper p-6 space-y-4">
          <h2 className=" text-lg font-bold text-navy border-b border-border pb-2">
            ক্যাটাগরি ও স্ট্যাটাস
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Main Category */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="categoryId"
                  className="text-xs font-bold text-navy uppercase tracking-wider"
                >
                  মূল ক্যাটাগরি *
                </Label>
                <NativeSelect
                  id="categoryId"
                  {...register("categoryId")}
                  disabled={isPending}
                  className="w-full"
                >
                  <NativeSelectOption value="" disabled>
                    ক্যাটাগরি নির্বাচন করুন
                  </NativeSelectOption>
                  {categories.map((cat) => (
                    <NativeSelectOption key={cat.id} value={cat.id}>
                      {cat.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {errors.categoryId && (
                  <p className="text-xs font-semibold text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Subcategory */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="subcategoryId"
                  className="text-xs font-bold text-navy uppercase tracking-wider"
                >
                  সাবক্যাটাগরি
                </Label>
                <NativeSelect
                  className="w-full"
                  id="subcategoryId"
                  {...register("subcategoryId")}
                  disabled={isPending || subcategories.length === 0}
                >
                  <NativeSelectOption value="">কোনটিই নয়</NativeSelectOption>
                  {subcategories.map((sub) => (
                    <NativeSelectOption key={sub.id} value={sub.id}>
                      {sub.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-2">
              {/* Status Select */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="status"
                  className="text-xs font-bold text-navy uppercase tracking-wider"
                >
                  স্ট্যাটাস *
                </Label>
                <NativeSelect
                  className="w-full"
                  id="status"
                  {...register("status")}
                  disabled={isPending}
                >
                  <NativeSelectOption value="DRAFT">
                    খসড়া (Draft)
                  </NativeSelectOption>
                  <NativeSelectOption value="PUBLISHED">
                    প্রকাশিত (Published)
                  </NativeSelectOption>
                  <NativeSelectOption value="ARCHIVED">
                    আর্কাইভ (Archived)
                  </NativeSelectOption>
                </NativeSelect>
                {errors.status && (
                  <p className="text-xs font-semibold text-destructive">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Top News Switch Panel */}
              <div className="flex items-center justify-between border border-border bg-paper p-3">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="isTop"
                    className="cursor-pointer text-xs font-bold uppercase tracking-wider text-primary"
                  >
                    শীর্ষ সংবাদ
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    সক্রিয় করলে শীর্ষ সংবাদ হিসেবে হাইলাইট হবে।
                  </p>
                </div>
                <Controller
                  name="isTop"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isTop"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="border border-border bg-paper px-5 py-2.5 text-sm font-bold text-navy hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 bg-navy px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                সংরক্ষণ হচ্ছে...
              </>
            ) : (
              <>
                <Save className="size-4" />
                {isEditMode ? "আপডেট করুন" : "প্রকাশ করুন"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
