"use client";

import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  Edit,
  Folder,
  Layers,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

export interface CategoryWithSubCount {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  subcategories: { id: string }[];
}

interface CategoriesClientProps {
  categories: CategoryWithSubCount[];
  deleteCategoryAction: (
    id: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function CategoriesClient({
  categories,
  deleteCategoryAction,
}: CategoriesClientProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className=" text-3xl font-black text-navy">ক্যাটাগরি সমূহ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            আপনার ওয়েবসাইটের সকল ক্যাটাগরি ও তাদের সাবক্যাটাগরি পরিচালনা করুন।
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="flex items-center justify-center gap-2 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} /> নতুন ক্যাটাগরি
        </Link>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-border bg-paper p-12 text-center rounded-none">
          <Folder className="mb-3 size-12 text-muted-foreground/40" />
          <h3 className=" text-lg font-bold text-navy">
            কোনো ক্যাটাগরি পাওয়া যায়নি
          </h3>
          <p className="mt-1 mb-5 text-xs text-muted-foreground">
            শুরু করতে একটি নতুন ক্যাটাগরি তৈরি করুন।
          </p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center justify-center gap-2 bg-navy px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 rounded-none cursor-pointer"
          >
            <Plus className="size-4" />
            ক্যাটাগরি যোগ করুন
          </Link>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative flex flex-col justify-between border border-border bg-paper p-5 transition-colors hover:border-navy rounded-none"
            >
              {/* Overlay Link for entire Card navigation */}
              <Link
                href={`/admin/categories/${category.id}`}
                className="absolute inset-0 z-10"
                aria-label={`View subcategories for ${category.name}`}
              />

              {/* Card Header & Status */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 pr-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className=" text-lg font-bold text-navy transition-colors group-hover:text-primary">
                        {category.name}
                      </h2>
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${
                          category.isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {category.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      /{category.slug}
                    </p>
                  </div>

                  {/* Dropdown Menu - Positioned above the overlay link */}
                  <div
                    className="relative z-20 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        nativeButton={true}
                        render={
                          <button
                            type="button"
                            className="flex size-6 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-navy rounded-none cursor-pointer"
                          >
                            <MoreVertical className="size-4" />
                            <span className="sr-only">মেনু খুলুন</span>
                          </button>
                        }
                      />
                      <DropdownMenuContent
                        align="end"
                        className="w-40 border border-border bg-paper shadow-md rounded-none"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/categories/${category.id}/edit`)
                          }
                          className="cursor-pointer rounded-none text-xs font-semibold text-navy hover:bg-muted focus:bg-muted"
                        >
                          <Edit className="mr-2 size-3.5 text-muted-foreground" />
                          এডিট
                        </DropdownMenuItem>

                        <DeleteDialog
                          action={() => deleteCategoryAction(category.id)}
                          title="ক্যাটাগরি মুছুন"
                          description={`আপনি কি নিশ্চিত যে "${category.name}" ক্যাটাগরি এবং এর অধীনে থাকা সব সাবক্যাটাগরি মুছে ফেলতে চান?`}
                          successMessage="ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে"
                          errorMessage="ক্যাটাগরি মোছা সম্ভব হয়নি"
                        >
                          <button
                            onSelect={(e) => e.preventDefault()}
                            className="cursor-pointer rounded-none flex px-1.5 w-full py-1 text-xs font-semibold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                          >
                            <Trash2 className="mr-2 size-3.5" />
                            মুছে ফেলুন
                          </button>
                        </DeleteDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                  <Layers className="size-3.5 text-navy" />
                  <span>
                    সাবক্যাটাগরি: {category.subcategories?.length ?? 0} টি
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold text-navy transition-transform group-hover:translate-x-0.5">
                  <span>দেখুন</span>
                  <ChevronRight className="size-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
