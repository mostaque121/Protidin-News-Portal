"use client";

import {
  deleteArticleAction,
  getAdminArticlesAction,
  getAdminArticleStatsAction,
  type AdminArticlesResult,
  type AdminArticleStats,
} from "@/actions/article-actions";
import { ArticleFiltersBar } from "@/components/admin/news/article-filters-bar";
import { ArticleStatsCards } from "@/components/admin/news/article-stats-cards";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTimeAgo } from "@/lib/format-time";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Flame,
  Loader2,
  MoreVertical,
  Newspaper,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useMemo, useRef } from "react";

interface NewsPageClientProps {
  initialArticles: AdminArticlesResult;
  initialStats: AdminArticleStats;
  initialFilters: {
    search?: string;
    status?: string;
    categoryId?: string;
    subcategoryId?: string;
    month?: string;
    page: number;
  };
}

export function NewsPageClient({
  initialArticles,
  initialStats,
  initialFilters,
}: NewsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topAnchorRef = useRef<HTMLDivElement>(null);

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      status: searchParams.get("status") ?? "",
      categoryId: searchParams.get("categoryId") ?? "",
      subcategoryId: searchParams.get("subcategoryId") ?? "",
      month: searchParams.get("month") ?? "",
      page: Number(searchParams.get("page")) || 1,
    }),
    [searchParams],
  );

  const isInitial =
    filters.search === (initialFilters.search ?? "") &&
    filters.status === (initialFilters.status ?? "") &&
    filters.categoryId === (initialFilters.categoryId ?? "") &&
    filters.subcategoryId === (initialFilters.subcategoryId ?? "") &&
    filters.month === (initialFilters.month ?? "") &&
    filters.page === initialFilters.page;

  const { data: articlesResult, isFetching } = useQuery({
    queryKey: ["admin-articles", filters],
    queryFn: () => getAdminArticlesAction(filters),
    initialData: isInitial ? initialArticles : undefined,
    placeholderData: keepPreviousData,
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-article-stats"],
    queryFn: () => getAdminArticleStatsAction(),
    initialData: initialStats,
    staleTime: 60_000,
  });

  const updateParams = useCallback(
    (updates: Record<string, string | undefined | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      if (!("page" in updates)) next.set("page", "1");

      window.history.pushState(null, "", `${pathname}?${next.toString()}`);
    },
    [pathname, searchParams],
  );

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
    topAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const articles = articlesResult?.articles ?? [];
  const pagination = articlesResult?.pagination;

  return (
    <div className="space-y-6" ref={topAnchorRef}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className=" text-3xl font-black text-navy">সংবাদ ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            আপনার পোর্টালের সমস্ত খবর ফিল্টার করুন, পরিবর্তন ও পরিচালনা করুন।
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="flex items-center justify-center gap-2 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} /> নতুন সংবাদ
        </Link>
      </div>

      {/* Article Quick Stats */}
      {stats && <ArticleStatsCards stats={stats} />}

      {/* Filter Bar */}
      <ArticleFiltersBar filters={filters} onChange={updateParams} />

      {/* Content View Area */}
      <div className="relative min-h-75">
        {/* Loading Overlay */}
        {isFetching && (
          <div className="absolute inset-x-0 -top-3 z-30 flex items-center justify-center">
            <div className="flex items-center gap-2 border border-border bg-navy px-3 py-1 text-xs font-bold text-white shadow-sm">
              <Loader2 className="size-3.5 animate-spin" />
              আপডেট করা হচ্ছে...
            </div>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-border bg-paper p-12 text-center">
            <Newspaper className="size-12 text-navy/30 mb-3" />
            <h3 className=" text-lg font-bold text-navy">
              কোনো সংবাদ পাওয়া যায়নি
            </h3>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">
              আপনার ফিল্টার অনুযায়ী কোনো ডেটা বিদ্যমান নেই।
            </p>
            <button
              type="button"
              onClick={() =>
                updateParams({
                  search: undefined,
                  status: undefined,
                  categoryId: undefined,
                  subcategoryId: undefined,
                  month: undefined,
                })
              }
              className="border border-border bg-paper px-4 py-2 text-xs font-bold text-navy hover:bg-muted"
            >
              ফিল্টার ক্লিয়ার করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="group relative flex flex-col justify-between border border-border bg-paper  hover:border-navy/40 hover:shadow-md"
              >
                <div>
                  {/* Thumbnail & Overlay Badges */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                        <Newspaper className="size-10" />
                      </div>
                    )}

                    {/* Status Badges */}
                    <div className="absolute left-2 top-3 flex flex-wrap gap-1.5">
                      <span
                        className={` px-2.5 py-0.5 text-[10px] font-bold text-white uppercase shadow-sm ${
                          article.status === "PUBLISHED"
                            ? "bg-navy"
                            : article.status === "DRAFT"
                              ? "bg-gold text-navy"
                              : "bg-muted-foreground"
                        }`}
                      >
                        {article.status === "PUBLISHED"
                          ? "প্রকাশিত"
                          : article.status === "DRAFT"
                            ? "ড্রাফট"
                            : "আর্কাইভড"}
                      </span>

                      {article.isTop && (
                        <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm ">
                          <Flame className="size-3 fill-current" />
                          শীর্ষ
                        </span>
                      )}
                    </div>

                    {/* Options Action Menu Trigger */}
                    <div className="absolute right-2 top-2 z-20">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          nativeButton
                          render={
                            <button
                              type="button"
                              aria-label="অপশন"
                              className="grid size-8 place-items-center rounded-full border border-border bg-paper/90 text-navy shadow-sm transition-colors hover:bg-paper hover:text-primary"
                            >
                              <MoreVertical className="size-4" />
                            </button>
                          }
                        />
                        <DropdownMenuContent
                          align="end"
                          className="w-40 border border-border rounded-none bg-paper p-1 shadow-md"
                        >
                          <DropdownMenuItem
                            onClick={() => router.push(`/news/${article.id}`)}
                            className="cursor-pointer rounded-none text-xs font-semibold text-navy hover:bg-muted focus:bg-muted"
                          >
                            <Eye className="mr-2 size-4 text-muted-foreground" />
                            প্রিভিউ দেখুন
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/news/${article.id}/edit`)
                            }
                            className="cursor-pointer rounded-none text-xs font-semibold text-navy hover:bg-muted focus:bg-muted"
                          >
                            <Edit className="mr-2 size-4 text-muted-foreground" />
                            এডিট করুন
                          </DropdownMenuItem>

                          <DeleteDialog
                            action={() => deleteArticleAction(article.id)}
                            title="সংবাদ মুছে ফেলুন"
                            description={`আপনি কি নিশ্চিত যে "${article.title}" মুছে ফেলতে চান?`}
                            successMessage="সংবাদটি সফলভাবে মুছে ফেলা হয়েছে"
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

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-primary">
                      <span>{article.category.name}</span>
                      {article.subcategory && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {article.subcategory.name}
                          </span>
                        </>
                      )}
                    </div>

                    <Link href={`/admin/news/${article.id}/edit`}>
                      <h3 className=" text-base font-bold text-navy line-clamp-2 leading-snug transition-colors hover:text-primary">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* Card Footer Metadata */}
                <div className="border-t border-border bg-muted/30 px-4 py-2.5 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <User className="size-3.5 shrink-0 text-navy" />
                    <span className="truncate">
                      {article.reporter || article.author.name || "অজানা"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar className="size-3.5 text-navy" />
                    <span>{formatTimeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-between border-t border-border pt-4 gap-4">
            <p className="text-xs text-muted-foreground font-medium">
              মোট {pagination.totalCount.toLocaleString("bn-BD")} টির মধ্যে{" "}
              {((pagination.page - 1) * pagination.limit + 1).toLocaleString(
                "bn-BD",
              )}
              -
              {Math.min(
                pagination.page * pagination.limit,
                pagination.totalCount,
              ).toLocaleString("bn-BD")}{" "}
              দেখানো হচ্ছে
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage || isFetching}
                className="flex items-center gap-1 border border-border bg-paper px-3 py-1.5 text-xs font-semibold text-navy hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} /> পূর্ববর্তী
              </button>

              <span className="text-xs font-bold text-navy px-2">
                {pagination.page.toLocaleString("bn-BD")} /{" "}
                {pagination.totalPages.toLocaleString("bn-BD")}
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage || isFetching}
                className="flex items-center gap-1 border border-border bg-paper px-3 py-1.5 text-xs font-semibold text-navy hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                পরবর্তী <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
