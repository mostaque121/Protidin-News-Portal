"use client";

import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Edit,
  Layers,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

export interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  categoryId: string;
}

interface SubcategoriesClientProps {
  category: {
    id: string;
    name: string;
  };
  subcategories: SubcategoryItem[];
  deleteSubcategoryAction: (
    id: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function SubcategoriesClient({
  category,
  subcategories,
  deleteSubcategoryAction,
}: SubcategoriesClientProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header section with back button */}

      <div className="border-b border-border pb-4 space-y-3">
        <Link
          href="/admin/categories"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-navy transition-colors"
        >
          <ArrowLeft className="mr-1.5 size-3.5" />
          ক্যাটাগরি তালিকায় ফিরে যান
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className=" text-2xl sm:text-3xl font-black text-navy">
              {category.name} — সাবক্যাটাগরি সমূহ
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              এই ক্যাটাগরির আওতায় থাকা সাবক্যাটাগরিগুলো পরিচালনা করুন।
            </p>
          </div>
          <Link
            href={`/admin/categories/${category.id}/new`}
            className="flex items-center justify-center gap-2 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus size={16} /> নতুন সাবক্যাটাগরি
          </Link>
        </div>
      </div>

      {/* Grid view */}
      {subcategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-border bg-paper p-12 text-center rounded-none">
          <Layers className="mb-3 size-12 text-muted-foreground/40" />
          <h3 className=" text-lg font-bold text-navy">
            কোনো সাবক্যাটাগরি পাওয়া যায়নি
          </h3>
          <p className="mt-1 mb-5 text-xs text-muted-foreground">
            এই ক্যাটাগরিতে এখনো কোনো সাবক্যাটাগরি তৈরি করা হয়নি।
          </p>
          <Link
            href={`/admin/categories/${category.id}/new`}
            className="inline-flex items-center justify-center gap-2 bg-navy px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 rounded-none cursor-pointer"
          >
            <Plus className="size-4" />
            সাবক্যাটাগরি যোগ করুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((sub) => (
            <div
              key={sub.id}
              className="group relative flex flex-col justify-between border border-border bg-paper p-5 transition-colors hover:border-navy rounded-none"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 pr-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className=" text-lg font-bold text-navy transition-colors group-hover:text-primary">
                        {sub.name}
                      </h2>
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${
                          sub.isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {sub.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      /{sub.slug}
                    </p>
                  </div>

                  {/* Dropdown Menu - Positioned above card actions */}
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
                            router.push(
                              `/admin/categories/${category.id}/${sub.id}/edit`,
                            )
                          }
                          className="cursor-pointer rounded-none text-xs font-semibold text-navy hover:bg-muted focus:bg-muted"
                        >
                          <Edit className="mr-2 size-3.5 text-muted-foreground" />
                          এডিট
                        </DropdownMenuItem>

                        <DeleteDialog
                          action={() => deleteSubcategoryAction(sub.id)}
                          title="সাবক্যাটাগরি মুছুন"
                          description={`আপনি কি নিশ্চিত যে "${sub.name}" সাবক্যাটাগরিটি মুছে ফেলতে চান?`}
                          successMessage="সাবক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে"
                          errorMessage="সাবক্যাটাগরি মোছা সম্ভব হয়নি"
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
              <div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
                ক্রমবিন্যাস:{" "}
                <span className="font-mono font-bold text-navy">
                  {sub.sortOrder}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
